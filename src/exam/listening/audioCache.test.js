import {
  cacheListeningAudio,
  cleanupOldListeningAudioCaches,
  getCachedListeningAudioUrl,
  resolveListeningAudioSource,
} from "./audioCache";
import {
  LISTENING_AUDIO_CACHE_MAX_ENTRIES,
  LISTENING_AUDIO_CACHE_NAME,
} from "./audioManifest";

const entry = (index = 1) => ({ audioId: `audio-${index}`, path: `/audio/listening/audio-v1/audio-${index}.mp3` });

const cacheEnvironment = () => {
  const cache = { put: jest.fn().mockResolvedValue(undefined) };
  const cachesImpl = {
    keys: jest.fn().mockResolvedValue(["german-b1-listening-audio-v0", LISTENING_AUDIO_CACHE_NAME, "app-shell"]),
    delete: jest.fn().mockResolvedValue(true),
    open: jest.fn().mockResolvedValue(cache),
  };
  return { cache, cachesImpl };
};

describe("Listening audio cache", () => {
  test("uses a bounded versioned cache and removes only old Listening versions", async () => {
    const { cache, cachesImpl } = cacheEnvironment();
    const response = { ok: true, clone: jest.fn(() => ({ body: "copy" })) };
    const onProgress = jest.fn();
    const result = await cacheListeningAudio([entry()], { cachesImpl, fetchImpl: jest.fn().mockResolvedValue(response), onProgress });
    expect(result).toEqual({ cached: true, count: 1, cacheName: LISTENING_AUDIO_CACHE_NAME });
    expect(onProgress).toHaveBeenCalledWith({ completed: 1, total: 1, audioId: "audio-1" });
    expect(cachesImpl.delete).toHaveBeenCalledWith("german-b1-listening-audio-v0");
    expect(cachesImpl.delete).not.toHaveBeenCalledWith("app-shell");
    expect(cache.put).toHaveBeenCalledTimes(1);
  });

  test("reports a missing media response without pretending the set is offline-ready", async () => {
    const { cachesImpl } = cacheEnvironment();
    const result = await cacheListeningAudio([entry()], { cachesImpl, fetchImpl: jest.fn().mockResolvedValue({ ok: false }) });
    expect(result).toEqual({ cached: false, reason: "asset-load-failed", audioId: "audio-1" });
  });

  test("refuses an unbounded media set", async () => {
    const { cachesImpl } = cacheEnvironment();
    const entries = Array.from({ length: LISTENING_AUDIO_CACHE_MAX_ENTRIES + 1 }, (_, index) => entry(index));
    await expect(cacheListeningAudio(entries, { cachesImpl, fetchImpl: jest.fn() })).resolves.toEqual({ cached: false, reason: "cache-limit" });
    expect(cachesImpl.open).not.toHaveBeenCalled();
  });

  test("cleanup returns the removed cache names", async () => {
    const { cachesImpl } = cacheEnvironment();
    await expect(cleanupOldListeningAudioCaches(cachesImpl)).resolves.toEqual(["german-b1-listening-audio-v0"]);
  });

  test("creates a revocable object URL for cached offline playback", async () => {
    const blob = { type: "audio/mpeg" };
    const response = { blob: jest.fn().mockResolvedValue(blob) };
    const cache = { match: jest.fn().mockResolvedValue(response) };
    const cachesImpl = { open: jest.fn().mockResolvedValue(cache) };
    const urlApi = { createObjectURL: jest.fn(() => "blob:cached-audio"), revokeObjectURL: jest.fn() };
    const result = await getCachedListeningAudioUrl(entry(), { cachesImpl, urlApi });
    expect(result.url).toBe("blob:cached-audio");
    result.revoke();
    expect(urlApi.createObjectURL).toHaveBeenCalledWith(blob);
    expect(urlApi.revokeObjectURL).toHaveBeenCalledWith("blob:cached-audio");
  });

  test("reports a cache miss without creating an object URL", async () => {
    const cache = { match: jest.fn().mockResolvedValue(undefined) };
    const urlApi = { createObjectURL: jest.fn() };
    await expect(getCachedListeningAudioUrl(entry(), {
      cachesImpl: { open: jest.fn().mockResolvedValue(cache) },
      urlApi,
    })).resolves.toBeNull();
    expect(urlApi.createObjectURL).not.toHaveBeenCalled();
  });

  test("prefers a prepared cache entry even when the browser still reports online", async () => {
    const revoke = jest.fn();
    const cacheResolver = jest.fn().mockResolvedValue({ url: "blob:prepared-audio", revoke });
    await expect(resolveListeningAudioSource(entry(), { online: true, cacheResolver })).resolves.toEqual({
      url: "blob:prepared-audio",
      revoke,
      source: "cache",
    });
  });

  test("uses the versioned network URL only when no prepared cache entry exists", async () => {
    const cacheResolver = jest.fn().mockResolvedValue(null);
    const source = await resolveListeningAudioSource(entry(), { online: true, cacheResolver });
    expect(source).toMatchObject({ url: "/audio/listening/audio-v1/audio-1.mp3", source: "network" });
    expect(source.revoke).toEqual(expect.any(Function));
  });

  test("fails closed when neither prepared cache nor a connection is available", async () => {
    await expect(resolveListeningAudioSource(entry(), {
      online: false,
      cacheResolver: jest.fn().mockResolvedValue(null),
    })).resolves.toBeNull();
  });
});
