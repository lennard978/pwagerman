export const MY_WORDS_STORAGE_KEY = "serbian-a1.myWords.v1";
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

export const normalizeWord = (value) =>
  typeof value === "string" ? value.trim() : "";

export const duplicateWord = (words, source, target, ignoredId) =>
  words.some(
    (word) =>
      word.id !== ignoredId &&
      word.source.toLocaleLowerCase() === source.toLocaleLowerCase() &&
      word.target.toLocaleLowerCase() === target.toLocaleLowerCase()
  );
