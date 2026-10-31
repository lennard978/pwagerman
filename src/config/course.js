import course from "./course.json";

export const COURSE_CONFIG = Object.freeze(course);
export const TARGET_LANGUAGE = COURSE_CONFIG.targetLanguage;
export const TARGET_LANGUAGE_NAME = COURSE_CONFIG.targetLanguageName;
export const STORAGE_CONFIG = Object.freeze(COURSE_CONFIG.storage);
export const TTS_CONFIG = Object.freeze(COURSE_CONFIG.tts);

export const getPublicAsset = (asset) =>
  `${process.env.PUBLIC_URL}${COURSE_CONFIG.assets[asset]}`;
