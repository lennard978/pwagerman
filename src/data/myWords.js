import {
  idbGetAllWords,
  idbGetAllWordStatuses,
  idbReplaceAllWords,
  idbReplaceAllWordStatuses,
  isIndexedDbSupported,
} from "./storage/idbMyWordsStore";
import { STORAGE_CONFIG } from "../config/course";
import { normalizeLexemeState } from "./lexemeState";

export const MY_WORDS_STORAGE_KEY = STORAGE_CONFIG.myWords;
export const MY_WORDS_MIGRATED_KEY = STORAGE_CONFIG.myWordsMigrated;
export const MY_WORDS_MAX_LENGTH = 80;
export const WORD_STATUSES_STORAGE_KEY = STORAGE_CONFIG.wordStatuses;

export const normalizeCustomWord = (word) => {
  return {
    id: word.id,
    source: word.source,
    target: word.target,
    createdAt: word.createdAt,
    kind: "custom",
    article: typeof word.article === "string" ? word.article : null,
    plural: typeof word.plural === "string" ? word.plural : null,
    note: typeof word.note === "string" ? word.note : null,
  };
};

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
    return Array.isArray(parsed) ? parsed.filter(isEntry).map(normalizeCustomWord) : [];
  } catch (error) {
    return [];
  }
};

export const saveMyWords = (words, storage = window.localStorage) => {
  storage.setItem(MY_WORDS_STORAGE_KEY, JSON.stringify(words));
};

// One-time move from this course's localStorage fallback into its own IndexedDB.
// Previous course namespaces are intentionally never read or modified.
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
    const normalized = Array.isArray(words)
      ? words.filter(isEntry).map(normalizeCustomWord)
      : [];
    if (JSON.stringify(normalized) !== JSON.stringify(words)) {
      await idbReplaceAllWords(normalized, idbFactory);
    }
    return normalized;
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

const normalizeStatusEntries = (entries) =>
  entries.map(normalizeLexemeState).filter(Boolean);

export const loadWordStatuses = (storage = window.localStorage) => {
  try {
    const parsed = JSON.parse(storage.getItem(WORD_STATUSES_STORAGE_KEY) || "[]");
    return Array.isArray(parsed) ? normalizeStatusEntries(parsed) : [];
  } catch (error) {
    return [];
  }
};

export const saveWordStatuses = (statuses, storage = window.localStorage) => {
  storage.setItem(WORD_STATUSES_STORAGE_KEY, JSON.stringify(statuses));
};

export const loadWordStatusesFromIndexedDb = async ({
  storage = window.localStorage,
  idbFactory,
} = {}) => {
  if (!isIndexedDbSupported(idbFactory)) return null;
  try {
    let statuses = await idbGetAllWordStatuses(idbFactory);
    if (statuses.length === 0) {
      const fallback = loadWordStatuses(storage);
      if (fallback.length > 0) {
        await idbReplaceAllWordStatuses(fallback, idbFactory);
        statuses = fallback;
      }
    }
    return Array.isArray(statuses) ? normalizeStatusEntries(statuses) : [];
  } catch (error) {
    return null;
  }
};

export const saveWordStatusesToIndexedDb = async (statuses, idbFactory) => {
  if (!isIndexedDbSupported(idbFactory)) return false;
  try {
    await idbReplaceAllWordStatuses(statuses, idbFactory);
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
