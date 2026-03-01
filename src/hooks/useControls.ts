import { useEffect, useState } from 'react';

export function useControls() {
    const [keys, setKeys] = useState<{ [key: string]: boolean }>({
        w: false,
        a: false,
        s: false,
        d: false,
        ArrowUp: false,
        ArrowLeft: false,
        ArrowDown: false,
        ArrowRight: false,
    });

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            setKeys((prev) => {
                if (e.key in prev && !prev[e.key]) {
                    return { ...prev, [e.key]: true };
                }
                return prev;
            });
        };

        const handleKeyUp = (e: KeyboardEvent) => {
            setKeys((prev) => {
                if (e.key in prev && prev[e.key]) {
                    return { ...prev, [e.key]: false };
                }
                return prev;
            });
        };

        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('keyup', handleKeyUp);

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('keyup', handleKeyUp);
        };
    }, []);

    return keys;
}
