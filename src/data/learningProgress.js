import {
  idbGetProgress,
  idbSaveProgress,
  isIndexedDbSupported,
} from "./storage/idbMyWordsStore";
import {
  MY_WORDS_MIGRATED_KEY,
  MY_WORDS_STORAGE_KEY,
  WORD_STATUSES_STORAGE_KEY,
} from "./myWords";

export const PROGRESS_STORAGE_KEY = "serbian-a1.learningProgress.v1";
export const PROGRESS_VERSION = 2;

const localDate = (date = new Date()) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const existingUser = (storage) => {
  try {
    return Boolean(
      storage.getItem(MY_WORDS_STORAGE_KEY) ||
      storage.getItem(WORD_STATUSES_STORAGE_KEY) ||
      storage.getItem(MY_WORDS_MIGRATED_KEY)
    );
  } catch (error) {
    return false;
  }
};

export const createDefaultProgress = (storage = window.localStorage) => ({
  version: PROGRESS_VERSION,
  lastActivity: null,
  completedLessons: [],
  completedExercises: [],
  completedGrammarLessons: [],
  grammarMistakes: [],
  recentMistakes: [],
  activityDates: [],
  onboardingComplete: existingUser(storage),
});

export const normalizeProgress = (value, storage = window.localStorage) => {
  const defaults = createDefaultProgress(storage);
  if (!value || typeof value !== "object") return defaults;
  return {
    ...defaults,
    ...value,
    version: PROGRESS_VERSION,
    completedLessons: Array.isArray(value.completedLessons) ? value.completedLessons : [],
    completedExercises: Array.isArray(value.completedExercises) ? value.completedExercises : [],
    completedGrammarLessons: Array.isArray(value.completedGrammarLessons)
      ? [...new Set(value.completedGrammarLessons)]
      : [],
    grammarMistakes: Array.isArray(value.grammarMistakes) ? value.grammarMistakes : [],
    recentMistakes: Array.isArray(value.recentMistakes) ? value.recentMistakes : [],
    activityDates: Array.isArray(value.activityDates) ? [...new Set(value.activityDates)] : [],
    onboardingComplete: typeof value.onboardingComplete === "boolean"
      ? value.onboardingComplete
      : defaults.onboardingComplete,
  };
};

export const loadProgress = (storage = window.localStorage) => {
  try {
    return normalizeProgress(
      JSON.parse(storage.getItem(PROGRESS_STORAGE_KEY) || "null"),
      storage
    );
  } catch (error) {
    return createDefaultProgress(storage);
  }
};

export const saveProgress = (progress, storage = window.localStorage) => {
  try {
    storage.setItem(PROGRESS_STORAGE_KEY, JSON.stringify(progress));
    return true;
  } catch (error) {
    return false;
  }
};

export const loadProgressFromIndexedDb = async ({
  storage = window.localStorage,
  idbFactory,
} = {}) => {
  if (!isIndexedDbSupported(idbFactory)) return null;
  try {
    const stored = await idbGetProgress(idbFactory);
    if (stored) return normalizeProgress(stored, storage);
    const fallback = loadProgress(storage);
    await idbSaveProgress(fallback, idbFactory);
    return fallback;
  } catch (error) {
    return null;
  }
};

export const saveProgressToIndexedDb = async (progress, idbFactory) => {
  if (!isIndexedDbSupported(idbFactory)) return false;
  try {
    await idbSaveProgress(progress, idbFactory);
    return true;
  } catch (error) {
    return false;
  }
};

export const progressWord = (word) => {
  if (!word) return null;
  const source = word.source || word.prompt || "";
  const target = word.target || word.correctAnswer || word.answer || "";
  if (!source || !target) return null;
  return {
    id: word.id || word.wordId || `${source}|${target}`,
    source,
    target,
    kind: word.kind || "built-in",
  };
};

export const recordStudyDate = (dates, date = new Date()) =>
  [...new Set([...dates, localDate(date)])].slice(-365);

export const getCurrentStreak = (dates, now = new Date()) => {
  const active = new Set(dates);
  let cursor = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  let streak = 0;
  while (active.has(localDate(cursor))) {
    streak += 1;
    cursor.setDate(cursor.getDate() - 1);
  }
  return streak;
};
