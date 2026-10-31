import { STORAGE_CONFIG } from "../../config/course";

const sessionKey = (mode) => mode === "practice" ? STORAGE_CONFIG.readingPracticeSession : STORAGE_CONFIG.readingSession;

export const saveReadingSession = (session, storage = window.localStorage) => {
  try { storage.setItem(sessionKey(session.mode), JSON.stringify(session)); return true; } catch (error) { return false; }
};

export const loadReadingSession = (storage = window.localStorage, mode = "simulation") => {
  try {
    const value = JSON.parse(storage.getItem(sessionKey(mode)) || "null");
    return value?.module === "reading" && (value.mode || "simulation") === mode ? value : null;
  } catch (error) { return null; }
};

export const clearReadingSession = (storage = window.localStorage, mode = "simulation") => {
  try { storage.removeItem(sessionKey(mode)); return true; } catch (error) { return false; }
};
