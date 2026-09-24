import {
  idbGetAllWords,
  idbReplaceAllWords,
  isIndexedDbSupported,
} from "./storage/idbMyWordsStore";

export const MY_WORDS_STORAGE_KEY = "serbian-a1.myWords.v1";
export const MY_WORDS_MIGRATED_KEY = "serbian-a1.myWords.migratedToIndexedDb.v1";
export const MY_WORDS_MAX_LENGTH = 80;

const isEntry = (entry) =>
  entry &&
  typeof entry.id === "string" &&
  typeof entry.source === "string" &&
  typeof entry.target === "string" &&
  typeof entry.createdAt === "string";

export const loadMyWords = (storage = window.localStorage) => {
  try {
    const raw = storage.getItem(MY_WORDS_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter(isEntry) : [];
  } catch (error) {
    return [];
  }
};

export const saveMyWords = (words, storage = window.localStorage) => {
  storage.setItem(MY_WORDS_STORAGE_KEY, JSON.stringify(words));
};

// One-time move of any pre-existing localStorage entries into IndexedDB.
// Runs at most once per browser (flagged in localStorage), keeps the legacy
// key untouched, and never drops entries already present in either store.
export const migrateMyWordsToIndexedDb = async ({
  storage = window.localStorage,
  idbFactory,
} = {}) => {
  if (!isIndexedDbSupported(idbFactory)) return null;
  try {
    if (storage.getItem(MY_WORDS_MIGRATED_KEY) === "true") return null;
    const existing = await idbGetAllWords(idbFactory);
    const legacy = loadMyWords(storage);
    if (existing.length === 0 && legacy.length > 0) {
      await idbReplaceAllWords(legacy, idbFactory);
      storage.setItem(MY_WORDS_MIGRATED_KEY, "true");
      return legacy;
    }
    storage.setItem(MY_WORDS_MIGRATED_KEY, "true");
    return existing;
  } catch (error) {
    return null;
  }
};

// Reads from IndexedDB when available (migrating legacy data first),
// returning null when IndexedDB cannot be used so callers keep localStorage.
export const loadMyWordsFromIndexedDb = async ({
  storage = window.localStorage,
  idbFactory,
} = {}) => {
  if (!isIndexedDbSupported(idbFactory)) return null;
  try {
    const migrated = await migrateMyWordsToIndexedDb({ storage, idbFactory });
    const words = migrated || (await idbGetAllWords(idbFactory));
    return Array.isArray(words) ? words.filter(isEntry) : [];
  } catch (error) {
    return null;
  }
};

export const saveMyWordsToIndexedDb = async (words, idbFactory) => {
  if (!isIndexedDbSupported(idbFactory)) return false;
  try {
    await idbReplaceAllWords(words, idbFactory);
    return true;
  } catch (error) {
    return false;
  }
};

export const normalizeWord = (value) =>
  typeof value === "string" ? value.trim() : "";

export const duplicateWord = (words, source, target, ignoredId) =>
  words.some(
    (word) =>
      word.id !== ignoredId &&
      word.source.toLocaleLowerCase() === source.toLocaleLowerCase() &&
      word.target.toLocaleLowerCase() === target.toLocaleLowerCase()
  );
