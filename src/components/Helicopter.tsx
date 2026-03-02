import React, { useState } from 'react';
import { useMap, useMapEvents } from 'react-leaflet';
import type { LeafletMouseEvent } from 'leaflet';
import { useControls } from '../hooks/useControls';
import type { Aircraft } from '../data/unlockables';

const BASE_SPEED = 0.05; // Base degrees per frame (calibrated for Europe)

interface HelicopterProps {
    setPosition: React.Dispatch<React.SetStateAction<[number, number]>>;
    bounds: [number, number, number, number]; // [north, south, east, west]
    speedScale: number;
    wrapLongitude?: boolean;
    aircraft: Aircraft;
}

// Maintain pointer state outside React lifecycle so it survives re-renders when cities are found.
let globalPointerActive = false;
let globalTargetDestination: [number, number] | null = null;

export const Helicopter: React.FC<HelicopterProps> = ({ setPosition, bounds, speedScale, wrapLongitude = false, aircraft }) => {
    const map = useMap();
    const keys = useControls();

    const [scaleX, setScaleX] = useState<number>(1); // 1 = facing left, -1 = facing right
    const [rotation, setRotation] = useState<number>(0);

    // Listen for map clicks and drags (works for both mouse and touch)
    useMapEvents({
        mousedown(e: LeafletMouseEvent) {
            globalPointerActive = true;
            globalTargetDestination = [e.latlng.lat, e.latlng.lng];
        },
        mousemove(e: LeafletMouseEvent) {
            if (globalPointerActive) {
                globalTargetDestination = [e.latlng.lat, e.latlng.lng];
            }
        },
        mouseup() {
            globalPointerActive = false;
            globalTargetDestination = null;
        },
        mouseout() {
            globalPointerActive = false;
            globalTargetDestination = null;
        }
    });

    // Native touch override (Leaflet sometimes swallows touchmove for panning)
    React.useEffect(() => {
        const container = map.getContainer();

        const handleTouchStart = (e: TouchEvent) => {
            if (e.touches.length > 0) {
                globalPointerActive = true;
                const touch = e.touches[0];
                const latlng = map.mouseEventToLatLng(touch as unknown as MouseEvent);
                globalTargetDestination = [latlng.lat, latlng.lng];
            }
        };

        const handleTouchMove = (e: TouchEvent) => {
            if (globalPointerActive && e.touches.length > 0) {
                const touch = e.touches[0];
                const latlng = map.mouseEventToLatLng(touch as unknown as MouseEvent);
                globalTargetDestination = [latlng.lat, latlng.lng];
            }
        };

        const handleTouchEnd = () => {
            globalPointerActive = false;
            globalTargetDestination = null;
        };

        // Use capture phase to intercept before Leaflet's drag handlers stop propagation
        container.addEventListener('touchstart', handleTouchStart, { passive: true, capture: true });
        container.addEventListener('touchmove', handleTouchMove, { passive: true, capture: true });
        container.addEventListener('touchend', handleTouchEnd, { passive: true, capture: true });
        container.addEventListener('touchcancel', handleTouchEnd, { passive: true, capture: true });

        return () => {
            container.removeEventListener('touchstart', handleTouchStart, { capture: true });
            container.removeEventListener('touchmove', handleTouchMove, { capture: true });
            container.removeEventListener('touchend', handleTouchEnd, { capture: true });
            container.removeEventListener('touchcancel', handleTouchEnd, { capture: true });
        };
    }, [map]);

    React.useEffect(() => {
        let animationFrameId: number;

        const gameLoop = () => {
            setPosition((prevPosition) => {
                let newLat = prevPosition[0];
                let newLng = prevPosition[1];
                let moved = false;

                let curScaleX = scaleX;
                let curRot = 0;

                const currentSpeed = BASE_SPEED * speedScale;

                // 1. Keyboard Movement overrides Pointer Movement
                if (keys.a || keys.ArrowLeft || keys.d || keys.ArrowRight || keys.w || keys.ArrowUp || keys.s || keys.ArrowDown) {
                    globalTargetDestination = null; // Clear pointer target if user uses keyboard
                    if (keys.a || keys.ArrowLeft) {
                        newLng -= currentSpeed;
                        curScaleX = 1;
                        moved = true;
                    }
                    if (keys.d || keys.ArrowRight) {
                        newLng += currentSpeed;
                        curScaleX = -1;
                        moved = true;
                    }
                    if (keys.w || keys.ArrowUp) {
                        newLat += currentSpeed;
                        curRot = 15; // pitch nose up towards North
                        moved = true;
                    }
                    if (keys.s || keys.ArrowDown) {
                        newLat -= currentSpeed;
                        curRot = -15; // pitch nose down towards South
                        moved = true;
                    }
                }
                // 2. Pointer Movement (Fly towards destination)
                else if (globalTargetDestination) {
                    const [targetLat, targetLng] = globalTargetDestination;

                    // Simple vector math to move towards target
                    const dLat = targetLat - newLat;
                    const dLng = targetLng - newLng;
                    const distance = Math.sqrt(dLat * dLat + dLng * dLng);

                    if (distance > currentSpeed) {
                        // Normalize vector and scale by speed
                        newLat += (dLat / distance) * currentSpeed;
                        newLng += (dLng / distance) * currentSpeed;
                        moved = true;

                        // Visual styling based on direction
                        if (dLng > 0) curScaleX = -1; // Moving East
                        else if (dLng < 0) curScaleX = 1; // Moving West

                        if (dLat > 0) curRot = 15; // Moving North
                        else if (dLat < 0) curRot = -15; // Moving South
                    } else {
                        // Arrived at destination
                        newLat = targetLat;
                        newLng = targetLng;
                        globalTargetDestination = null;
                        moved = true; // One final move frame to exact spot
                    }
                }

                if (moved) {
                    setScaleX(curScaleX);
                    setRotation(curRot);
                } else {
                    // Return to level flight if not moving
                    setRotation(0);
                }

                // Clamp to boundaries [north, south, east, west]
                const [northEdge, southEdge, eastEdge, westEdge] = bounds;

                // Prevent overshooting boundaries
                if (newLat > northEdge) newLat = northEdge;
                if (newLat < southEdge) newLat = southEdge;

                if (wrapLongitude) {
                    // Endless horizontal flying: wrap around the anti-meridian
                    if (newLng > 180) newLng -= 360;
                    if (newLng < -180) newLng += 360;
                } else {
                    if (newLng > eastEdge) newLng = eastEdge;
                    if (newLng < westEdge) newLng = westEdge;
                }

                const newPos: [number, number] = [newLat, newLng];

                if (moved) {
                    // Keep map centered on helicopter
                    map.panTo(newPos, { animate: false });
                }

                return newPos;
            });

            animationFrameId = requestAnimationFrame(gameLoop);
        };

        animationFrameId = requestAnimationFrame(gameLoop);

        return () => cancelAnimationFrame(animationFrameId);
    }, [keys, map, setPosition, scaleX, bounds, speedScale, wrapLongitude, aircraft]);

    return (
        <div style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: `translate(-50%, -50%)`,
            zIndex: 1000,
            pointerEvents: 'none'
        }}>
            <div style={{ animation: 'hoverAnim 2s infinite ease-in-out' }}>
                <div style={{
                    fontSize: '48px',
                    transform: `scaleX(${scaleX * aircraft.baseScale}) rotate(${aircraft.baseRotation + (rotation * aircraft.baseScale)}deg)`,
                    transition: 'transform 0.1s ease-out',
                    textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
                }}>
                    {aircraft.sprite}
                </div>
            </div>
            <style>
                {`
                @keyframes hoverAnim {
                    0% { transform: translateY(0px); }
                    50% { transform: translateY(-8px); }
                    100% { transform: translateY(0px); }
                }
                `}
            </style>
        </div>
    );
};
