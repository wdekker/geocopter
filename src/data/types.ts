export interface City {
    name: string;
    state?: string;  // State or province, optional for global cities
    country: string; // Used for "Region/State/Country" depending on scope
    lat: number;
    lng: number;
    type?: string;   // Distinguishes rivers, mountains, etc. defaults to "city"
    area?: [number, number][]; // Optional Polygon boundary coordinates [lat, lng]
    line?: [number, number][] | [number, number][][]; // Optional Polyline segment coordinates [lat, lng]
}
export interface Region {
    id: string;
    name: string;
    center: [number, number]; // [lat, lng]
    zoom: number; // For initial map zoom
    bounds: [number, number, number, number]; // [north, south, east, west]
    proximityScale: number; // Multiplier for visibility/collision thresholds
    cities: City[];
}
