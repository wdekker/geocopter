// Calculates the distance between two coordinates in degrees.
// For a true geographic game over large distances we'd use the Haversine formula, 
// but for simple 2D collision in degrees, Euclidean distance is often "good enough" for a small threshold.
// However, Haversine is safer to avoid longitude scaling issues near the poles.

export function getDistanceInKm(lat1: number, lon1: number, lat2: number, lon2: number) {
    const R = 6371; // Radius of the earth in km
    const dLat = deg2rad(lat2 - lat1);  // deg2rad below
    const dLon = deg2rad(lon2 - lon1);
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2)
        ;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const d = R * c; // Distance in km
    return d;
}

function deg2rad(deg: number) {
    return deg * (Math.PI / 180);
}

function rad2deg(rad: number) {
    return rad * (180 / Math.PI);
}

// Calculates the initial bearing (forward azimuth) between two points
export function getBearing(lat1: number, lon1: number, lat2: number, lon2: number) {
    const phi1 = deg2rad(lat1);
    const phi2 = deg2rad(lat2);
    const lam1 = deg2rad(lon1);
    const lam2 = deg2rad(lon2);

    const y = Math.sin(lam2 - lam1) * Math.cos(phi2);
    const x = Math.cos(phi1) * Math.sin(phi2) -
        Math.sin(phi1) * Math.cos(phi2) * Math.cos(lam2 - lam1);
    const theta = Math.atan2(y, x);
    const bearing = (rad2deg(theta) + 360) % 360; // in degrees
    return bearing;
}

// Ray-casting algorithm to determine if a point is inside a polygon
export function isPointInPolygon(lat: number, lng: number, polygon: [number, number][]): boolean {
    let isInside = false;
    for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
        const xi = polygon[i][0], yi = polygon[i][1];
        const xj = polygon[j][0], yj = polygon[j][1];
        
        const intersect = ((yi > lng) !== (yj > lng)) &&
            (lat < (xj - xi) * (lng - yi) / (yj - yi) + xi);
            
        if (intersect) isInside = !isInside;
    }
    return isInside;
}

// Check each segment of a polyline to see if the point is within the threshold distance
export function isPointNearLineSegments(lat: number, lng: number, line: [number, number][], thresholdKm: number): boolean {
    for (let i = 0; i < line.length - 1; i++) {
        const dist = distToSegment(lat, lng, line[i][0], line[i][1], line[i+1][0], line[i+1][1]);
        if (dist <= thresholdKm) return true;
    }
    return false;
}

// Helper to calculate shortest distance from point to a line segment
// Technically this is a planar approximation of spherical distance, but sufficient for our small collision radii
function distToSegment(px: number, py: number, vx: number, vy: number, wx: number, wy: number): number {
    const l2 = dist2(vx, vy, wx, wy);
    if (l2 === 0) return getDistanceInKm(px, py, vx, vy); // v == w case
    
    // Consider the line extending the segment, parameterized as v + t (w - v).
    // We find projection of point p onto the line. 
    // It falls where t = [(p-v) . (w-v)] / |w-v|^2
    let t = ((px - vx) * (wx - vx) + (py - vy) * (wy - vy)) / l2;
    t = Math.max(0, Math.min(1, t));
    
    // Projection falls on the segment
    const projX = vx + t * (wx - vx);
    const projY = vy + t * (wy - vy);
    return getDistanceInKm(px, py, projX, projY);
}

function dist2(vx: number, vy: number, wx: number, wy: number): number {
    return (vx - wx)*(vx - wx) + (vy - wy)*(vy - wy);
}
