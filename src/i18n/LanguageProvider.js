import React, { createContext, useContext, useEffect, useState } from "react";
import en from "../locales/en.json";
import srLatn from "../locales/sr-Latn.json";

export const SUPPORTED_LANGUAGES = ["en", "sr-Latn"];
export const LANGUAGE_STORAGE_KEY = "pwagerman.language";

const translations = {
  en,
  "sr-Latn": srLatn,
};

const LanguageContext = createContext(null);

export const normalizeLanguage = (language) => {
  if (typeof language !== "string") {
    return "en";
  }

  const normalized = language.toLowerCase();
  if (normalized.startsWith("sr")) {
    return "sr-Latn";
  }
  if (normalized.startsWith("en")) {
    return "en";
  }
  return "en";
};

const isSupportedLanguage = (language) =>
  SUPPORTED_LANGUAGES.includes(language);

const getStoredLanguage = () => {
  try {
    const storedLanguage = window.localStorage.getItem(LANGUAGE_STORAGE_KEY);
    return isSupportedLanguage(storedLanguage) ? storedLanguage : null;
  } catch (error) {
    return null;
  }
};

export const getInitialLanguage = () => {
  const storedLanguage = getStoredLanguage();
  if (storedLanguage) {
    return storedLanguage;
  }

  return normalizeLanguage(window.navigator.language);
};

const getValue = (resource, key) => {
  return key.split(".").reduce((value, part) => {
    if (value && typeof value === "object" && part in value) {
      return value[part];
    }
    return undefined;
  }, resource);
};

const readableFallback = (key) => {
  const lastKey = key.split(".").pop() || key;
  return lastKey
    .replace(/([A-Z])/g, " $1")
    .replace(/^./, (character) => character.toUpperCase());
};

const resolveTranslation = (language, key) => {
  const selectedValue = getValue(translations[language], key);
  if (typeof selectedValue === "string") {
    return selectedValue;
  }

  const fallbackValue = getValue(en, key);
  return typeof fallbackValue === "string"
    ? fallbackValue
    : readableFallback(key);
};

export const LanguageProvider = ({ children }) => {
  const [language, updateLanguage] = useState(getInitialLanguage);

  useEffect(() => {
    document.documentElement.lang = language;
    document.title = resolveTranslation(language, "app.name");
  }, [language]);

  const setLanguage = (nextLanguage) => {
    const selectedLanguage = isSupportedLanguage(nextLanguage)
      ? nextLanguage
      : "en";

    updateLanguage(selectedLanguage);
    try {
      window.localStorage.setItem(LANGUAGE_STORAGE_KEY, selectedLanguage);
    } catch (error) {
      // Language selection still works when storage is unavailable.
    }
  };

  const t = (key) => resolveTranslation(language, key);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);