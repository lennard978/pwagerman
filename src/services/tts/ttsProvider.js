import { speakWithBrowser } from "./browserTtsProvider";
import { fetchCloudAudio } from "./cloudTtsProvider";

const audioCache = new Map();

export const speak = ({ text, lang, voices, browserSpeak }) => {
  const cacheKey = `${lang}:v1:${text.trim().toLocaleLowerCase()}`;
  if (audioCache.has(cacheKey)) {
    const cachedAudio = audioCache.get(cacheKey);
    cachedAudio.play();
    return;
  }

  const cloudResult = fetchCloudAudio({ text, lang });
  if (!cloudResult) {
    speakWithBrowser({ text, lang, voices, speak: browserSpeak });
    return;
  }
  cloudResult.then((audio) => {
    if (!audio) {
      speakWithBrowser({ text, lang, voices, speak: browserSpeak });
      return;
    }
    audioCache.set(cacheKey, audio);
    audio.play().catch(() => speakWithBrowser({ text, lang, voices, speak: browserSpeak }));
  }).catch(() => speakWithBrowser({ text, lang, voices, speak: browserSpeak }));
};

export const clearTtsCache = () => audioCache.clear();
