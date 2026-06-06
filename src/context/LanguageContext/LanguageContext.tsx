import React, { createContext, useState, useContext, useEffect } from 'react';
import enTranslations from './messages/en-US.json';

interface LanguageContextType {
    language: string;
    setLanguage: (lang: string) => void;
    translations: Record<string, Record<string, string>>;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const supportedLanguages = new Set<string>(['en-US', 'pt-BR']);

export const useLanguage = (page: string) => {
    const context = useContext(LanguageContext);
    if (!context) {
        throw new Error('useLanguage must be used within a LanguageProvider');
    }
    return {
        language: context.language,
        setLanguage: context.setLanguage,
        translations: context.translations[page]
    };
};

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [language, setLanguage] = useState<string>(supportedLanguages.has(navigator.language) ? navigator.language : 'en-US');
    const [translations, setTranslations] = useState<Record<string, Record<string, string>>>(enTranslations);

    const loadTranslations = async (lang: string) => {
        const module = await import(`./messages/${lang}.json`);
        setTranslations(module.default);
    };

    useEffect(() => {
        loadTranslations(language);
    }, [language]);

    return (
        <LanguageContext.Provider value={{ language, setLanguage, translations }}>
            {children}
        </LanguageContext.Provider>
    );
};