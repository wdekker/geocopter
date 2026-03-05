import React from 'react';
import { useTranslation } from '../contexts/LanguageContext';
import type { TranslationKey } from '../i18n/translations';

interface HUDProps {
    score: number;
    timeRemaining: number;
    targetCity: string;
    targetState?: string;
    targetCountry: string;
    targetType?: string;
    message: string;
    hardcoreMode: boolean;
    signalStrength: string;
    bearing: number;
    onQuit: () => void;
}

export const HUD: React.FC<HUDProps> = ({ score, timeRemaining, targetCity, targetState, targetCountry, targetType = 'city', message, hardcoreMode, signalStrength, bearing, onQuit }) => {
    const { t } = useTranslation();

    // Format mm:ss
    const formatTime = (seconds: number) => {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    };

    return (
        <div className="responsive-hud-container" style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            padding: '20px',
            boxSizing: 'border-box',
            display: 'flex',
            justifyContent: 'space-between',
            pointerEvents: 'none',
            zIndex: 1000,
            fontFamily: 'sans-serif',
            color: 'white',
            textShadow: '2px 2px 4px rgba(0,0,0,0.8)',
            touchAction: 'none'
        }}>
            <div>
                <h1 className="responsive-hud-title" style={{ margin: 0, fontSize: '2rem' }}>GeoCopter</h1>
                <h2 className="responsive-hud-subtitle" style={{ margin: '5px 0', fontSize: '1.5rem', color: '#ffd700' }}>
                    {t('target')}: {targetCity}{targetType !== 'city' ? ` (${t((targetType === 'bay' || targetType === 'peninsula' ? 'bays_and_peninsulas' : targetType === 'national_park' ? 'national_parks' : targetType + 's') as TranslationKey)})` : ''} {hardcoreMode ? '(???)' : (targetState ? `(${targetState}, ${targetCountry})` : `(${targetCountry})`)}
                </h2>

                <div style={{
                    marginTop: '10px',
                    padding: '5px 10px',
                    backgroundColor: 'rgba(0,0,0,0.5)',
                    borderRadius: '4px',
                    display: 'inline-block'
                }}>
                    {t('signal')}: <span style={{
                        color: signalStrength === 'Strong' ? '#00ff00' :
                            signalStrength === 'Medium' ? '#ffff00' : '#ff4444',
                        fontWeight: 'bold',
                        marginRight: '15px'
                    }}>{t(signalStrength.toLowerCase() as TranslationKey)}</span>

                    {signalStrength === 'Weak' && (
                        <div style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '5px',
                            backgroundColor: 'rgba(255, 255, 255, 0.1)',
                            padding: '2px 8px',
                            borderRadius: '12px'
                        }}>
                            <span style={{ fontSize: '0.9rem', color: '#ccc' }}>{t('hint')}</span>
                            <svg
                                width="20"
                                height="20"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="#00d0ff"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                style={{
                                    transform: `rotate(${bearing}deg)`,
                                    transition: 'transform 0.2s ease'
                                }}
                            >
                                <line x1="12" y1="19" x2="12" y2="5"></line>
                                <polyline points="5 12 12 5 19 12"></polyline>
                            </svg>
                        </div>
                    )}
                </div>

                {message && (
                    <div style={{
                        marginTop: '10px',
                        padding: '10px 20px',
                        backgroundColor: 'rgba(0,0,0,0.7)',
                        borderRadius: '8px',
                        display: 'block', // Ensure it starts on a new line
                        fontSize: '1.2rem',
                        animation: 'fadeInOut 2s ease-in-out'
                    }}>
                        {message}
                    </div>
                )}
            </div>

            <div className="responsive-hud-stats" style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '15px', pointerEvents: 'auto' }}>
                <button
                    onClick={onQuit}
                    style={{
                        backgroundColor: '#ff4444',
                        color: 'white',
                        border: '2px solid white',
                        borderRadius: '8px',
                        padding: '8px 16px',
                        fontSize: '1rem',
                        fontWeight: 'bold',
                        cursor: 'pointer',
                        boxShadow: '0 4px 6px rgba(0,0,0,0.3)',
                        transition: 'transform 0.1s ease',
                    }}
                    onMouseOver={(e: React.MouseEvent<HTMLButtonElement>) => e.currentTarget.style.transform = 'scale(1.05)'}
                    onMouseOut={(e: React.MouseEvent<HTMLButtonElement>) => e.currentTarget.style.transform = 'scale(1)'}
                    onMouseDown={(e: React.MouseEvent<HTMLButtonElement>) => e.currentTarget.style.transform = 'scale(0.95)'}
                    onMouseUp={(e: React.MouseEvent<HTMLButtonElement>) => e.currentTarget.style.transform = 'scale(1.05)'}
                >
                    {t('quitGame')}
                </button>

                <div className="responsive-hud-box" style={{
                    backgroundColor: 'rgba(0,0,0,0.7)',
                    padding: '15px 30px',
                    borderRadius: '12px',
                    border: '2px solid #555',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    minWidth: '120px'
                }}>
                    <div style={{ fontSize: '1.2rem', textTransform: 'uppercase', letterSpacing: '2px', color: '#aaa' }}>{t('time')}</div>
                    <div style={{ fontSize: '2.5rem', fontWeight: 'bold', color: timeRemaining <= 10 ? '#ff4444' : 'white' }}>
                        {formatTime(timeRemaining)}
                    </div>
                </div>

                <div className="responsive-hud-box" style={{
                    backgroundColor: 'rgba(0,0,0,0.7)',
                    padding: '15px 30px',
                    borderRadius: '12px',
                    border: '2px solid #555',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    minWidth: '120px'
                }}>
                    <div style={{ fontSize: '1.2rem', textTransform: 'uppercase', letterSpacing: '2px', color: '#aaa' }}>Score</div>
                    <div style={{ fontSize: '2.5rem', fontWeight: 'bold' }}>{score}</div>
                </div>
            </div>

            <style>
                {`
          @keyframes fadeInOut {
            0% { opacity: 0; transform: translateY(-10px); }
            10% { opacity: 1; transform: translateY(0); }
            90% { opacity: 1; transform: translateY(0); }
            100% { opacity: 0; transform: translateY(-10px); }
          }
        `}
            </style>
        </div>
    );
};
