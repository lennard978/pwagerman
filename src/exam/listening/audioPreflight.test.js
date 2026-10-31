import { preflightListeningAudio } from "./audioPreflight";

const formFor = (audioId = "audio-1") => ({ parts: [{ audio: [{ id: audioId }] }] });
const entryFor = (overrides = {}) => ({
  audioId: "audio-1",
  path: "/audio/listening/audio-v1/audio-1.mp3",
  assetStatus: "ready",
  ready: true,
  scriptHash: "a".repeat(64),
  sha256: "b".repeat(64),
  assetChecksum: "b".repeat(64),
  byteSize: 1024,
  durationSeconds: 12,
  developmentFixture: false,
  ...overrides,
});

const audioFactory = ({ event = "loadedmetadata", duration = 12 } = {}) => () => {
  const listeners = {};
  return {
    duration,
    addEventListener: jest.fn((name, listener) => { listeners[name] = listener; }),
    removeAttribute: jest.fn(),
    load: jest.fn(() => listeners[event]?.()),
  };
};

describe("Listening audio preflight", () => {
  test("accepts a loadable, decodable, checksummed asset", async () => {
    const fetchImpl = jest.fn().mockResolvedValue({ ok: true });
    const result = await preflightListeningAudio(formFor(), { fetchImpl, audioFactory: audioFactory(), manifest: [entryFor()], online: true });
    expect(result).toMatchObject({ ready: true, errors: [] });
    expect(fetchImpl).toHaveBeenCalledWith(expect.stringContaining("audio-1.mp3"), { method: "HEAD", cache: "no-store" });
  });

  test.each([
    ["missing asset", { fetchImpl: async () => ({ ok: false }), audioFactory: audioFactory(), online: true }, "missing-asset"],
    ["decode failure", { fetchImpl: async () => ({ ok: true }), audioFactory: audioFactory({ event: "error" }), online: true }, "decode-error"],
    ["uncached offline asset", { fetchImpl: jest.fn(), audioFactory: audioFactory({ event: "error" }), cacheResolver: async () => null, online: false }, "offline-uncached"],
  ])("rejects a %s before session creation", async (name, dependencies, reason) => {
    const result = await preflightListeningAudio(formFor(), { ...dependencies, manifest: [entryFor()] });
    expect(result.ready).toBe(false);
    expect(result.errors).toContainEqual({ audioId: "audio-1", reason });
  });

  test("allows a previously cached asset to decode while offline without a network probe", async () => {
    const fetchImpl = jest.fn();
    const revoke = jest.fn();
    const cacheResolver = jest.fn().mockResolvedValue({ url: "blob:cached-audio", revoke });
    const result = await preflightListeningAudio(formFor(), { fetchImpl, audioFactory: audioFactory(), cacheResolver, manifest: [entryFor()], online: false });
    expect(result.ready).toBe(true);
    expect(fetchImpl).not.toHaveBeenCalled();
    expect(cacheResolver).toHaveBeenCalledWith(expect.objectContaining({ audioId: "audio-1" }));
    expect(revoke).toHaveBeenCalled();
  });

  test("verifies a shared controlled fixture URL only once", async () => {
    const fetchImpl = jest.fn().mockResolvedValue({ ok: true });
    const factory = audioFactory();
    const form = { parts: [{ audio: [{ id: "audio-1" }, { id: "audio-2" }] }] };
    const manifest = [entryFor(), entryFor({ audioId: "audio-2" })];
    const result = await preflightListeningAudio(form, { fetchImpl, audioFactory: factory, manifest, online: true });
    expect(result.ready).toBe(true);
    expect(fetchImpl).toHaveBeenCalledTimes(1);
  });

  test.each([
    [[], "manifest-entry-missing"],
    [[entryFor({ assetStatus: "pending-generation", assetChecksum: null })], "asset-pending"],
  ])("rejects missing or unproduced manifest assets", async (manifest, reason) => {
    const result = await preflightListeningAudio(formFor(), { manifest, fetchImpl: jest.fn(), audioFactory: audioFactory(), online: true });
    expect(result.ready).toBe(false);
    expect(result.errors).toContainEqual({ audioId: "audio-1", reason });
  });
});
