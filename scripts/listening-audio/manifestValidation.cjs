const crypto = require("node:crypto");
const fs = require("node:fs");
const path = require("node:path");
const { spawnSync } = require("node:child_process");
const { ROOT, AUDIO_VERSION } = require("./config.cjs");

const fileSha256 = (filename) => crypto.createHash("sha256").update(fs.readFileSync(filename)).digest("hex");
const hasMp3Signature = (filename) => {
  const bytes = fs.readFileSync(filename).subarray(0, 3);
  return bytes.toString("ascii") === "ID3" || (bytes[0] === 0xff && (bytes[1] & 0xe0) === 0xe0);
};

const probeDuration = (filename) => {
  const result = spawnSync("ffprobe", ["-v", "error", "-show_entries", "format=duration", "-of", "default=noprint_wrappers=1:nokey=1", filename], { encoding: "utf8" });
  if (result.status !== 0) return null;
  const duration = Number(result.stdout.trim());
  return Number.isFinite(duration) && duration > 0 ? duration : null;
};

const publicFile = (entry, root = ROOT) => path.join(root, "public", ...entry.path.split("/").filter(Boolean));

const validateManifest = (manifest, catalog, { root = ROOT, requireDecodable = true } = {}) => {
  const errors = [];
  const catalogById = new Map(catalog.map((entry) => [entry.audioId, entry]));
  if (manifest.length !== 24) errors.push(`manifest-count:${manifest.length}`);
  if (new Set(manifest.map(({ audioId }) => audioId)).size !== manifest.length) errors.push("manifest-duplicate-audio-id");

  let totalBytes = 0;
  let readyCount = 0;
  manifest.forEach((entry) => {
    const current = catalogById.get(entry.audioId);
    if (!current) { errors.push(`unknown-audio:${entry.audioId}`); return; }
    if (entry.audioVersion !== AUDIO_VERSION) errors.push(`audio-version:${entry.audioId}`);
    if (entry.scriptHash !== current.scriptHash || entry.scriptChecksum !== current.scriptChecksum) errors.push(`script-mismatch:${entry.audioId}`);
    if (entry.path !== current.path || !entry.path.startsWith(`/audio/listening/${AUDIO_VERSION}/form-`)) errors.push(`path:${entry.audioId}`);
    if (!entry.ready) return;
    readyCount += 1;
    if (!/^[a-f0-9]{64}$/.test(entry.sha256 || "") || !Number.isInteger(entry.byteSize) || entry.byteSize <= 0 || !Number.isFinite(entry.durationSeconds) || entry.durationSeconds <= 0) {
      errors.push(`ready-metadata:${entry.audioId}`);
      return;
    }
    const filename = publicFile(entry, root);
    if (!fs.existsSync(filename)) { errors.push(`file-missing:${entry.audioId}`); return; }
    const stat = fs.statSync(filename);
    totalBytes += stat.size;
    if (stat.size !== entry.byteSize) errors.push(`byte-size:${entry.audioId}`);
    if (fileSha256(filename) !== entry.sha256) errors.push(`checksum:${entry.audioId}`);
    if (!hasMp3Signature(filename)) errors.push(`mp3-signature:${entry.audioId}`);
    if (requireDecodable) {
      const duration = probeDuration(filename);
      if (!duration) errors.push(`decode:${entry.audioId}`);
      else if (Math.abs(duration - entry.durationSeconds) > 0.15) errors.push(`duration:${entry.audioId}`);
    }
  });

  return {
    valid: errors.length === 0,
    productionReady: errors.length === 0 && readyCount === 24,
    readyCount,
    totalCount: manifest.length,
    totalBytes,
    errors,
  };
};

module.exports = { fileSha256, hasMp3Signature, probeDuration, publicFile, validateManifest };
