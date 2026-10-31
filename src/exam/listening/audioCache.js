import {
  LISTENING_AUDIO_CACHE_MAX_ENTRIES,
  LISTENING_AUDIO_CACHE_NAME,
  LISTENING_AUDIO_CACHE_PREFIX,
  resolveListeningAudioUrl,
} from "./audioManifest";

export const cleanupOldListeningAudioCaches = async (cachesImpl = window.caches) => {
  const keys = await cachesImpl.keys();
  const oldKeys = keys.filter((key) => key.startsWith(LISTENING_AUDIO_CACHE_PREFIX) && key !== LISTENING_AUDIO_CACHE_NAME);
  await Promise.all(oldKeys.map((key) => cachesImpl.delete(key)));
  return oldKeys;
};

export const cacheListeningAudio = async (entries, {
  cachesImpl = window.caches,
  fetchImpl = window.fetch.bind(window),
} = {}) => {
  if (entries.length > LISTENING_AUDIO_CACHE_MAX_ENTRIES) return { cached: false, reason: "cache-limit" };
  await cleanupOldListeningAudioCaches(cachesImpl);
  const cache = await cachesImpl.open(LISTENING_AUDIO_CACHE_NAME);
  for (const entry of entries) {
    const url = resolveListeningAudioUrl(entry);
    const response = await fetchImpl(url, { cache: "no-store" });
    if (!response.ok) return { cached: false, reason: "asset-load-failed", audioId: entry.audioId };
    await cache.put(url, response.clone());
  }
  return { cached: true, count: entries.length, cacheName: LISTENING_AUDIO_CACHE_NAME };
};
