import React, { createContext, useState, useContext, useEffect } from "react";
import parse from "html-react-parser";
import enTranslations from "./messages/en-US.json";
import sanitizeHtml from "sanitize-html";

interface LanguageContextType {
  language: string;
  changeLanguage: (lang: string) => void;
  translations: Record<string, Record<string, string>>;
}

const LanguageContext = createContext<LanguageContextType | undefined>(
  undefined,
);

const supportedLanguages = new Set<string>(["en-US", "pt-BR"]);

const ALLOWED_TAGS = ["strong"];

const sanitize = (input: string) => {
  return sanitizeHtml(input, {
    allowedTags: ALLOWED_TAGS,
    allowedAttributes: {},
    allowedSchemes: [],
  });
};

const SafeText = (rawHtml: string) => {
  const clean = sanitize(rawHtml);
  return parse(clean);
};

export const useLanguage = (page: string) => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }

  const pageTranslations = context.translations[page];

  const resolveString = (
    key: string,
    params?: Record<string, string | number>,
  ) => {
    let text = pageTranslations[key];

    if (params) {
      Object.entries(params).forEach(([paramKey, value]) => {
        const regex = new RegExp(`\\{${paramKey}\\}`, "g");
        text = text.replace(regex, String(value));
      });
    }
    return text;
  };

  const t = (key: string, params?: Record<string, string | number>) => {
    return resolveString(key, params);
  };

  const tRich = (key: string, params?: Record<string, string | number>) => {
    const rawString = resolveString(key, params);
    return SafeText(rawString);
  };

  return {
    language: context.language,
    changeLanguage: context.changeLanguage,
    t,
    tRich,
  };
};

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const localStorageLanguage = localStorage.getItem("language");

  const [language, setLanguage] = useState<string>(
    localStorageLanguage
      ? localStorageLanguage
      : supportedLanguages.has(navigator.language)
        ? navigator.language
        : "en-US",
  );
  const [translations, setTranslations] =
    useState<Record<string, Record<string, string>>>(enTranslations);

  const loadTranslations = async (lang: string) => {
    const module = await import(`./messages/${lang}.json`);
    setTranslations(module.default);
  };

  const changeLanguage = (language: string) => {
    localStorage.setItem("language", language);

    setLanguage(language);
  };

  useEffect(() => {
    loadTranslations(language);
  }, [language]);

  return (
    <LanguageContext.Provider
      value={{ language, changeLanguage, translations }}
    >
      {children}
    </LanguageContext.Provider>
  );
};
