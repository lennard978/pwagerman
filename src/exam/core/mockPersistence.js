import { STORAGE_CONFIG } from "../../config/course";

const parse = (storage, key, fallback) => {
  try { return JSON.parse(storage.getItem(key) || JSON.stringify(fallback)); } catch (error) { return fallback; }
};

export const saveMockSession = (session, storage = window.localStorage) => {
  try { storage.setItem(STORAGE_CONFIG.mockB1Session, JSON.stringify(session)); return true; } catch (error) { return false; }
};
export const loadMockSession = (storage = window.localStorage) => {
  const session = parse(storage, STORAGE_CONFIG.mockB1Session, null);
  return session?.mockId && session?.modules ? session : null;
};
export const clearMockSession = (storage = window.localStorage) => {
  try { storage.removeItem(STORAGE_CONFIG.mockB1Session); return true; } catch (error) { return false; }
};
export const loadMockHistory = (storage = window.localStorage) => {
  const history = parse(storage, STORAGE_CONFIG.mockB1History, []);
  return Array.isArray(history) ? history.slice(-20) : [];
};
export const saveMockHistory = (history, storage = window.localStorage) => {
  try { storage.setItem(STORAGE_CONFIG.mockB1History, JSON.stringify(history.slice(-20))); return true; } catch (error) { return false; }
};
export const archiveMockSession = (session, storage = window.localStorage) => {
  const history = loadMockHistory(storage);
  const summary = {
    sessionId: session.sessionId,
    mockId: session.mockId,
    status: session.status,
    startedAt: session.startedAt,
    completedAt: session.completedAt,
    abandonedAt: session.abandonedAt,
    modules: session.modules,
    contentVersion: session.contentVersion,
    scoringVersion: session.scoringVersion,
  };
  const next = [...history.filter(({ sessionId }) => sessionId !== session.sessionId), summary].slice(-20);
  saveMockHistory(next, storage);
  return next;
};
