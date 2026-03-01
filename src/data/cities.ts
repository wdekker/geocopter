import type { Region, City } from './types';
import { nlCities } from './regions/netherlands';
import { europeCities } from './regions/europe';
import { asiaCities } from './regions/asia';
import { africaCities } from './regions/africa';
import { americasCities } from './regions/americas';
import { oceaniaCities } from './regions/oceania';

export type { Region, City };

// The World dataset is an aggregation of all specific global regions
const worldCities: City[] = [
    ...europeCities,
    ...asiaCities,
    ...africaCities,
    ...americasCities,
    ...oceaniaCities,
];

export const REGIONS: Region[] = [
    {
        id: 'world',
        name: 'The World',
        center: [0, 0],
        zoom: 4,
        bounds: [85.0, -85.0, 180.0, -180.0],
        proximityScale: 3.0,
        cities: worldCities,
    },
    {
        id: 'europe',
        name: 'Europe',
        center: [52.3676, 4.9041],
        zoom: 6,
        bounds: [73.0, 34.0, 50.0, -25.0],
        proximityScale: 1.0,
        cities: europeCities,
    },
    {
        id: 'asia',
        name: 'Asia',
        center: [34.0, 100.0],
        zoom: 5,
        bounds: [81.0, -11.0, 180.0, 25.0],
        proximityScale: 1.5,
        cities: asiaCities,
    },
    {
        id: 'africa',
        name: 'Africa',
        center: [8.0, 20.0],
        zoom: 5,
        bounds: [38.0, -36.0, 60.0, -26.0],
        proximityScale: 1.5,
        cities: africaCities,
    },
    {
        id: 'americas',
        name: 'The Americas',
        center: [10.0, -90.0],
        zoom: 4,
        bounds: [84.0, -56.0, -30.0, -170.0],
        proximityScale: 2.0,
        cities: americasCities,
    },
    {
        id: 'oceania',
        name: 'Oceania',
        center: [-25.0, 135.0],
        zoom: 5,
        bounds: [15.0, -50.0, 220.0, 110.0],
        proximityScale: 1.5,
        cities: oceaniaCities,
    },
    {
        id: 'netherlands',
        name: 'The Netherlands',
        center: [52.1, 5.3],
        zoom: 9,
        bounds: [53.6, 50.7, 7.3, 3.2],
        proximityScale: 0.1,
        cities: nlCities,
    },
];

// Fallback for backwards compatibility
export const CITIES: City[] = worldCities;
