import React, { createContext, useContext, useState, useEffect } from 'react';
import { translations, type Language, type TranslationKey } from '../i18n/translations';

interface LanguageContextType {
    language: Language;
    setLanguage: (lang: Language) => void;
    t: (key: TranslationKey, params?: Record<string, string | number>) => string;
}

// Provide a dummy default to satisfy TS before the provider mounts
const defaultContext: LanguageContextType = {
    language: 'en',
    setLanguage: () => { },
    t: (key) => key as string,
};

// eslint-disable-next-line react-refresh/only-export-components
export const LanguageContext = createContext<LanguageContextType>(defaultContext);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [language, setLanguageState] = useState<Language>('en'); // Default

    // On mount, read from local storage or browser preference
    useEffect(() => {
        try {
            const saved = window.localStorage.getItem('geocopter_language') as Language;
            if (saved && translations[saved]) {
                // eslint-disable-next-line react-hooks/set-state-in-effect
                setLanguageState(saved);
            } else {
                // Try to infer from browser if not actively saved
                const browserLang = navigator.language.split('-')[0] as Language;
                if (translations[browserLang]) {
                    // eslint-disable-next-line react-hooks/set-state-in-effect
                    setLanguageState(browserLang);
                }
            }
        } catch {
            console.error("Local storage error");
        }
    }, []);

    const setLanguage = (lang: Language) => {
        setLanguageState(lang);
        try {
            window.localStorage.setItem('geocopter_language', lang);
        } catch {
            // Ignore quota/private mode errors
        }
    };

    const t = (key: TranslationKey, params?: Record<string, string | number>): string => {
        let text = translations[language][key] || translations['en'][key] || key; // Fallback to EN or raw key

        if (params) {
            Object.entries(params).forEach(([paramKey, paramValue]) => {
                const searchString = '{' + paramKey + '}';
                text = text.replace(new RegExp(searchString, 'g'), String(paramValue));
            });
        }

        return text;
    };

    return (
        <LanguageContext.Provider value={{ language, setLanguage, t }}>
            {children}
        </LanguageContext.Provider>
    );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useTranslation = () => {
    const context = useContext(LanguageContext);
    if (!context) {
        throw new Error('useTranslation must be used within a LanguageProvider');
    }
    return context;
};
