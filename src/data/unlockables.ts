export interface Aircraft {
    id: string;
    name: string;
    sprite: string;
    requiredScore: number;
    baseScale: number;
    baseRotation: number;
    soundId: string;
}

export const UNLOCKABLE_AIRCRAFT: Aircraft[] = [
    {
        id: 'classic_heli',
        name: 'Classic Copter',
        sprite: '🚁',
        requiredScore: 0,
        baseScale: 1,
        baseRotation: 0,
        soundId: 'chopper'
    },
    {
        id: 'light_aircraft',
        name: 'Light Aircraft',
        sprite: '🛩️',
        requiredScore: 1000,
        baseScale: -1, // natively faces up-right (treat as right)
        baseRotation: -45, // -90 deg from previous 45 to point nose forward
        soundId: 'propeller'
    },
    {
        id: 'commercial_jet',
        name: 'Commercial Jet',
        sprite: '✈️',
        requiredScore: 3000,
        baseScale: -1, // natively faces right
        baseRotation: 0,
        soundId: 'jet'
    },
    {
        id: 'ufo',
        name: 'UFO',
        sprite: '🛸',
        requiredScore: 5000,
        baseScale: 1, // symmetrical
        baseRotation: 0,
        soundId: 'ufo'
    },
    {
        id: 'rocket',
        name: 'Rocket Ship',
        sprite: '🚀',
        requiredScore: 10000,
        baseScale: -1, // natively faces up-right (treat as right)
        baseRotation: 45, // flatten out clockwise
        soundId: 'rocket'
    },
    {
        id: 'eagle',
        name: 'Majestic Eagle',
        sprite: '🦅',
        requiredScore: 20000, // A true globe-trotting master
        baseScale: 1, // naturally left
        baseRotation: 0,
        soundId: 'eagle'
    }
];
