#!/usr/bin/env node
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const { spawnSync } = require("node:child_process");
const {
  ROOT,
  LOCALE,
  SAMPLE_RATE_HZ,
  MP3_BITRATE,
  TURN_PAUSE_SECONDS,
  VOICE_ROLES,
  MANIFEST_PATH,
  QA_REPORT_PATH,
} = require("./listening-audio/config.cjs");
const {
  buildCatalog,
  createManifest,
  generationText,
  validateCatalog,
} = require("./listening-audio/catalog.cjs");
const {
  fileSha256,
  hasMp3Signature,
  probeDuration,
  publicFile,
  validateManifest,
} = require("./listening-audio/manifestValidation.cjs");

const readJson = (filename, fallback = []) => {
  try { return JSON.parse(fs.readFileSync(filename, "utf8")); } catch (error) { return fallback; }
};

const writeAtomic = (filename, content) => {
  fs.mkdirSync(path.dirname(filename), { recursive: true });
  const temporary = `${filename}.${process.pid}.tmp`;
  fs.writeFileSync(temporary, content);
  fs.renameSync(temporary, filename);
};

const writeManifest = (manifest) => writeAtomic(MANIFEST_PATH, `${JSON.stringify(manifest, null, 2)}\n`);

const humanSize = (bytes) => bytes ? `${(bytes / 1024).toFixed(1)} KiB` : "—";
const writeQaReport = (manifest) => {
  const lines = [
    "# German B1 Listening audio QA",
    "",
    "Automated metadata is not a substitute for listening. Human status remains `PENDING` until a reviewer audibly checks the entire track.",
    "",
    "| Audio ID | Form | Part | Duration | Voice(s) | Size | SHA-256 | Automated | Human listen |",
    "|---|---:|---:|---:|---|---:|---|---|---|",
    ...manifest.map((entry) => `| ${entry.audioId} | ${entry.formId.slice(-3)} | ${entry.part} | ${entry.durationSeconds ? `${entry.durationSeconds.toFixed(2)} s` : "—"} | ${entry.voiceProfiles.map(({ voiceName }) => voiceName?.replace("de-DE-Chirp3-HD-", "") || "—").join(", ")} | ${humanSize(entry.byteSize)} | ${entry.sha256 ? entry.sha256.slice(0, 12) : "—"} | ${entry.ready ? "PASS" : "BLOCKED"} | PENDING |`),
    "",
    "Human checklist: pronunciation; B1 pacing; naturalness; speaker distinction; no clipped start/end; numbers and times; correct German; natural pauses; exact script.",
    "",
  ];
  writeAtomic(QA_REPORT_PATH, lines.join("\n"));
};

const parseArgs = (argv) => {
  const args = { force: false, plan: false, syncManifest: false, validate: false, form: null };
  for (let index = 0; index < argv.length; index += 1) {
    const value = argv[index];
    if (value === "--force") args.force = true;
    else if (value === "--plan") args.plan = true;
    else if (value === "--sync-manifest") args.syncManifest = true;
    else if (value === "--validate") args.validate = true;
    else if (value === "--form") args.form = argv[++index] || null;
    else throw new Error(`unknown-argument:${value}`);
  }
  return args;
};

const commandAvailable = (command) => spawnSync(command, ["-version"], { stdio: "ignore" }).status === 0;
const applicationDefaultCredentialPaths = ({
  env = process.env,
  platform = process.platform,
  homedir = os.homedir(),
} = {}) => [
  env.GOOGLE_APPLICATION_CREDENTIALS,
  platform === "win32" && env.APPDATA
    ? path.join(env.APPDATA, "gcloud", "application_default_credentials.json")
    : path.join(homedir, ".config", "gcloud", "application_default_credentials.json"),
].filter(Boolean);
const applicationDefaultCredentialsAvailable = (options) =>
  applicationDefaultCredentialPaths(options).some((filename) => fs.existsSync(filename));
const generationPrerequisiteBlockers = () => {
  const explicitKeys = ["GOOGLE_CLOUD_PROJECT_ID", "GOOGLE_CLOUD_CLIENT_EMAIL", "GOOGLE_CLOUD_PRIVATE_KEY"];
  const explicitCount = explicitKeys.filter((key) => process.env[key]).length;
  const blockers = [];
  if (explicitCount > 0 && explicitCount < explicitKeys.length) blockers.push("google-credentials-incomplete");
  else if (explicitCount === 0 && !applicationDefaultCredentialsAvailable()) blockers.push("google-credentials-missing");
  if (!commandAvailable("ffmpeg")) blockers.push("ffmpeg-missing");
  if (!commandAvailable("ffprobe")) blockers.push("ffprobe-missing");
  return blockers;
};
const run = (command, args) => {
  const result = spawnSync(command, args, { encoding: "utf8" });
  if (result.status !== 0) throw new Error(`${command}-failed`);
  return result.stdout;
};

