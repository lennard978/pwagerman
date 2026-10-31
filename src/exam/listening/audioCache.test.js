import {
  cacheListeningAudio,
  cleanupOldListeningAudioCaches,
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
    const result = await cacheListeningAudio([entry()], { cachesImpl, fetchImpl: jest.fn().mockResolvedValue(response) });
    expect(result).toEqual({ cached: true, count: 1, cacheName: LISTENING_AUDIO_CACHE_NAME });
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
});
