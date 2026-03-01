import React, { useState, useEffect, useCallback } from 'react';
import { MapContainer, TileLayer, Marker, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Helicopter } from './Helicopter';
import { REGIONS, type Region, type City } from '../data/cities';
import { getDistanceInKm, getBearing } from '../utils/distance';
import { HUD } from './HUD';
import { StartScreen } from './StartScreen';
import { GameOverScreen } from './GameOverScreen';
import { UNLOCKABLE_AIRCRAFT, type Aircraft } from '../data/unlockables';
import { useAudio, type SoundType } from '../hooks/useAudio';
import { useHighScores } from '../hooks/useHighScores';
import { useTranslation } from '../contexts/LanguageContext';

const MAX_GAME_TIME_SECONDS = 120; // 2 minutes
const BASE_COLLISION_THRESHOLD_KM = 50; // Increased from 30km to 50km for a more forgiving hitbox
const BASE_VISIBILITY_THRESHOLD_KM = 300; // 300km base visibility
const BASE_MEDIUM_SIGNAL_THRESHOLD_KM = 800;

const MAP_URL_NORMAL = "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";
const MAP_URL_HARDCORE = "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}";

const targetIcon = L.divIcon({
    className: 'target-icon',
    html: `<div style="
    width: 24px; 
    height: 24px; 
    background-color: #ff3333; 
    border-radius: 50%;
    border: 2px solid white;
    animation: pulse 1s infinite;
    position: absolute;
    box-shadow: 0 0 10px rgba(255,0,0,0.8);
  "></div>`,
    iconSize: [24, 24],
    iconAnchor: [12, 12], // Anchors exactly into the center of the 24x24 box
});

// A small component simply to update the Map's center dynamically when Region changes
const MapCenterUpdater: React.FC<{ center: [number, number]; zoom: number }> = ({ center, zoom }) => {
    const map = useMap();
    useEffect(() => {
        map.setView(center, zoom, { animate: false });
    }, [center, zoom, map]);
    return null;
};

type GameState = 'MENU' | 'PLAYING' | 'GAME_OVER';

