import { useState, useEffect, useCallback } from 'react';

// Use a distinct key so it doesn't collide with other local projects
const STORAGE_KEY = 'geocopter_highscores_v1';

// Structure: { "europe_normal": 1500, "world_hardcore": 3200 }
export type HighScoreData = Record<string, number>;

export function useHighScores() {
    const [highScores, setHighScores] = useState<HighScoreData>({});

    // Load initial from localStorage on mount
    useEffect(() => {
        try {
            const raw = localStorage.getItem(STORAGE_KEY);
            if (raw) {
                setHighScores(JSON.parse(raw));
            }
        } catch (e) {
            console.error("Failed to parse high scores from local storage", e);
        }
    }, []);

    // Helper to generate the composite key
    const getContextKey = (regionId: string, hardcore: boolean) => {
        return `${regionId}_${hardcore ? 'hardcore' : 'normal'}`;
    };

    /**
     * Checks if a score is a new high score for the given context,
     * saves it if so, and returns a boolean indicating success.
     */
    const saveScore = useCallback((regionId: string, hardcore: boolean, score: number) => {
        const key = getContextKey(regionId, hardcore);

        setHighScores(prev => {
            const currentBest = prev[key] || 0;
            if (score > currentBest) {
                const updated = { ...prev, [key]: score };
                // Also persist to localStorage immediately
                try {
                    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
                } catch (e) {
                    console.error("Failed to save high scores", e);
                }
                return updated;
            }
            return prev;
        });

        // This closure is a bit stale reading `highScores` directly here, 
        // so we just return the calculation raw for immediate consumer use
        const currentBest = highScores[key] || 0;
        return score > currentBest;
    }, [highScores]);

    /**
     * Retrieves the current best score for a specific context
     */
    const getBestScore = useCallback((regionId: string, hardcore: boolean) => {
        const key = getContextKey(regionId, hardcore);
        return highScores[key] || 0;
    }, [highScores]);

    /**
     * Calculates the sum of all high scores across all contexts
     * to determine the player's total career score.
     */
    const getTotalHighScore = useCallback(() => {
        return Object.values(highScores).reduce((sum, score) => sum + score, 0);
    }, [highScores]);

    return {
        highScores,
        saveScore,
        getBestScore,
        getTotalHighScore
    };
}
