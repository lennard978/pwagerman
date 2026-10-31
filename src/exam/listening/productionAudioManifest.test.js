import productionAudioManifest from "./productionAudioManifest.json";
import { listeningAudioManifest, resolveListeningAudioUrl } from "./audioManifest";
import { getListeningProductionReadiness, validateListeningAudioManifest } from "./manifestValidation";
import { getFullMockAvailability } from "../config/goetheB1Mock";

test("production manifest defines the exact ready 24-asset inventory", () => {
  expect(productionAudioManifest).toHaveLength(24);
  expect([1, 2, 3, 4].map((part) => productionAudioManifest.filter((entry) => entry.part === part).length)).toEqual([15, 3, 3, 3]);
  expect(productionAudioManifest.every(({ ready, sha256, byteSize, durationSeconds, humanQa, locale, sourceType }) =>
    ready && /^[a-f0-9]{64}$/.test(sha256) && byteSize > 0 && durationSeconds > 0 && humanQa === "PENDING" && locale === "de-DE" && sourceType === "generated-production"
  )).toBe(true);
  expect(getListeningProductionReadiness(listeningAudioManifest)).toEqual(expect.objectContaining({ valid: true, productionReady: true, readyCount: 24, totalCount: 24 }));
  ["001", "002", "003"].forEach((suffix) => expect(productionAudioManifest.filter(({ formId }) => formId.endsWith(suffix))).toHaveLength(8));
});

test("production paths honor the configured basename", () => {
  const previous = process.env.PUBLIC_URL;
  process.env.PUBLIC_URL = "/pwagerman";
  expect(resolveListeningAudioUrl(listeningAudioManifest[0])).toBe("/pwagerman/audio/listening/audio-v1/form-001/part-1-track-01.mp3");
  process.env.PUBLIC_URL = previous;
});

test("Part 3 and Part 4 retain distinct production voice profiles", () => {
  productionAudioManifest.filter(({ part }) => part === 3).forEach((entry) => {
    expect(new Set(entry.voiceProfiles.map(({ voiceName }) => voiceName)).size).toBeGreaterThanOrEqual(2);
  });
  productionAudioManifest.filter(({ part }) => part === 4).forEach((entry) => {
    expect(new Set(entry.voiceProfiles.map(({ voiceName }) => voiceName)).size).toBeGreaterThanOrEqual(3);
  });
});

test("runtime readiness requires complete valid metadata for all 24 assets", () => {
  const ready = listeningAudioManifest.map((entry) => ({
    ...entry,
    ready: true,
    assetStatus: "ready",
    sha256: "a".repeat(64),
    assetChecksum: "a".repeat(64),
    byteSize: 1024,
    durationSeconds: 10,
  }));
  expect(validateListeningAudioManifest(ready)).toEqual(expect.objectContaining({ valid: true, productionReady: true, readyCount: 24 }));
  expect(validateListeningAudioManifest(ready.slice(0, 23)).productionReady).toBe(false);
});

test("development fixture data cannot unlock a production Full Mock", () => {
  const fixtures = listeningAudioManifest.map((entry) => ({ ...entry, developmentFixture: true, ready: true, assetStatus: "ready", assetChecksum: "fixture" }));
  expect(getFullMockAvailability({ manifest: fixtures, nodeEnv: "production", fixtureMode: true, allowDevelopmentFixture: true }).available).toBe(false);
  expect(getFullMockAvailability({ manifest: listeningAudioManifest, nodeEnv: "production" })).toEqual(expect.objectContaining({ available: true, productionReady: true, reason: null }));
});
