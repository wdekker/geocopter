import type { City } from '../types';

export const americasCities: City[] = [
    // North America
    { name: 'Washington, D.C.', state: 'District of Columbia', country: 'USA', lat: 38.8951, lng: -77.0364 },
    { name: 'New York', state: 'New York', country: 'USA', lat: 40.7128, lng: -74.0060 },
    { name: 'Los Angeles', state: 'California', country: 'USA', lat: 34.0522, lng: -118.2437 },
    { name: 'Chicago', state: 'Illinois', country: 'USA', lat: 41.8781, lng: -87.6298 },
    { name: 'Houston', state: 'Texas', country: 'USA', lat: 29.7604, lng: -95.3698 },
    { name: 'Phoenix', state: 'Arizona', country: 'USA', lat: 33.4484, lng: -112.0740 },
    { name: 'Philadelphia', state: 'Pennsylvania', country: 'USA', lat: 39.9526, lng: -75.1652 },
    { name: 'San Antonio', state: 'Texas', country: 'USA', lat: 29.4241, lng: -98.4936 },
    { name: 'San Diego', state: 'California', country: 'USA', lat: 32.7157, lng: -117.1611 },
    { name: 'Dallas', state: 'Texas', country: 'USA', lat: 32.7767, lng: -96.7970 },
    { name: 'San Jose', state: 'California', country: 'USA', lat: 37.3382, lng: -121.8863 },
    { name: 'Austin', state: 'Texas', country: 'USA', lat: 30.2672, lng: -97.7431 },
    { name: 'Jacksonville', state: 'Florida', country: 'USA', lat: 30.3322, lng: -81.6557 },
    { name: 'Fort Worth', state: 'Texas', country: 'USA', lat: 32.7555, lng: -97.3308 },
    { name: 'Columbus', state: 'Ohio', country: 'USA', lat: 39.9612, lng: -83.0007 },
    { name: 'San Francisco', state: 'California', country: 'USA', lat: 37.7749, lng: -122.4194 },
    { name: 'Ottawa', state: 'Ontario', country: 'Canada', lat: 45.4215, lng: -75.6972 },
    { name: 'Toronto', state: 'Ontario', country: 'Canada', lat: 43.6532, lng: -79.3832 },
    { name: 'Montreal', state: 'Quebec', country: 'Canada', lat: 45.5017, lng: -73.5673 },
    { name: 'Vancouver', state: 'British Columbia', country: 'Canada', lat: 49.2827, lng: -123.1207 },
    { name: 'Calgary', state: 'Alberta', country: 'Canada', lat: 51.0447, lng: -114.0719 },

    // Central America & Caribbean
    { name: 'Mexico City', country: 'Mexico', lat: 19.4326, lng: -99.1332 },
    { name: 'Guadalajara', country: 'Mexico', lat: 20.6597, lng: -103.3496 },
    { name: 'Monterrey', country: 'Mexico', lat: 25.6866, lng: -100.3161 },
    { name: 'Havana', country: 'Cuba', lat: 23.1136, lng: -82.3666 },
    { name: 'Kingston', country: 'Jamaica', lat: 17.9833, lng: -76.8000 },
    { name: 'Port-au-Prince', country: 'Haiti', lat: 18.5392, lng: -72.3350 },
    { name: 'Santo Domingo', country: 'Dominican Republic', lat: 18.4861, lng: -69.9312 },
    { name: 'San Juan', country: 'Puerto Rico', lat: 18.4655, lng: -66.1057 },
    { name: 'Guatemala City', country: 'Guatemala', lat: 14.6349, lng: -90.5069 },
    { name: 'San Salvador', country: 'El Salvador', lat: 13.6929, lng: -89.2182 },
    { name: 'Tegucigalpa', country: 'Honduras', lat: 14.0723, lng: -87.1921 },
    { name: 'Managua', country: 'Nicaragua', lat: 12.1150, lng: -86.2362 },
    { name: 'San Jose', country: 'Costa Rica', lat: 9.9281, lng: -84.0907 },
    { name: 'Panama City', country: 'Panama', lat: 8.9824, lng: -79.5199 },
    { name: 'Nassau', country: 'Bahamas', lat: 25.0443, lng: -77.3504 },

    // South America
    { name: 'Bogota', country: 'Colombia', lat: 4.7110, lng: -74.0721 },
    { name: 'Medellin', country: 'Colombia', lat: 6.2442, lng: -75.5812 },
    { name: 'Caracas', country: 'Venezuela', lat: 10.4806, lng: -66.9036 },
    { name: 'Quito', country: 'Ecuador', lat: -0.1807, lng: -78.4678 },
    { name: 'Guayaquil', country: 'Ecuador', lat: -2.1894, lng: -79.8891 },
    { name: 'Lima', country: 'Peru', lat: -12.0464, lng: -77.0428 },
    { name: 'La Paz', country: 'Bolivia', lat: -16.4897, lng: -68.1193 },
    { name: 'Sucre', country: 'Bolivia', lat: -19.0333, lng: -65.2627 },
    { name: 'Santiago', country: 'Chile', lat: -33.4489, lng: -70.6693 },
    { name: 'Buenos Aires', country: 'Argentina', lat: -34.6037, lng: -58.3816 },
    { name: 'Cordoba', country: 'Argentina', lat: -31.4201, lng: -64.1888 },
    { name: 'Montevideo', country: 'Uruguay', lat: -34.9011, lng: -56.1645 },
    { name: 'Asuncion', country: 'Paraguay', lat: -25.2637, lng: -57.5759 },
    { name: 'Brasilia', country: 'Brazil', lat: -15.8267, lng: -47.9218 },
    { name: 'Sao Paulo', country: 'Brazil', lat: -23.5505, lng: -46.6333 },
    { name: 'Rio de Janeiro', country: 'Brazil', lat: -22.9068, lng: -43.1729 },
    { name: 'Salvador', country: 'Brazil', lat: -12.9714, lng: -38.5014 },
    { name: 'Fortaleza', country: 'Brazil', lat: -3.7172, lng: -38.5430 },
    { name: 'Belo Horizonte', country: 'Brazil', lat: -19.9208, lng: -43.9378 },
    { name: 'Georgetown', country: 'Guyana', lat: 6.8013, lng: -58.1551 },
    { name: 'Paramaribo', country: 'Suriname', lat: 5.8520, lng: -55.2038 },
    // Mountains
    { name: "Aconcagua", country: "Argentina", lat: -32.6532, lng: -70.0109, type: "mountain" },
    { name: "Denali", country: "United States", lat: 63.0692, lng: -151.0070, type: "mountain" },
    { name: "Mount Logan", country: "Canada", lat: 60.5670, lng: -140.4055, type: "mountain" },
    { name: "Pico de Orizaba", country: "Mexico", lat: 19.0305, lng: -97.2698, type: "mountain" },
    { name: "Mount Whitney", country: "United States", lat: 36.5786, lng: -118.2920, type: "mountain" },
    
    // Rivers
    { name: "Amazon", country: "South America", lat: -3.4653, lng: -62.2159, type: "river" },
    { name: "Mississippi", country: "United States", lat: 35.5393, lng: -89.9238, type: "river" },
    { name: "Paraná", country: "South America", lat: -27.4667, lng: -58.8333, type: "river" },
    { name: "Colorado", country: "United States/Mexico", lat: 36.2163, lng: -112.0620, type: "river" },
    { name: "Mackenzie", country: "Canada", lat: 65.6560, lng: -128.2323, type: "river" },

    // Lakes & Seas
    { name: "Lake Superior", country: "Canada/US", lat: 47.7833, lng: -87.5000, type: "lake" },
    { name: "Lake Huron", country: "Canada/US", lat: 44.8000, lng: -82.4000, type: "lake" },
    { name: "Lake Michigan", country: "United States", lat: 44.0000, lng: -87.0000, type: "lake" },
    { name: "Lake Titicaca", country: "Bolivia/Peru", lat: -15.8333, lng: -69.3333, type: "lake" },
    { name: "Caribbean Sea", country: "Americas", lat: 15.0000, lng: -75.0000, type: "sea" },
    { name: "Hudson Bay", country: "Canada", lat: 60.0000, lng: -85.0000, type: "sea" },

    // Islands
    { name: "Greenland", country: "Greenland", lat: 71.7069, lng: -42.6043, type: "island" },
    { name: "Cuba", country: "Cuba", lat: 21.5218, lng: -77.7812, type: "island" },
    { name: "Hispaniola", country: "Haiti/Dominican Republic", lat: 18.9712, lng: -70.6580, type: "island" },
    { name: "Vancouver Island", country: "Canada", lat: 49.6500, lng: -125.4500, type: "island" },
    { name: "Tierra del Fuego", country: "Argentina/Chile", lat: -54.0000, lng: -69.0000, type: "island" },
    
    // National Parks
    { name: "Yellowstone", country: "United States", lat: 44.4280, lng: -110.5885, type: "national_park" },
    { name: "Yosemite", country: "United States", lat: 37.8651, lng: -119.5383, type: "national_park" },
    { name: "Banff", country: "Canada", lat: 51.4968, lng: -115.9281, type: "national_park" },
    { name: "Torres del Paine", country: "Chile", lat: -51.0000, lng: -73.0000, type: "national_park" },

    // Deserts
    { name: "Atacama Desert", country: "Chile", lat: -24.5000, lng: -69.2500, type: "desert" },
    { name: "Sonoran Desert", country: "USA/Mexico", lat: 31.8596, lng: -113.8058, type: "desert" },
    { name: "Mojave Desert", country: "United States", lat: 35.0110, lng: -115.4734, type: "desert" }
];
