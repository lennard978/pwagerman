import { speakWithBrowser } from "./browserTtsProvider";
import { fetchCloudAudio } from "./cloudTtsProvider";

const audioCache = new Map();

export const normalizeSpeechLanguage = (language) => {
  if (typeof language !== "string") return language;
  const normalized = language.toLowerCase();
  if (normalized === "sr" || normalized === "sr-latn" || normalized === "sr-rs") {
    return "sr-RS";
  }
  return language;
};

export const speak = ({ text, lang, voices, browserSpeak }) => {
  const speechLanguage = normalizeSpeechLanguage(lang);
  const cacheKey = `${speechLanguage}:v1:${text.trim().toLocaleLowerCase()}`;
  if (audioCache.has(cacheKey)) {
    const cachedAudio = audioCache.get(cacheKey);
    cachedAudio.play();
    return;
  }

  const cloudResult = fetchCloudAudio({ text, lang: speechLanguage });
  if (!cloudResult) {
    speakWithBrowser({ text, lang: speechLanguage, voices, speak: browserSpeak });
    return;
  }
  cloudResult.then((audio) => {
    if (!audio) {
      speakWithBrowser({ text, lang: speechLanguage, voices, speak: browserSpeak });
      return;
    }
    audioCache.set(cacheKey, audio);
    audio.play().catch(() => speakWithBrowser({ text, lang: speechLanguage, voices, speak: browserSpeak }));
  }).catch(() => speakWithBrowser({ text, lang: speechLanguage, voices, speak: browserSpeak }));
};

export const clearTtsCache = () => audioCache.clear();