const escapeConcatPath = (filename) => filename.replace(/\\/g, "/").replace(/'/g, "'\\''");

const encodeTrack = (segmentBuffers, directory, output) => {
  const segmentFiles = segmentBuffers.map((buffer, index) => {
    const filename = path.join(directory, `segment-${String(index + 1).padStart(2, "0")}.wav`);
    fs.writeFileSync(filename, buffer);
    return filename;
  });
  const sequence = [];
  let pauseFile = null;
  if (segmentFiles.length > 1) {
    pauseFile = path.join(directory, "turn-pause.wav");
    run("ffmpeg", ["-hide_banner", "-loglevel", "error", "-f", "lavfi", "-i", `anullsrc=r=${SAMPLE_RATE_HZ}:cl=mono`, "-t", String(TURN_PAUSE_SECONDS), "-c:a", "pcm_s16le", "-y", pauseFile]);
  }
  segmentFiles.forEach((filename, index) => {
    sequence.push(filename);
    if (pauseFile && index < segmentFiles.length - 1) sequence.push(pauseFile);
  });
  const concatFile = path.join(directory, "concat.txt");
  fs.writeFileSync(concatFile, sequence.map((filename) => `file '${escapeConcatPath(filename)}'`).join("\n"));
  run("ffmpeg", ["-hide_banner", "-loglevel", "error", "-f", "concat", "-safe", "0", "-i", concatFile, "-ar", String(SAMPLE_RATE_HZ), "-ac", "1", "-c:a", "libmp3lame", "-b:a", MP3_BITRATE, "-y", output]);
};

const replaceValidatedFile = (temporary, destination) => {
  fs.mkdirSync(path.dirname(destination), { recursive: true });
  const next = `${destination}.${process.pid}.next`;
  const backup = `${destination}.${process.pid}.backup`;
  fs.copyFileSync(temporary, next);
  const hadExisting = fs.existsSync(destination);
  try {
    if (hadExisting) fs.renameSync(destination, backup);
    fs.renameSync(next, destination);
    if (hadExisting) fs.rmSync(backup, { force: true });
  } catch (error) {
    fs.rmSync(next, { force: true });
    if (hadExisting && fs.existsSync(backup) && !fs.existsSync(destination)) fs.renameSync(backup, destination);
    throw error;
  }
};

const createClient = () => {
  const explicitKeys = ["GOOGLE_CLOUD_PROJECT_ID", "GOOGLE_CLOUD_CLIENT_EMAIL", "GOOGLE_CLOUD_PRIVATE_KEY"];
  const explicitCount = explicitKeys.filter((key) => process.env[key]).length;
  if (explicitCount > 0 && explicitCount < explicitKeys.length) throw new Error("google-credentials-incomplete");
  if (explicitCount === 0 && !applicationDefaultCredentialsAvailable()) throw new Error("google-credentials-missing");
  // Loaded only by this local generation tool. It is never imported by React.
  // eslint-disable-next-line global-require
  const textToSpeech = require("@google-cloud/text-to-speech");
  if (explicitCount === explicitKeys.length) {
    return new textToSpeech.TextToSpeechClient({
      projectId: process.env.GOOGLE_CLOUD_PROJECT_ID,
      credentials: {
        client_email: process.env.GOOGLE_CLOUD_CLIENT_EMAIL,
        private_key: process.env.GOOGLE_CLOUD_PRIVATE_KEY.replace(/\\n/g, "\n"),
      },
    });
  }
  return new textToSpeech.TextToSpeechClient();
};

const retryable = (error) => [4, 8, 10, 13, 14].includes(Number(error?.code)) || [429, 500, 502, 503, 504].includes(Number(error?.code));
const synthesize = async (client, request, maxAttempts = 3) => {
  let lastError;
  for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
    try {
      const [response] = await client.synthesizeSpeech(request);
      const bytes = Buffer.from(response.audioContent || []);
      if (!bytes.length) throw new Error("empty-provider-audio");
      return bytes;
    } catch (error) {
      lastError = error;
      if (!retryable(error) || attempt === maxAttempts) break;
      await new Promise((resolve) => setTimeout(resolve, 500 * attempt));
    }
  }
  const safe = retryable(lastError) ? "google-tts-transient-failure" : "google-tts-synthesis-failure";
  throw new Error(safe);
};

const verifyProviderVoices = async (client) => {
  const [response] = await client.listVoices({ languageCode: LOCALE });
  const available = new Set((response.voices || []).map(({ name }) => name));
  const required = Object.values(VOICE_ROLES).map(({ voiceName }) => voiceName);
  const missing = required.filter((voiceName) => !available.has(voiceName));
  if (missing.length) throw new Error(`google-voices-unavailable:${missing.join(",")}`);
  return required;
};

const recordIsCurrent = (record, catalogEntry, { root = ROOT } = {}) => {
  if (!record?.ready ||
    record.scriptHash !== catalogEntry.scriptHash ||
    record.scriptChecksum !== catalogEntry.scriptChecksum ||
    record.path !== catalogEntry.path) return false;
  const filename = publicFile(record, root);
  if (!fs.existsSync(filename)) return false;
  const stat = fs.statSync(filename);
  return stat.isFile() &&
    stat.size === record.byteSize &&
    /^[a-f0-9]{64}$/.test(record.sha256 || "") &&
    fileSha256(filename) === record.sha256 &&
    hasMp3Signature(filename);
};

