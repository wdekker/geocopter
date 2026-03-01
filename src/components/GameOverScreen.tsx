import React from 'react';
import { useTranslation } from '../contexts/LanguageContext';

interface GameOverScreenProps {
    score: number;
    bestScore: number;
    isNewHighScore: boolean;
    onPlayAgain: () => void;
}

export const GameOverScreen: React.FC<GameOverScreenProps> = ({ score, bestScore, isNewHighScore, onPlayAgain }) => {
    const { t } = useTranslation();

    return (
        <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(0, 0, 0, 0.9)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 9999,
            color: 'white',
            fontFamily: 'monospace'
        }}>
            <h1 className="responsive-title" style={{ fontSize: '5rem', marginBottom: '10px', color: '#ff4444', textShadow: '2px 2px 4px #000' }}>
                {t('gameOver')}
            </h1>

            {isNewHighScore && (
                <div style={{
                    backgroundColor: '#ffd700',
                    color: '#000',
                    padding: '10px 30px',
                    borderRadius: '20px',
                    fontSize: '1.5rem',
                    fontWeight: 'bold',
                    marginBottom: '20px',
                    animation: 'pulse 1s infinite',
                    boxShadow: '0 0 20px rgba(255, 215, 0, 0.6)'
                }}>
                    🏆 {t('newHighScore')} 🏆
                </div>
            )}

            <div style={{ textAlign: 'center', marginBottom: '40px' }}>
                <p className="responsive-subtitle" style={{ fontSize: '2rem', margin: '10px 0', color: '#ccc' }}>
                    {t('finalScore')}: <span style={{ color: 'white', fontWeight: 'bold' }}>{score}</span>
                </p>
                <p style={{ fontSize: '1.2rem', margin: '0', color: '#888' }}>
                    {t('yourBestScore')}: <span style={{ color: '#aaa' }}>{bestScore}</span>
                </p>
            </div>

            <button
                onClick={onPlayAgain}
                style={{
                    padding: '15px 40px',
                    fontSize: '1.5rem',
                    fontWeight: 'bold',
                    backgroundColor: '#2196F3',
                    color: 'white',
                    border: 'none',
                    borderRadius: '5px',
                    cursor: 'pointer',
                    boxShadow: '0 4px 6px rgba(0,0,0,0.3)',
                    transition: 'transform 0.1s, background-color 0.2s',
                }}
                onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#1976D2'}
                onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#2196F3'}
                onMouseDown={(e) => e.currentTarget.style.transform = 'scale(0.95)'}
                onMouseUp={(e) => e.currentTarget.style.transform = 'scale(1)'}
            >
                {t('playAgain')}
            </button>
        </div>
    );
};
