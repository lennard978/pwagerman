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
  onProgress = () => {},
} = {}) => {
  if (entries.length > LISTENING_AUDIO_CACHE_MAX_ENTRIES) return { cached: false, reason: "cache-limit" };
  await cleanupOldListeningAudioCaches(cachesImpl);
  const cache = await cachesImpl.open(LISTENING_AUDIO_CACHE_NAME);
  for (const [index, entry] of entries.entries()) {
    const url = resolveListeningAudioUrl(entry);
    const response = await fetchImpl(url, { cache: "no-store" });
    if (!response.ok) return { cached: false, reason: "asset-load-failed", audioId: entry.audioId };
    await cache.put(url, response.clone());
    onProgress({ completed: index + 1, total: entries.length, audioId: entry.audioId });
  }
  return { cached: true, count: entries.length, cacheName: LISTENING_AUDIO_CACHE_NAME };
};

export const getCachedListeningAudioUrl = async (entry, {
  cachesImpl = window.caches,
  urlApi = window.URL,
} = {}) => {
  const cache = await cachesImpl.open(LISTENING_AUDIO_CACHE_NAME);
  const response = await cache.match(resolveListeningAudioUrl(entry));
  if (!response) return null;
  const objectUrl = urlApi.createObjectURL(await response.blob());
  return {
    url: objectUrl,
    revoke: () => urlApi.revokeObjectURL(objectUrl),
  };
};

export const resolveListeningAudioSource = async (entry, {
  online = navigator.onLine,
  cacheResolver = getCachedListeningAudioUrl,
} = {}) => {
  try {
    const cached = await cacheResolver(entry);
    if (cached) return { ...cached, source: "cache" };
  } catch (error) {
    // Cache Storage may be unavailable or blocked. Network playback can still
    // proceed when the browser reports a usable connection.
  }
  if (!online) return null;
  return {
    url: resolveListeningAudioUrl(entry),
    revoke: () => {},
    source: "network",
  };
};
