import fs from 'fs';
import path from 'path';

const fileArg = process.argv[2];
if (!fileArg) {
    console.error('Usage: node scripts/fetch_osm.mjs <path/to/region.ts>');
    process.exit(1);
}

const filePath = path.resolve(fileArg);
if (!fs.existsSync(filePath)) {
    console.error(`File not found: ${filePath}`);
    process.exit(1);
}

let content = fs.readFileSync(filePath, 'utf-8');

const delay = ms => new Promise(res => setTimeout(res, ms));

// Haversine distance in kilometers
function getDistanceKm(lat1, lon1, lat2, lon2) {
    const R = 6371; // Earth's radius in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
}

// Calculate bounding box diagonal
function getBoundingBoxDiagonalKm(coords) {
    if (!coords || coords.length === 0) return 0;
    let minLat = Infinity, maxLat = -Infinity;
    let minLng = Infinity, maxLng = -Infinity;
    
    for (const p of coords) {
        if (p[1] < minLat) minLat = p[1];
        if (p[1] > maxLat) maxLat = p[1];
        if (p[0] < minLng) minLng = p[0];
        if (p[0] > maxLng) maxLng = p[0];
    }
    
    return getDistanceKm(minLat, minLng, maxLat, maxLng);
}

// Douglas-Peucker simplification
function getSqSegDist(p, p1, p2) {
    let x = p1[0], y = p1[1];
    let dx = p2[0] - x, dy = p2[1] - y;
    if (dx !== 0 || dy !== 0) {
        let t = ((p[0] - x) * dx + (p[1] - y) * dy) / (dx * dx + dy * dy);
        if (t > 1) { x = p2[0]; y = p2[1]; }
        else if (t > 0) { x += dx * t; y += dy * t; }
    }
    dx = p[0] - x; dy = p[1] - y;
    return dx * dx + dy * dy;
}
function simplifyDPStep(points, first, last, sqTolerance, simplified) {
    let maxSqDist = sqTolerance, index = -1;
    for (let i = first + 1; i < last; i++) {
        let sqDist = getSqSegDist(points[i], points[first], points[last]);
        if (sqDist > maxSqDist) { index = i; maxSqDist = sqDist; }
    }
    if (maxSqDist > sqTolerance) {
        if (index - first > 1) simplifyDPStep(points, first, index, sqTolerance, simplified);
        simplified.push(points[index]);
        if (last - index > 1) simplifyDPStep(points, index, last, sqTolerance, simplified);
    }
}
function simplify(points, tolerance) {
    if (points.length <= 2) return points;
    const sqTolerance = tolerance * tolerance;
    const last = points.length - 1;
    const simplified = [points[0]];
    simplifyDPStep(points, 0, last, sqTolerance, simplified);
    simplified.push(points[last]);
    return simplified;
}

function processCoords(coords) {
    const simplified = simplify(coords, 0.005); 
    return simplified.map(p => [p[1], p[0]]); // [lat, lng]
}

function formatCoordsArray(coords) {
    const arr = coords.map(p => `[${p[0].toFixed(4)}, ${p[1].toFixed(4)}]`);
    const chunks = [];
    for(let i=0; i<arr.length; i+=4) {
        chunks.push('            ' + arr.slice(i, i+4).join(', '));
    }
    return `[\n${chunks.join(',\n')}\n        ]`;
}

// Regex matching everything from "{ name" to the very first "}"
const featureRegex = /\{\s*name:\s*"([^"]+)",([^}]*)type:\s*"([^"]+)"[^}]*\}/g;

