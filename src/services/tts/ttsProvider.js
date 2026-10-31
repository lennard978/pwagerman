import { speakWithBrowser } from "./browserTtsProvider";
import { fetchCloudAudio } from "./cloudTtsProvider";
import { COURSE_CONFIG, TARGET_LANGUAGE, TTS_CONFIG } from "../../config/course";

const audioCache = new Map();
let activePlayback = null;
let playbackSequence = 0;

const SILENT_AUDIO = "data:audio/wav;base64,UklGRigAAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQQAAAAA";

export const prepareAudio = () => {
  const audio = new Audio();
  audio.preload = "auto";
  audio.playsInline = true;
  audio.muted = true;
  audio.src = SILENT_AUDIO;
  try {
    const unlockResult = audio.play();
    if (unlockResult?.catch) unlockResult.catch(() => {});
  } catch (error) {
    // Cloud playback still gets a chance before falling back to browser speech.
  }
  return audio;
};

const releasePlayback = (playback) => {
  if (!playback) return;
  playback.audio.pause();
  if (playback.objectUrl) {
    URL.revokeObjectURL(playback.objectUrl);
    playback.objectUrl = null;
  }
};

const playCloudBlob = ({ audio, blob, requestId, fallback }) => {
  if (requestId !== playbackSequence) {
    audio.pause();
    return Promise.resolve(false);
  }

  const objectUrl = URL.createObjectURL(blob);
  const playback = { audio, objectUrl };
  let fallbackUsed = false;
  activePlayback = playback;
  audio.muted = false;
  audio.src = objectUrl;
  audio.load();

  const cleanup = () => {
    if (!playback.objectUrl) return;
    URL.revokeObjectURL(playback.objectUrl);
    playback.objectUrl = null;
    if (activePlayback === playback) activePlayback = null;
  };
  const fallbackOnce = () => {
    if (fallbackUsed || requestId !== playbackSequence) return;
    fallbackUsed = true;
    fallback();
  };
  audio.addEventListener("ended", cleanup, { once: true });
  audio.addEventListener("error", () => {
    cleanup();
    fallbackOnce();
  }, { once: true });

  let playResult;
  try {
    playResult = audio.play();
  } catch (error) {
    cleanup();
    fallbackOnce();
    return Promise.resolve(false);
  }

  return Promise.resolve(playResult)
    .then(() => true)
    .catch(() => {
      cleanup();
      fallbackOnce();
      return false;
    });
};

export const normalizeSpeechLanguage = (language) => {
  if (typeof language !== "string" || !language.trim()) return TARGET_LANGUAGE;
  const normalized = language.trim().toLowerCase();
  const targetBase = TARGET_LANGUAGE.toLowerCase().split("-")[0];
  return normalized === targetBase || normalized.startsWith(`${targetBase}-`)
    ? TARGET_LANGUAGE
    : language;
};

export const speak = ({ text, lang, voices, browserSpeak }) => {
  const speechLanguage = normalizeSpeechLanguage(lang);
  const cacheKey = `${COURSE_CONFIG.id}:${TTS_CONFIG.cacheVersion}:${speechLanguage}:${text.trim().toLocaleLowerCase()}`;
  const requestId = ++playbackSequence;
  const preparedAudio = prepareAudio();
  const fallback = () => speakWithBrowser({
    text,
    lang: speechLanguage,
    voices,
    speak: browserSpeak,
  });

  releasePlayback(activePlayback);
  activePlayback = { audio: preparedAudio, objectUrl: null };

  if (audioCache.has(cacheKey)) {
    return playCloudBlob({
      audio: preparedAudio,
      blob: audioCache.get(cacheKey),
      requestId,
      fallback,
    });
  }

  const cloudResult = fetchCloudAudio({ text, lang: speechLanguage });
  if (!cloudResult) {
    preparedAudio.pause();
    fallback();
    return Promise.resolve(false);
  }

  return cloudResult.then((blob) => {
    if (requestId !== playbackSequence) {
      preparedAudio.pause();
      return false;
    }
    if (!blob) {
      preparedAudio.pause();
      fallback();
      return false;
    }
    audioCache.set(cacheKey, blob);
    return playCloudBlob({ audio: preparedAudio, blob, requestId, fallback });
  }).catch(() => {
    if (requestId === playbackSequence) fallback();
    return false;
  });
};

export const clearTtsCache = () => {
  audioCache.clear();
  playbackSequence += 1;
  releasePlayback(activePlayback);
  activePlayback = null;
};

