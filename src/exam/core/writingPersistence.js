import { STORAGE_CONFIG } from "../../config/course";

const sessionKey = (mode) => mode === "practice" ? STORAGE_CONFIG.writingPracticeSession : STORAGE_CONFIG.writingSession;

export const saveWritingSession = (session, storage = window.localStorage) => {
  try { storage.setItem(sessionKey(session.mode), JSON.stringify(session)); return true; } catch (error) { return false; }
};

export const loadWritingSession = (storage = window.localStorage, mode = "simulation") => {
  try {
    const value = JSON.parse(storage.getItem(sessionKey(mode)) || "null");
    return value?.module === "writing" && value.mode === mode && value.drafts && typeof value.drafts === "object" ? value : null;
  } catch (error) { return null; }
};

export const clearWritingSession = (storage = window.localStorage, mode = "simulation") => {
  try { storage.removeItem(sessionKey(mode)); return true; } catch (error) { return false; }
};