async function run() {
    let newContent = content;
    let matches = [...content.matchAll(featureRegex)];
    
    for (const match of matches) {
        const fullStr = match[0];
        const name = match[1];
        const middle = match[2];
        const type = match[3];
        
        let country = '';
        const countryMatch = middle.match(/country:\s*"([^"]+)"/);
        if (countryMatch) country = countryMatch[1];
        
        if (type === 'city') continue;
        
        console.log(`Fetching ${name}...`);
        
        // Remove existing arrays from fullStr.
        // We need a robust multiline regex since the previous script might have added massive arrays.
        // The arrays always start with `area: [` or `line: [` and end before the `}` of the city object.
        let cleanBase = fullStr.replace(/,\s*(?:area|line):\s*\[[\s\S]*?(?=\s*\})/g, ''); 
        if (!cleanBase.endsWith('}')) cleanBase += ' }'; 
        
        let queryParams = `q=${encodeURIComponent(name)}`;
        // if (country) {
        //     queryParams += `&country=${encodeURIComponent(country)}`;
        // }
        
        const url = `https://nominatim.openstreetmap.org/search.php?${queryParams}&format=jsonv2&polygon_geojson=1&limit=50`;
        
        try {
            const res = await fetch(url, { headers: { 'User-Agent': 'Geogame-App-Dev-Test/1.0' } });
            const data = await res.json();
            
            let bestMatch = null;
            
            if (data && data.length > 0) {
                const validCategories = ['waterway', 'natural', 'water', 'boundary', 'leisure', 'place', 'landuse'];
                // Only accept ways and relations, nodes are just points without true geometry boundaries
                let filtered = data.filter(item => 
                    item.osm_type !== 'node' && 
                    (validCategories.includes(item.category) || item.type === 'river' || item.type === 'canal' || item.type === 'lake' || item.type === 'national_park')
                );
                
                // Sort by bounding box size (diagonal distance) to get the largest possible representation 
                // (e.g. the full river relation instead of a small local segment)
                filtered.sort((a, b) => {
                    const getDiag = (item) => {
                        if (!item.boundingbox) return 0;
                        const [minLat, maxLat, minLng, maxLng] = item.boundingbox.map(Number);
                        return getDistanceKm(minLat, minLng, maxLat, maxLng);
                    };
                    return getDiag(b) - getDiag(a);
                });

                bestMatch = filtered.length > 0 ? filtered[0] : null;
            }
            
            if (bestMatch && bestMatch.geojson) {
                const geo = bestMatch.geojson;
                let coords = [];
                let key = '';
                
                if (['lake', 'sea', 'mountain', 'island', 'national_park', 'desert'].includes(type)) {
                    key = 'area';
                    if (geo.type === 'Polygon') {
                        coords = geo.coordinates[0];
                    } else if (geo.type === 'MultiPolygon') {
                        coords = geo.coordinates.reduce((a, b) => a[0].length > b[0].length ? a : b)[0];
                    }
                } else if (['river', 'canal'].includes(type)) {
                    key = 'line';
                    if (geo.type === 'LineString') {
                        coords = geo.coordinates;
                    } else if (geo.type === 'MultiLineString') {
                        // Concatenate all segment arrays into one large array of [lng, lat] pairs
                        coords = [].concat(...geo.coordinates);
                    } else if (geo.type === 'Polygon') { 
                        coords = geo.coordinates[0];
                    } else if (geo.type === 'MultiPolygon') {
                        coords = geo.coordinates[0][0];
                    }
                }
                
                
                // 10km filter MUST check the OSM boundingbox, NOT the extracted parsed local coordinates (because some coords fail extraction)
                if (bestMatch.boundingbox) {
                     const [minLat, maxLat, minLng, maxLng] = bestMatch.boundingbox.map(Number);
                     const sizeKm = getDistanceKm(minLat, minLng, maxLat, maxLng);
                     if (sizeKm < 10) {
                          console.log(`  -> Ignored (too small, ${sizeKm.toFixed(1)}km): ${bestMatch.category}/${bestMatch.type}`);
                          newContent = newContent.replace(fullStr, cleanBase);
                          continue; // skips to the next feature in the for-loop
                     }
                }

                if (coords && coords.length > 0) {
                    const leafletCoords = processCoords(coords);
                    
                    if (leafletCoords.length < 3 && key === 'area') {
                         console.log(`  -> Ignored (too few points after simplify): ${bestMatch.category}/${bestMatch.type}`);
                         newContent = newContent.replace(fullStr, cleanBase);
                         continue;
                    }
                    
                    const replacement = cleanBase.replace(' }', `,\n        ${key}: ${formatCoordsArray(leafletCoords)}\n    }`);
                    newContent = newContent.replace(fullStr, replacement);
                    console.log(`  -> Added ${key} with ${leafletCoords.length} points (${bestMatch.category}/${bestMatch.type}).`);
                } else {
                    console.log(`  -> Invalid geom type: ${geo.type} (${bestMatch.category}/${bestMatch.type})`);
                    newContent = newContent.replace(fullStr, cleanBase);
                }
            } else {
                console.log(`  -> Not found in Nominatim (or no valid category).`);
                newContent = newContent.replace(fullStr, cleanBase);
            }
        } catch(e) {
            console.error(`  -> Failed: ${e.message}`);
            newContent = newContent.replace(fullStr, cleanBase);
        }
        
        await delay(1200); 
    }
    
    fs.writeFileSync(filePath, newContent);
    console.log('Done!');
}

run();
