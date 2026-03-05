import React from 'react';
import { REGIONS, type Region } from '../data/cities';
import { UNLOCKABLE_AIRCRAFT, type Aircraft } from '../data/unlockables';
import { useTranslation } from '../contexts/LanguageContext';
import type { Language } from '../i18n/translations';

interface StartScreenProps {
    onStart: (region: Region, hardcore: boolean, categories: string[]) => void;
    activeRegion: Region;
    setActiveRegion: (region: Region) => void;
    hardcoreMode: boolean;
    setHardcoreMode: (hardcore: boolean) => void;
    categories: string[];
    setCategories: (categories: string[]) => void;
    highScore: number;
    totalCareerScore: number;
    activeAircraft: Aircraft;
    setActiveAircraft: (aircraft: Aircraft) => void;
}


export const StartScreen: React.FC<StartScreenProps> = ({
    onStart,
    activeRegion,
    setActiveRegion,
    hardcoreMode,
    setHardcoreMode,
    categories,
    setCategories,
    highScore,
    totalCareerScore,
    activeAircraft,
    setActiveAircraft
}) => {
    const [view, setView] = React.useState<'main' | 'settings'>('main');
    const { t, language, setLanguage } = useTranslation();

    const handleCategoryToggle = (cat: string) => {
        if (categories.includes(cat)) {
            // Uncheck, but only if it's not the last one
            if (categories.length > 1) {
                setCategories(categories.filter(c => c !== cat));
            }
        } else {
            // Check
            setCategories([...categories, cat]);
        }
    };


    const handleStart = () => {
        try {
            const docEl = document.documentElement as any;
            if (docEl.requestFullscreen) {
                docEl.requestFullscreen().catch((err: any) => console.log(err));
            } else if (docEl.webkitRequestFullscreen) { // Safari
                docEl.webkitRequestFullscreen();
            } else if (docEl.msRequestFullscreen) { // IE11
                docEl.msRequestFullscreen();
            }
        } catch (e) {
            console.log("Fullscreen API error", e);
        }
        onStart(activeRegion, hardcoreMode, categories);
    };

    return (
        <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 9999,
            color: 'white',
            fontFamily: 'monospace'
        }}>
            <h1 className="responsive-title" style={{ fontSize: '4rem', marginBottom: '20px', textShadow: '2px 2px 4px #000' }}>
                🚁 GeoCopter
            </h1>

            <div className="responsive-modal" style={{
                backgroundColor: '#333',
                padding: '30px',
                borderRadius: '10px',
                textAlign: 'center',
                boxShadow: '0 0 20px rgba(0,0,0,0.5)',
                minWidth: '400px',
                maxWidth: '500px'
            }}>
                {view === 'settings' && (
                    <div style={{ marginBottom: '20px' }}>
                        <h2 style={{ marginBottom: '5px', color: '#aaa', margin: 0 }}>{t('gameSettings')}</h2>
                    </div>
                )}

                {view === 'main' ? (
                    <>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px' }}>
                            <div style={{ fontSize: '0.9rem', color: '#ffd700' }}>
                                {t('totalCareerScore')}: {totalCareerScore.toLocaleString()}
                            </div>
                            <select
                                value={language}
                                onChange={(e) => setLanguage(e.target.value as Language)}
                                style={{
                                    padding: '5px',
                                    backgroundColor: '#222',
                                    color: 'white',
                                    border: '1px solid #555',
                                    borderRadius: '5px'
                                }}
                            >
                                <option value="en">🇬🇧 EN</option>
                                <option value="nl">🇳🇱 NL</option>
                                <option value="es">🇪🇸 ES</option>
                                <option value="zh">🇨🇳 ZH</option>
                                <option value="hi">🇮🇳 HI</option>
                                <option value="ar">🇸🇦 AR</option>
                                <option value="fr">🇫🇷 FR</option>
                                <option value="de">🇩🇪 DE</option>
                                <option value="pt">🇵🇹 PT</option>
                                <option value="it">🇮🇹 IT</option>
                            </select>
                        </div>

                        {/* Region Selection */}
                        <div style={{ marginBottom: '20px', textAlign: 'left' }}>
                            <label style={{ display: 'block', marginBottom: '10px', fontSize: '1.2rem' }}>
                                {t('selectRegion')}:
                            </label>
                            <select
                                value={activeRegion.id}
                                onChange={(e) => {
                                    const selected = REGIONS.find(r => r.id === e.target.value);
                                    if (selected) setActiveRegion(selected);
                                }}
                                style={{
                                    width: '100%',
                                    padding: '10px',
                                    fontSize: '1.1rem',
                                    borderRadius: '5px',
                                    backgroundColor: '#222',
                                    color: 'white',
                                    border: '1px solid #555'
                                }}
                            >
                                {REGIONS.map(region => (
                                    <option key={region.id} value={region.id}>
                                        {region.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Aircraft Selection */}
                        <div style={{ marginBottom: '20px', textAlign: 'left' }}>
                            <label style={{ display: 'block', marginBottom: '10px', fontSize: '1.2rem' }}>
                                {t('selectAircraft')}:
                            </label>
                            <div style={{
                                display: 'flex',
                                flexWrap: 'wrap',
                                gap: '10px',
                                justifyContent: 'center'
                            }}>
                                {UNLOCKABLE_AIRCRAFT.map(aircraft => {
                                    const isLocked = totalCareerScore < aircraft.requiredScore;
                                    return (
                                        <button
                                            key={aircraft.id}
                                            disabled={isLocked}
                                            onClick={() => setActiveAircraft(aircraft)}
                                            title={isLocked ? t('unlocksAt', { score: aircraft.requiredScore.toLocaleString() }) : aircraft.name}
                                            style={{
                                                fontSize: '2rem',
                                                padding: '10px',
                                                backgroundColor: activeAircraft.id === aircraft.id ? '#4CAF50' : '#222',
                                                border: `2px solid ${activeAircraft.id === aircraft.id ? '#fff' : '#555'}`,
                                                borderRadius: '8px',
                                                cursor: isLocked ? 'not-allowed' : 'pointer',
                                                opacity: isLocked ? 0.5 : 1,
                                                position: 'relative',
                                                transition: 'all 0.2s ease'
                                            }}
                                        >
                                            {aircraft.sprite}
                                            {isLocked && (
                                                <div style={{
                                                    position: 'absolute',
                                                    bottom: '-5px',
                                                    right: '-5px',
                                                    fontSize: '1rem',
                                                    backgroundColor: '#f44336',
                                                    borderRadius: '50%',
                                                    width: '20px', height: '20px',
                                                    display: 'flex', alignItems: 'center', justifyContent: 'center'
                                                }}>
                                                    🔒
                                                </div>
                                            )}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        {/* High Score Target */}
                        {
                            highScore > 0 && (
                                <div style={{ marginBottom: '15px', textAlign: 'center' }}>
                                    <div style={{ fontSize: '1.1rem', color: '#888' }}>
                                        {t('yourBestScore')}: <span style={{ color: '#ffd700', fontWeight: 'bold' }}>{highScore}</span>
                                    </div>
                                </div>
                            )
                        }

                        {/* Settings Button */}
                        <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
                            <button
                                onClick={() => setView('settings')}
                                style={{
                                    flex: 1,
                                    padding: '15px 10px',
                                    fontSize: '1.2rem',
                                    fontWeight: 'bold',
                                    backgroundColor: '#555',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '5px',
                                    cursor: 'pointer',
                                    boxShadow: '0 4px 6px rgba(0,0,0,0.3)',
                                    transition: 'transform 0.1s, background-color 0.2s',
                                }}
                                onMouseOver={(e: React.MouseEvent<HTMLButtonElement>) => e.currentTarget.style.backgroundColor = '#666'}
                                onMouseOut={(e: React.MouseEvent<HTMLButtonElement>) => e.currentTarget.style.backgroundColor = '#555'}
                            >
                                ⚙️ {t('settings')}
                            </button>
                            <button
                                className="responsive-start-btn"
                                onClick={handleStart}
                                disabled={categories.length === 0}
                                style={{
                                    flex: 2,
                                    padding: '15px 40px',
                                    fontSize: '1.5rem',
                                    fontWeight: 'bold',
                                    backgroundColor: categories.length === 0 ? '#444' : '#4CAF50',
                                    color: categories.length === 0 ? '#888' : 'white',
                                    border: 'none',
                                    borderRadius: '5px',
                                    cursor: categories.length === 0 ? 'not-allowed' : 'pointer',
                                    boxShadow: '0 4px 6px rgba(0,0,0,0.3)',
                                    transition: 'transform 0.1s, background-color 0.2s',
                                }}
                                onMouseOver={(e: React.MouseEvent<HTMLButtonElement>) => { if (categories.length > 0) e.currentTarget.style.backgroundColor = '#45a049'; }}
                                onMouseOut={(e: React.MouseEvent<HTMLButtonElement>) => { if (categories.length > 0) e.currentTarget.style.backgroundColor = '#4CAF50'; }}
                                onMouseDown={(e: React.MouseEvent<HTMLButtonElement>) => { if (categories.length > 0) e.currentTarget.style.transform = 'scale(0.95)'; }}
                                onMouseUp={(e: React.MouseEvent<HTMLButtonElement>) => { if (categories.length > 0) e.currentTarget.style.transform = 'scale(1)'; }}
                            >
                                🚁 {t('startFlight')}
                            </button>
                        </div>
                    </>
                ) : (
                    <div style={{ textAlign: 'left' }}>
                        <h3 style={{ marginBottom: '15px', color: '#ccc', fontSize: '1.2rem' }}>{t('targetTypes')}:</h3>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '20px' }}>
                            <label style={{ display: 'flex', alignItems: 'center', cursor: categories.length > 1 || !categories.includes('city') ? 'pointer' : 'not-allowed', color: categories.length === 1 && categories.includes('city') ? '#888' : 'white' }}>
                                <input type="checkbox" checked={categories.includes('city')} onChange={() => handleCategoryToggle('city')} style={{ margin: '0 10px 0 0', width: '18px', height: '18px' }} disabled={categories.length === 1 && categories.includes('city')} /> 🏢 {t('cities')}
                            </label>
                            <label style={{ display: 'flex', alignItems: 'center', cursor: categories.length > 1 || !categories.includes('river') ? 'pointer' : 'not-allowed', color: categories.length === 1 && categories.includes('river') ? '#888' : 'white' }}>
                                <input type="checkbox" checked={categories.includes('river')} onChange={() => handleCategoryToggle('river')} style={{ margin: '0 10px 0 0', width: '18px', height: '18px' }} disabled={categories.length === 1 && categories.includes('river')} /> 〰️ {t('rivers')}
                            </label>
                            <label style={{ display: 'flex', alignItems: 'center', cursor: categories.length > 1 || !categories.includes('lake') ? 'pointer' : 'not-allowed', color: categories.length === 1 && categories.includes('lake') ? '#888' : 'white' }}>
                                <input type="checkbox" checked={categories.includes('lake')} onChange={() => { handleCategoryToggle('lake'); if (!categories.includes('lake')) { if (!categories.includes('sea')) setCategories([...categories, 'lake', 'sea']); } else { setCategories(categories.filter(c => c !== 'lake' && c !== 'sea')); } }} style={{ margin: '0 10px 0 0', width: '18px', height: '18px' }} disabled={categories.length === 1 && categories.includes('lake')} /> 🌊 {t('lakesAndSeas')}
                            </label>
                            <label style={{ display: 'flex', alignItems: 'center', cursor: categories.length > 1 || !categories.includes('mountain') ? 'pointer' : 'not-allowed', color: categories.length === 1 && categories.includes('mountain') ? '#888' : 'white' }}>
                                <input type="checkbox" checked={categories.includes('mountain')} onChange={() => handleCategoryToggle('mountain')} style={{ margin: '0 10px 0 0', width: '18px', height: '18px' }} disabled={categories.length === 1 && categories.includes('mountain')} /> ⛰️ {t('mountains')}
                            </label>
                            <label style={{ display: 'flex', alignItems: 'center', cursor: categories.length > 1 || !categories.includes('island') ? 'pointer' : 'not-allowed', color: categories.length === 1 && categories.includes('island') ? '#888' : 'white' }}>
                                <input type="checkbox" checked={categories.includes('island')} onChange={() => handleCategoryToggle('island')} style={{ margin: '0 10px 0 0', width: '18px', height: '18px' }} disabled={categories.length === 1 && categories.includes('island')} /> 🏝️ {t('islands')}
                            </label>
                            <label style={{ display: 'flex', alignItems: 'center', cursor: categories.length > 1 || !categories.includes('national_park') ? 'pointer' : 'not-allowed', color: categories.length === 1 && categories.includes('national_park') ? '#888' : 'white' }}>
                                <input type="checkbox" checked={categories.includes('national_park')} onChange={() => handleCategoryToggle('national_park')} style={{ margin: '0 10px 0 0', width: '18px', height: '18px' }} disabled={categories.length === 1 && categories.includes('national_park')} /> 🌲 {t('national_parks')}
                            </label>
                            <label style={{ display: 'flex', alignItems: 'center', cursor: categories.length > 1 || !categories.includes('canal') ? 'pointer' : 'not-allowed', color: categories.length === 1 && categories.includes('canal') ? '#888' : 'white' }}>
                                <input type="checkbox" checked={categories.includes('canal')} onChange={() => handleCategoryToggle('canal')} style={{ margin: '0 10px 0 0', width: '18px', height: '18px' }} disabled={categories.length === 1 && categories.includes('canal')} /> 🌁 {t('canals')}
                            </label>
                            <label style={{ display: 'flex', alignItems: 'center', cursor: categories.length > 1 || !categories.includes('bay') ? 'pointer' : 'not-allowed', color: categories.length === 1 && categories.includes('bay') ? '#888' : 'white' }}>
                                <input type="checkbox" checked={categories.includes('bay')} onChange={() => { handleCategoryToggle('bay'); if (!categories.includes('bay')) { if (!categories.includes('peninsula')) setCategories([...categories, 'bay', 'peninsula']); } else { setCategories(categories.filter(c => c !== 'bay' && c !== 'peninsula')); } }} style={{ margin: '0 10px 0 0', width: '18px', height: '18px' }} disabled={categories.length === 1 && categories.includes('bay')} /> 🏖️ {t('bays_and_peninsulas')}
                            </label>
                            <label style={{ display: 'flex', alignItems: 'center', cursor: categories.length > 1 || !categories.includes('desert') ? 'pointer' : 'not-allowed', color: categories.length === 1 && categories.includes('desert') ? '#888' : 'white' }}>
                                <input type="checkbox" checked={categories.includes('desert')} onChange={() => handleCategoryToggle('desert')} style={{ margin: '0 10px 0 0', width: '18px', height: '18px' }} disabled={categories.length === 1 && categories.includes('desert')} /> 🐪 {t('deserts')}
                            </label>
                        </div>

                        <div style={{ height: '1px', backgroundColor: '#555', margin: '20px 0' }}></div>

                        <h3 style={{ marginBottom: '15px', color: '#ccc', fontSize: '1.2rem' }}>Difficulty:</h3>
                        <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer', fontSize: '1.2rem', marginBottom: '25px' }}>
                            <input
                                type="checkbox"
                                checked={hardcoreMode}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setHardcoreMode(e.target.checked)}
                                style={{ margin: '0 10px 0 0', width: '20px', height: '20px' }}
                            />
                            {t('hardcoreMode')}
                        </label>

                        <button
                            onClick={() => setView('main')}
                            style={{
                                width: '100%',
                                padding: '15px 10px',
                                fontSize: '1.2rem',
                                fontWeight: 'bold',
                                backgroundColor: '#555',
                                color: 'white',
                                border: 'none',
                                borderRadius: '5px',
                                cursor: 'pointer',
                                boxShadow: '0 4px 6px rgba(0,0,0,0.3)',
                                transition: 'transform 0.1s, background-color 0.2s',
                            }}
                            onMouseOver={(e: React.MouseEvent<HTMLButtonElement>) => e.currentTarget.style.backgroundColor = '#666'}
                            onMouseOut={(e: React.MouseEvent<HTMLButtonElement>) => e.currentTarget.style.backgroundColor = '#555'}
                        >
                            ⬅️ {t('backToMenu')}
                        </button>
                    </div>
                )}
                {/* Footer Attributions */}
                <div className="responsive-footer" style={{
                    marginTop: '25px',
                    textAlign: 'center',
                    color: '#888',
                    fontSize: '0.85rem'
                }}>
                    <div>
                        <a href="https://github.com/wdekker/geocopter" target="_blank" rel="noopener noreferrer" style={{ color: '#4CAF50', textDecoration: 'none', marginLeft: '5px', marginRight: '5px' }}>
                            Source Code
                        </a>
                        |
                        <a href="https://www.dekker.dev/contact/" target="_blank" rel="noopener noreferrer" style={{ color: '#4CAF50', textDecoration: 'none', marginLeft: '5px' }}>
                            Contact Willem Dekker
                        </a>
                    </div>
                    <div style={{ marginTop: '5px' }}>
                        Inspired by the 1984 classic Commodore 64 game "Topografie Europa" by Cees Kramer (RadarSoft).
                    </div>
                    <div style={{ marginTop: '5px', color: '#666' }}>
                        Play at <a href="https://geocopter.dekker.dev" style={{ color: '#888', textDecoration: 'underline' }}>geocopter.dekker.dev</a>
                    </div>
                </div>
            </div>
        </div>
    );
};
