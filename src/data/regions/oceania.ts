import type { City } from '../types';

export const oceaniaCities: City[] = [
    // Australia
    { name: 'Canberra', country: 'Australia', lat: -35.2809, lng: 149.1300 },
    { name: 'Sydney', country: 'Australia', lat: -33.8688, lng: 151.2093 },
    { name: 'Melbourne', country: 'Australia', lat: -37.8136, lng: 144.9631 },
    { name: 'Brisbane', country: 'Australia', lat: -27.4698, lng: 153.0251 },
    { name: 'Perth', country: 'Australia', lat: -31.9505, lng: 115.8605 },
    { name: 'Adelaide', country: 'Australia', lat: -34.9285, lng: 138.6007 },
    { name: 'Gold Coast', country: 'Australia', lat: -28.0167, lng: 153.4000 },
    { name: 'Darwin', country: 'Australia', lat: -12.4634, lng: 130.8456 },
    { name: 'Hobart', country: 'Australia', lat: -42.8821, lng: 147.3272 },

    // New Zealand
    { name: 'Wellington', country: 'New Zealand', lat: -41.2865, lng: 174.7762 },
    { name: 'Auckland', country: 'New Zealand', lat: -36.8485, lng: 174.7633 },
    { name: 'Christchurch', country: 'New Zealand', lat: -43.5321, lng: 172.6362 },
    { name: 'Hamilton', country: 'New Zealand', lat: -37.7870, lng: 175.2793 },

    // Melanesia
    { name: 'Port Moresby', country: 'Papua New Guinea', lat: -9.4431, lng: 147.1803 },
    { name: 'Suva', country: 'Fiji', lat: -18.1248, lng: 178.4501 },
    { name: 'Honiara', country: 'Solomon Islands', lat: -9.4326, lng: 159.9575 },
    { name: 'Port Vila', country: 'Vanuatu', lat: -17.7348, lng: 168.3220 },
    { name: 'Noumea', country: 'New Caledonia', lat: -22.2711, lng: 166.4416 },

    // Polynesia
    { name: 'Apia', country: 'Samoa', lat: -13.8314, lng: -171.7695 },
    { name: 'Nuku\'alofa', country: 'Tonga', lat: -21.1394, lng: -175.2018 },
    { name: 'Papeete', country: 'French Polynesia', lat: -17.5350, lng: -149.5696 },
    { name: 'Funafuti', country: 'Tuvalu', lat: -8.5204, lng: 179.1962 },

    // Micronesia
    { name: 'Palikir', country: 'Micronesia', lat: 6.9171, lng: 158.1587 },
    { name: 'Majuro', country: 'Marshall Islands', lat: 7.0901, lng: 171.3802 },
    { name: 'Tarawa', country: 'Kiribati', lat: 1.4300, lng: 173.0000 },
    { name: 'Ngerulmud', country: 'Palau', lat: 7.5004, lng: 134.6243 },

    // Mountains
    { name: "Aoraki / Mount Cook", country: "New Zealand", lat: -43.5950, lng: 170.1418, type: "mountain" },
    { name: "Mount Wilhelm", country: "Papua New Guinea", lat: -5.7808, lng: 145.0322, type: "mountain" },
    { name: "Mount Kosciuszko", country: "Australia", lat: -36.4559, lng: 148.2636, type: "mountain" },
    { name: "Puncak Jaya", country: "Indonesia (Oceania)", lat: -4.0833, lng: 137.1833, type: "mountain" },
    { name: "Mount Taranaki", country: "New Zealand", lat: -39.2968, lng: 174.0634, type: "mountain" },
    
    // Rivers
    { name: "Murray River", country: "Australia", lat: -35.5562, lng: 138.8821, type: "river" },
    { name: "Darling River", country: "Australia", lat: -34.1130, lng: 141.9056, type: "river" },
    { name: "Waikato River", country: "New Zealand", lat: -37.4267, lng: 174.7214, type: "river" },
    { name: "Sepik River", country: "Papua New Guinea", lat: -3.8406, lng: 144.5361, type: "river" },
    { name: "Fly River", country: "Papua New Guinea", lat: -8.6256, lng: 143.6067, type: "river" },

    // Lakes & Seas
    { name: "Lake Eyre", country: "Australia", lat: -28.3667, lng: 137.2833, type: "lake" },
    { name: "Lake Taupo", country: "New Zealand", lat: -38.8167, lng: 175.9000, type: "lake" },
    { name: "Tasman Sea", country: "Australia/New Zealand", lat: -40.0000, lng: 160.0000, type: "sea" },
    { name: "Coral Sea", country: "Australia/Melanesia", lat: -15.0000, lng: 150.0000, type: "sea" },
    { name: "Lake Te Anau", country: "New Zealand", lat: -45.2000, lng: 167.8333, type: "lake" },
    
    // Islands
    { name: "Tasmania", country: "Australia", lat: -41.6401, lng: 146.3159, type: "island" },
    { name: "South Island", country: "New Zealand", lat: -43.9998, lng: 170.4716, type: "island" },
    { name: "North Island", country: "New Zealand", lat: -38.6483, lng: 176.3243, type: "island" },
    { name: "New Guinea", country: "Indonesia/PNG", lat: -5.0000, lng: 141.0000, type: "island" },
    { name: "Bora Bora", country: "French Polynesia", lat: -16.5004, lng: -151.7415, type: "island" },
    { name: "Fiji (Viti Levu)", country: "Fiji", lat: -17.8000, lng: 178.0000, type: "island" },

    // National Parks
    { name: "Kakadu", country: "Australia", lat: -13.2687, lng: 132.8252, type: "national_park" },
    { name: "Uluru-Kata Tjuta", country: "Australia", lat: -25.3288, lng: 131.0369, type: "national_park" },
    { name: "Fiordland", country: "New Zealand", lat: -45.4167, lng: 167.7167, type: "national_park" },
    { name: "Tongariro", country: "New Zealand", lat: -39.2000, lng: 175.5833, type: "national_park" },

    // Deserts
    { name: "Great Victoria Desert", country: "Australia", lat: -28.3183, lng: 128.5202, type: "desert" },
    { name: "Great Sandy Desert", country: "Australia", lat: -20.6667, lng: 124.2500, type: "desert" },
    { name: "Simpson Desert", country: "Australia", lat: -24.5760, lng: 137.4087, type: "desert" }
];
