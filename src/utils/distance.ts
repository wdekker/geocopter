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
