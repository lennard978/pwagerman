import { STORAGE_CONFIG } from "../../config/course";

const sessionKey = (mode) => mode === "practice" ? STORAGE_CONFIG.listeningPracticeSession : STORAGE_CONFIG.listeningSession;

export const saveListeningSession = (session, storage = window.localStorage) => {
  try { storage.setItem(sessionKey(session.mode), JSON.stringify(session)); return true; } catch (error) { return false; }
};

export const loadListeningSession = (storage = window.localStorage, mode = "simulation") => {
  try {
    const value = JSON.parse(storage.getItem(sessionKey(mode)) || "null");
    return value?.module === "listening" && value.mode === mode ? value : null;
  } catch (error) { return null; }
};

export const clearListeningSession = (storage = window.localStorage, mode = "simulation") => {
  try { storage.removeItem(sessionKey(mode)); return true; } catch (error) { return false; }
};
