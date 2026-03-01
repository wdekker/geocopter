import { useEffect, useRef, useCallback } from 'react';

export type SoundType = 'start' | 'success' | 'finish' | 'chopper' | 'propeller' | 'jet' | 'ufo' | 'rocket' | 'eagle';

const SOUND_FILES: Record<SoundType, string> = {
    start: '/sounds/start.wav',
    success: '/sounds/success.wav',
    finish: '/sounds/finish.wav',
    chopper: '/sounds/chopper.wav',
    propeller: '/sounds/propeller.wav',
    jet: '/sounds/jet.wav',
    ufo: '/sounds/ufo.wav',
    rocket: '/sounds/rocket.wav',
    eagle: '/sounds/eagle.mp3',
};

export function useAudio() {
    const audioRefs = useRef<Record<string, HTMLAudioElement>>({});

    useEffect(() => {
        // Preload all sounds
        Object.entries(SOUND_FILES).forEach(([key, path]) => {
            const audio = new Audio(path);
            if (['chopper', 'propeller', 'jet', 'ufo', 'rocket', 'eagle'].includes(key)) {
                audio.loop = true;
                audio.volume = 0.3; // Keep chopper background noise low
            } else {
                audio.volume = 0.6; // UI sounds
            }
            audioRefs.current[key] = audio;
        });

        return () => {
            // Cleanup: stop any playing audio on unmount
            Object.values(audioRefs.current).forEach(audio => {
                audio.pause();
                audio.currentTime = 0;
            });
        };
    }, []);

    const playSound = useCallback((type: SoundType) => {
        const audio = audioRefs.current[type];
        if (audio) {
            // Reset to start if it's already playing (for overlapping successes)
            if (!['chopper', 'propeller', 'jet', 'ufo', 'rocket', 'eagle'].includes(type)) {
                audio.currentTime = 0;
            }

            // Only play if not already playing, or if it's a one-shot
            if (audio.paused) {
                audio.play().catch(e => console.log('Audio play failed (might need user interaction first):', e));
            }
        }
    }, []);

    const stopSound = useCallback((type: SoundType) => {
        const audio = audioRefs.current[type];
        if (audio && !audio.paused) {
            audio.pause();
            audio.currentTime = 0;
        }
    }, []);

    return { playSound, stopSound };
}
