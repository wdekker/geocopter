# Geogame OpenStreetMap Data Pipeline

This document explains how the geographic boundaries (areas and lines) in `src/data/regions/*.ts` were generated using real-world data from OpenStreetMap.

## Methodology

To provide accurate point-scoring zones for natural features like rivers, lakes, seas, and national parks, we use the OpenStreetMap Nominatim API to fetch their exact geometric boundaries.

A Node.js script (`fetch_osm.mjs`) was used to programmatically search the API for each feature defined in our region files. 

### API Query
The script queries Nominatim with the following parameters:
- `q=<Feature Name>`
- `countrycodes=<nl|etc>`
- `format=jsonv2`
- `polygon_geojson=1` (requests the full geometric boundary, not just the center point)

### Filtering and Selection
Nominatim often returns multiple results for a single name (e.g., "Merwede" could be a river, a street, or a neighborhood). The script filters the results to prioritize geographic features:
- It looks for items where `class` is one of: `waterway`, `natural`, `water`, `boundary`, `leisure`, or `place`.
- Or where `type` is one of: `river`, `canal`, `lake`, `national_park`.
- From the filtered list, it selects the first/best match.

### Geometry Processing
1. **Extraction**: Based on the expected feature type in the Geogame dataset (e.g., `river` vs `lake`), the script extracts either the LineString or the Polygon from the GeoJSON.
2. **Simplification**: Real-world geographical boundaries can contain tens of thousands of coordinate points, which would heavily degrade browser rendering performance. The script uses the **Douglas-Peucker algorithm** (with a tolerance of ~0.01 degrees) to simplify the geometry. This boils complex jagged shapes down to their essential outline, usually under 50 points.
3. **Coordinate Conversion**: The simplified GeoJSON coordinates (`[longitude, latitude]`) are transformed into Leaflet's required format (`[latitude, longitude]`).
4. **Fallback**: If a feature is extremely small (resulting in fewer than 3 points after simplification), the script discards the geometry, allowing the game to naturally fall back to using a standard center-point marker for that specific feature.

### Injection
The script then uses regex replacement to inject the generated `area` or `line` array back into the corresponding region TypeScript file, ensuring formatting is maintained.

## Re-running the Pipeline
If you add new regions or want to regenerate the boundaries, you can use the included `scripts/fetch_osm.mjs` script:

```bash
node scripts/fetch_osm.mjs src/data/regions/europe.ts
```