export const GameMap: React.FC = () => {
    const { playSound, stopSound } = useAudio();
    const { t } = useTranslation();
    const { saveScore, getBestScore, getTotalHighScore } = useHighScores();
    const [gameState, setGameState] = useState<GameState>('MENU');
    const [activeRegion, setActiveRegion] = useState<Region>(REGIONS[0]);
    const [helicopterPos, setHelicopterPos] = useState<[number, number]>(activeRegion.center);
    const [activeAircraft, setActiveAircraft] = useState<Aircraft>(UNLOCKABLE_AIRCRAFT[0]);

    // Game stats
    const [score, setScore] = useState(0);
    const [isNewHighScore, setIsNewHighScore] = useState(false);
    const [timeRemaining, setTimeRemaining] = useState(MAX_GAME_TIME_SECONDS);
    const [currentTarget, setCurrentTarget] = useState<City>(activeRegion.cities[0]);
    const [message, setMessage] = useState('');

    // Mechanics
    const [hardcoreMode, setHardcoreMode] = useState(false);
    const [showTarget, setShowTarget] = useState(false);
    const [signalStrength, setSignalStrength] = useState('Weak');
    const [bearing, setBearing] = useState(0);

    const assignNewTarget = useCallback((region: Region = activeRegion) => {
        const availableCities = region.cities;
        let newTarget = availableCities[Math.floor(Math.random() * availableCities.length)];

        // Ensure we don't get the same target twice in a row if there are multiple
        // Use a generic ref check to avoid stale closures during region switch
        window._lastTargetName = window._lastTargetName || '';
        while (newTarget.name === window._lastTargetName && availableCities.length > 1) {
            newTarget = availableCities[Math.floor(Math.random() * availableCities.length)];
        }

        window._lastTargetName = newTarget.name;
        setCurrentTarget(newTarget);
    }, [activeRegion]);

    const startGame = (region: Region, hardcore: boolean) => {
        setActiveRegion(region);
        setHardcoreMode(hardcore);
        setHelicopterPos(region.center);
        setScore(0);
        setIsNewHighScore(false);
        setTimeRemaining(MAX_GAME_TIME_SECONDS);
        assignNewTarget(region);
        setMessage('');
        setShowTarget(false);
        setSignalStrength('Weak');
        setGameState('PLAYING');
        playSound('start');
        playSound(activeAircraft.soundId as SoundType);
    };

    const handleQuitGame = () => {
        stopSound(activeAircraft.soundId as SoundType);
        stopSound('chopper'); // failsafe for legacy
        setGameState('MENU');
    };

    // Timer Loop
    useEffect(() => {
        let interval: ReturnType<typeof setInterval>;
        if (gameState === 'PLAYING' && timeRemaining > 0) {
            interval = setInterval(() => {
                setTimeRemaining(t => {
                    if (t <= 1) {
                        setGameState('GAME_OVER');
                        stopSound(activeAircraft.soundId as SoundType);

                        // NOTE: Since the effect closure might be slightly stale, we trust the `score` state
                        // inside the return callback to be accurate enough for end-game. In a prod app we'd use a ref.
                        const newHighScoreAchieved = saveScore(activeRegion.id, hardcoreMode, score);
                        setIsNewHighScore(newHighScoreAchieved);

                        playSound('finish');
                        return 0;
                    }
                    return t - 1;
                });
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [gameState, timeRemaining, activeRegion.id, hardcoreMode, score, saveScore, playSound, stopSound, activeAircraft.soundId]);

    // Check collision loop
    useEffect(() => {
        if (gameState !== 'PLAYING') return;

        const dist = getDistanceInKm(helicopterPos[0], helicopterPos[1], currentTarget.lat, currentTarget.lng);
        const heading = getBearing(helicopterPos[0], helicopterPos[1], currentTarget.lat, currentTarget.lng);

        setBearing(heading);

        // Apply Proximity Scalc based on region
        const visibilityThresh = BASE_VISIBILITY_THRESHOLD_KM * activeRegion.proximityScale;
        const mediumThresh = BASE_MEDIUM_SIGNAL_THRESHOLD_KM * activeRegion.proximityScale;
        const collisionThresh = BASE_COLLISION_THRESHOLD_KM * activeRegion.proximityScale;

        // Update proximity states
        setShowTarget(dist < visibilityThresh);

        if (dist < visibilityThresh) {
            setSignalStrength('Strong');
        } else if (dist < mediumThresh) {
            setSignalStrength('Medium');
        } else {
            setSignalStrength('Weak');
        }

        if (dist < collisionThresh) {
            playSound('success');
            setScore(s => s + (hardcoreMode ? 200 : 100)); // Double points for hardcore
            setMessage(t('foundCity', { city: currentTarget.name }));

            // Clear message after 2s
            setTimeout(() => setMessage(''), 2500);

            assignNewTarget();
        }
    }, [helicopterPos, currentTarget, assignNewTarget, hardcoreMode, gameState, activeRegion, playSound, t]);

    return (
        <div style={{ height: '100vh', width: '100vw', position: 'relative' }}>
            {gameState === 'MENU' && (
                <StartScreen
                    onStart={startGame}
                    activeRegion={activeRegion}
                    setActiveRegion={setActiveRegion}
                    hardcoreMode={hardcoreMode}
                    setHardcoreMode={setHardcoreMode}
                    highScore={getBestScore(activeRegion.id, hardcoreMode)}
                    totalCareerScore={getTotalHighScore()}
                    activeAircraft={activeAircraft}
                    setActiveAircraft={setActiveAircraft}
                />
            )}

            {gameState === 'GAME_OVER' && (
                <GameOverScreen
                    score={score}
                    bestScore={getBestScore(activeRegion.id, hardcoreMode)}
                    isNewHighScore={isNewHighScore}
                    onPlayAgain={() => setGameState('MENU')}
                />
            )}

            {gameState === 'PLAYING' && (
                <HUD
                    score={score}
                    timeRemaining={timeRemaining}
                    targetCity={currentTarget.name}
                    targetState={currentTarget.state}
                    targetCountry={currentTarget.country}
                    message={message}
                    hardcoreMode={hardcoreMode}
                    signalStrength={signalStrength}
                    bearing={bearing}
                    onQuit={handleQuitGame}
                />
            )}

            <MapContainer
                center={helicopterPos}
                zoom={activeRegion.zoom}
                scrollWheelZoom={false}
                doubleClickZoom={false}
                touchZoom={false}
                dragging={false}
                keyboard={false}
                zoomControl={false}
                style={{ height: '100%', width: '100%' }}
            >
                <MapCenterUpdater center={activeRegion.center} zoom={activeRegion.zoom} />

                <TileLayer
                    attribution='&copy; OpenStreetMap contributors & CartoDB'
                    url={hardcoreMode ? MAP_URL_HARDCORE : MAP_URL_NORMAL}
                />

                {showTarget && gameState === 'PLAYING' && (
                    <Marker position={[currentTarget.lat, currentTarget.lng]} icon={targetIcon} />
                )}

                {gameState === 'PLAYING' && (
                    <Helicopter
                        setPosition={setHelicopterPos}
                        bounds={activeRegion.bounds}
                        speedScale={activeRegion.proximityScale}
                        wrapLongitude={activeRegion.id === 'world'}
                        aircraft={activeAircraft}
                    />
                )}
            </MapContainer>
        </div>
    );
};

// Add to Window interface to hold small global temp vars
declare global {
    interface Window {
        _lastTargetName: string;
    }
}
