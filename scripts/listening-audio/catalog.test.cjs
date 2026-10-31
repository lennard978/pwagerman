const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const { MANIFEST_PATH, VOICE_ROLES } = require("./config.cjs");
const {
  buildCatalog,
  createManifest,
  scriptHash,
  validateCatalog,
  validateVoiceConfig,
} = require("./catalog.cjs");
const { validateManifest } = require("./manifestValidation.cjs");

const catalog = buildCatalog();
const manifest = JSON.parse(fs.readFileSync(MANIFEST_PATH, "utf8"));

test("catalog contains exactly 15/3/3/3 recordings and three forms", () => {
  assert.equal(catalog.length, 24);
  assert.deepEqual([1, 2, 3, 4].map((part) => catalog.filter((entry) => entry.part === part).length), [15, 3, 3, 3]);
  assert.equal(new Set(catalog.map(({ formId }) => formId)).size, 3);
  assert.deepEqual(validateCatalog(catalog), []);
});

test("voice map is German-only and multi-speaker parts stay distinct", () => {
  assert.deepEqual(validateVoiceConfig(catalog), []);
  Object.values(VOICE_ROLES).forEach(({ locale, voiceName }) => {
    assert.equal(locale, "de-DE");
    assert.match(voiceName, /^de-DE-Chirp3-HD-/);
  });
  catalog.filter(({ part }) => part === 3).forEach((entry) => assert.ok(new Set(entry.voiceProfiles.map(({ voiceName }) => voiceName)).size >= 2));
  catalog.filter(({ part }) => part === 4).forEach((entry) => assert.ok(new Set(entry.voiceProfiles.map(({ voiceName }) => voiceName)).size >= 3));
});

test("normalized SHA-256 script hashes change when a transcript changes", () => {
  const segments = [{ speakerId: "a", text: "Guten   Tag" }];
  assert.equal(scriptHash(segments), scriptHash([{ speakerId: "a", text: "Guten Tag" }]));
  assert.notEqual(scriptHash(segments), scriptHash([{ speakerId: "a", text: "Guten Abend" }]));
  assert.match(scriptHash(segments), /^[a-f0-9]{64}$/);
});

test("checked-in manifest matches the current scripts and deterministic paths", () => {
  const synchronized = createManifest(catalog, manifest);
  assert.equal(synchronized.length, 24);
  synchronized.forEach((entry, index) => {
    assert.equal(entry.scriptHash, manifest[index].scriptHash);
    assert.equal(entry.scriptChecksum, manifest[index].scriptChecksum);
    assert.equal(entry.path, manifest[index].path);
    assert.match(entry.path, /^\/audio\/listening\/audio-v1\/form-00[1-3]\/part-/);
  });
});

test("generated architecture validates and claims production readiness", () => {
  const result = validateManifest(manifest, catalog, { requireDecodable: false });
  assert.equal(result.valid, true);
  assert.equal(result.productionReady, true);
  assert.equal(result.readyCount, 24);
});

test("ready metadata cannot pass without its exact committed file", () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "audio-manifest-test-"));
  try {
    const oneReady = manifest.map((entry, index) => index === 0 ? {
      ...entry,
      ready: true,
      sha256: "a".repeat(64),
      byteSize: 100,
      durationSeconds: 1,
    } : entry);
    const result = validateManifest(oneReady, catalog, { root, requireDecodable: false });
    assert.ok(result.errors.includes(`file-missing:${oneReady[0].audioId}`));
    assert.equal(result.productionReady, false);
  } finally {
    fs.rmSync(root, { recursive: true, force: true });
  }
});