const generateOne = async (client, entry) => {
  const temporaryDirectory = fs.mkdtempSync(path.join(os.tmpdir(), "german-b1-listening-"));
  try {
    const buffers = [];
    for (let index = 0; index < entry.audio.segments.length; index += 1) {
      const segment = entry.audio.segments[index];
      const profile = entry.voiceProfiles.find(({ speakerId }) => speakerId === segment.speakerId);
      buffers.push(await synthesize(client, {
        input: { text: generationText(entry, index) },
        voice: { languageCode: LOCALE, name: profile.voiceName },
        audioConfig: { audioEncoding: "LINEAR16", sampleRateHertz: SAMPLE_RATE_HZ },
      }));
    }
    const temporaryMp3 = path.join(temporaryDirectory, "track.mp3");
    encodeTrack(buffers, temporaryDirectory, temporaryMp3);
    const durationSeconds = probeDuration(temporaryMp3);
    if (!durationSeconds || !hasMp3Signature(temporaryMp3)) throw new Error("generated-media-invalid");
    const destination = publicFile(entry, ROOT);
    replaceValidatedFile(temporaryMp3, destination);
    const byteSize = fs.statSync(destination).size;
    return {
      ...entry,
      durationSeconds: Number(durationSeconds.toFixed(3)),
      sha256: fileSha256(destination),
      byteSize,
      ready: true,
      humanQa: "PENDING",
    };
  } finally {
    fs.rmSync(temporaryDirectory, { recursive: true, force: true });
  }
};

const selectedCatalog = (catalog, form) => {
  if (!form) return catalog;
  const suffix = form.match(/(\d{3})$/)?.[1];
  const selected = catalog.filter(({ formId }) => formId === form || formId.endsWith(suffix || "__none__"));
  if (!selected.length) throw new Error(`unknown-form:${form}`);
  return selected;
};

const main = async (argv = process.argv.slice(2)) => {
  const args = parseArgs(argv);
  const catalog = buildCatalog();
  const catalogErrors = validateCatalog(catalog);
  if (catalogErrors.length) throw new Error(`catalog-invalid:${catalogErrors.join(",")}`);
  const previous = readJson(MANIFEST_PATH, []);
  let manifest = createManifest(catalog, previous);
  const selected = selectedCatalog(catalog, args.form);
  const previousById = new Map(previous.map((entry) => [entry.audioId, entry]));
  const pending = selected.filter((entry) => args.force || !recordIsCurrent(previousById.get(entry.audioId), entry));
  const apiCalls = pending.reduce((sum, entry) => sum + entry.audio.segments.length, 0);

  process.stdout.write(`Listening production plan: ${pending.length} asset(s), ${apiCalls} bounded Google TTS call(s), ${selected.length} selected asset(s).\n`);

  if (args.plan) return { catalog, manifest, pending };
  if (args.syncManifest) {
    writeManifest(manifest);
    writeQaReport(manifest);
    process.stdout.write(`Synchronized ${manifest.length} pending/validated manifest records without generating audio.\n`);
    return { catalog, manifest, pending };
  }
  if (args.validate) {
    const result = validateManifest(previous, catalog);
    process.stdout.write(`${JSON.stringify(result, null, 2)}\n`);
    if (!result.productionReady) process.exitCode = 2;
    return result;
  }
  const prerequisiteBlockers = generationPrerequisiteBlockers();
  if (prerequisiteBlockers.length) throw new Error(`generation-prerequisites-missing:${prerequisiteBlockers.join(",")}`);
  const client = createClient();
  await verifyProviderVoices(client);

  for (const entry of pending) {
    const produced = await generateOne(client, entry);
    manifest = manifest.map((record) => record.audioId === produced.audioId ? produced : record);
    writeManifest(manifest);
    writeQaReport(manifest);
    process.stdout.write(`Generated ${produced.audioId}: ${produced.durationSeconds}s, ${produced.byteSize} bytes, sha256 ${produced.sha256.slice(0, 12)}…\n`);
  }

  const result = validateManifest(manifest, catalog);
  process.stdout.write(`Production readiness: ${result.readyCount}/24 assets ready.\n`);
  if (!result.productionReady) process.exitCode = 2;
  return result;
};

if (require.main === module) {
  main().catch((error) => {
    const safeMessage = String(error?.message || "generation-failed").replace(/[\r\n].*/s, "");
    process.stderr.write(`Listening audio generation stopped safely: ${safeMessage}\n`);
    process.exitCode = 1;
  });
}

module.exports = {
  parseArgs,
  commandAvailable,
  applicationDefaultCredentialPaths,
  applicationDefaultCredentialsAvailable,
  generationPrerequisiteBlockers,
  encodeTrack,
  createClient,
  retryable,
  recordIsCurrent,
  selectedCatalog,
  verifyProviderVoices,
  writeQaReport,
  main,
};
