import { REGIONS, type Region } from '../data/cities';
import { UNLOCKABLE_AIRCRAFT, type Aircraft } from '../data/unlockables';
import { useTranslation } from '../contexts/LanguageContext';
import type { Language } from '../i18n/translations';

interface StartScreenProps {
    onStart: (region: Region, hardcore: boolean) => void;
    activeRegion: Region;
    setActiveRegion: (region: Region) => void;
    hardcoreMode: boolean;
    setHardcoreMode: (hardcore: boolean) => void;
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
    highScore,
    totalCareerScore,
    activeAircraft,
    setActiveAircraft
}) => {
    const { t, language, setLanguage } = useTranslation();

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
            <h1 style={{ fontSize: '4rem', marginBottom: '20px', textShadow: '2px 2px 4px #000' }}>
                🚁 GeoCopter
            </h1>

            <div style={{
                backgroundColor: '#333',
                padding: '30px',
                borderRadius: '10px',
                textAlign: 'center',
                boxShadow: '0 0 20px rgba(0,0,0,0.5)',
                minWidth: '400px',
                maxWidth: '500px'
            }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                    <h2 style={{ marginBottom: '5px', color: '#aaa' }}>{t('gameSettings')}</h2>
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
                <div style={{ marginBottom: '25px', fontSize: '0.9rem', color: '#ffd700' }}>
                    {t('totalCareerScore')}: {totalCareerScore.toLocaleString()}
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

                {/* Hardcore Toggle */}
                <div style={{ marginBottom: '30px', textAlign: 'left' }}>
                    <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer', fontSize: '1.2rem' }}>
                        <input
                            type="checkbox"
                            checked={hardcoreMode}
                            onChange={(e) => setHardcoreMode(e.target.checked)}
                            style={{ margin: '0 10px 0 0', width: '20px', height: '20px' }}
                        />
                        {t('hardcoreMode')}
                    </label>
                </div>

                {/* High Score Target */}
                {
                    highScore > 0 && (
                        <div style={{ marginBottom: '30px', textAlign: 'center' }}>
                            <div style={{ fontSize: '1.1rem', color: '#888' }}>
                                {t('yourBestScore')}: <span style={{ color: '#ffd700', fontWeight: 'bold' }}>{highScore}</span>
                            </div>
                        </div>
                    )
                }

                {/* Start Button */}
                <button
                    onClick={() => onStart(activeRegion, hardcoreMode)}
                    style={{
                        padding: '15px 40px',
                        fontSize: '1.5rem',
                        fontWeight: 'bold',
                        backgroundColor: '#4CAF50',
                        color: 'white',
                        border: 'none',
                        borderRadius: '5px',
                        cursor: 'pointer',
                        boxShadow: '0 4px 6px rgba(0,0,0,0.3)',
                        transition: 'transform 0.1s, background-color 0.2s',
                    }}
                    onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#45a049'}
                    onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#4CAF50'}
                    onMouseDown={(e) => e.currentTarget.style.transform = 'scale(0.95)'}
                    onMouseUp={(e) => e.currentTarget.style.transform = 'scale(1)'}
                >
                    {t('startFlight')}
                </button>
            </div>
        </div>
    );
};
