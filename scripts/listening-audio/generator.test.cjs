const test = require("node:test");
const assert = require("node:assert/strict");
const crypto = require("node:crypto");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const { VOICE_ROLES } = require("./config.cjs");
const { generationPrerequisiteBlockers, parseArgs, recordIsCurrent, verifyProviderVoices } = require("../generate-listening-audio.cjs");

test("generation CLI supports plan, force, form, sync, and validation modes", () => {
  assert.deepEqual(parseArgs(["--form", "form-002", "--force", "--plan"]), {
    force: true, plan: true, syncManifest: false, validate: false, form: "form-002",
  });
  assert.equal(parseArgs(["--sync-manifest"]).syncManifest, true);
  assert.equal(parseArgs(["--validate"]).validate, true);
});

test("provider voice preflight requires every configured de-DE voice", async () => {
  const names = Object.values(VOICE_ROLES).map(({ voiceName }) => voiceName);
  const client = { listVoices: async () => [{ voices: names.map((name) => ({ name })) }] };
  await assert.doesNotReject(() => verifyProviderVoices(client));
  await assert.rejects(() => verifyProviderVoices({ listVoices: async () => [{ voices: [] }] }), /google-voices-unavailable/);
});

test("prerequisite audit reports missing tools and credentials without exposing values", () => {
  const blockers = generationPrerequisiteBlockers();
  expectOrAssert(blockers);
});

test("unchanged records require the exact physical MP3", () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "listening-current-record-"));
  try {
    const relativePath = "/audio/listening/audio-v1/form-001/part-1-track-01.mp3";
    const filename = path.join(root, "public", ...relativePath.split("/").filter(Boolean));
    const bytes = Buffer.from([0x49, 0x44, 0x33, 0x04, 0x00, 0x00]);
    fs.mkdirSync(path.dirname(filename), { recursive: true });
    fs.writeFileSync(filename, bytes);
    const catalogEntry = { path: relativePath, scriptHash: "a".repeat(64), scriptChecksum: "script-v1" };
    const record = {
      ...catalogEntry,
      ready: true,
      byteSize: bytes.length,
      sha256: crypto.createHash("sha256").update(bytes).digest("hex"),
    };
    assert.equal(recordIsCurrent(record, catalogEntry, { root }), true);
    fs.appendFileSync(filename, Buffer.from([0x01]));
    assert.equal(recordIsCurrent(record, catalogEntry, { root }), false);
    fs.rmSync(filename);
    assert.equal(recordIsCurrent(record, catalogEntry, { root }), false);
  } finally {
    fs.rmSync(root, { recursive: true, force: true });
  }
});

const expectOrAssert = (blockers) => {
  assert.ok(Array.isArray(blockers));
  blockers.forEach((blocker) => assert.match(blocker, /^(google-credentials-(missing|incomplete)|ffmpeg-missing|ffprobe-missing)$/));
};
