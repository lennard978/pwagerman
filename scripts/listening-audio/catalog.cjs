const crypto = require("node:crypto");
const {
  ROOT,
  LOCALE,
  AUDIO_VERSION,
  CONTENT_VERSION,
  VOICE_ROLES,
  PROFILE_TO_ROLE,
  SPOKEN_TEXT_OVERRIDES,
} = require("./config.cjs");
const { loadListeningForms } = require("./sourceLoader.cjs");

const normalizeText = (value) => value.normalize("NFKC").replace(/\s+/g, " ").trim();
const normalizedScript = (segments) => segments.map(({ speakerId, text }) => `${speakerId}:${normalizeText(text)}`).join("\n");
const sha256 = (value) => crypto.createHash("sha256").update(value).digest("hex");
const scriptHash = (segments) => sha256(normalizedScript(segments));

const formFolder = (formId) => {
  const match = formId.match(/(\d{3})$/);
  if (!match) throw new Error(`invalid-form-id:${formId}`);
  return `form-${match[1]}`;
};

const assetFileName = (part, track) => part === 1
  ? `part-1-track-${String(track).padStart(2, "0")}.mp3`
  : `part-${part}.mp3`;

const assetPath = ({ formId, part, track }) =>
  `/audio/listening/${AUDIO_VERSION}/${formFolder(formId)}/${assetFileName(part, track)}`;

const voiceProfilesFor = (audio) => audio.speakers.map((speaker) => {
  const role = PROFILE_TO_ROLE[speaker.voiceProfile];
  const voice = VOICE_ROLES[role];
  return {
    speakerId: speaker.id,
    label: speaker.label,
    profileId: speaker.voiceProfile,
    role,
    voiceName: voice?.voiceName || null,
    locale: voice?.locale || null,
  };
});

const buildCatalog = (forms = loadListeningForms(ROOT)) => forms.flatMap((form) =>
  form.parts.flatMap((part) => part.audio.map((audio, index) => ({
    audio,
    audioId: audio.id,
    formId: form.id,
    part: part.number,
    track: index + 1,
    path: assetPath({ formId: form.id, part: part.number, track: index + 1 }),
    locale: LOCALE,
    sourceType: "generated-production",
    voiceProfiles: voiceProfilesFor(audio),
    contentVersion: CONTENT_VERSION,
    audioVersion: AUDIO_VERSION,
    scriptHash: scriptHash(audio.segments),
    scriptChecksum: audio.scriptChecksum,
  })))
);

const createManifest = (catalog, previous = []) => {
  const previousById = new Map(previous.map((entry) => [entry.audioId, entry]));
  return catalog.map((entry) => {
    const old = previousById.get(entry.audioId);
    const unchanged = old && old.scriptHash === entry.scriptHash && old.scriptChecksum === entry.scriptChecksum && old.audioVersion === entry.audioVersion;
    return {
      audioId: entry.audioId,
      formId: entry.formId,
      part: entry.part,
      track: entry.track,
      path: entry.path,
      locale: entry.locale,
      sourceType: entry.sourceType,
      voiceProfiles: entry.voiceProfiles,
      durationSeconds: unchanged ? old.durationSeconds ?? null : null,
      sha256: unchanged ? old.sha256 ?? null : null,
      byteSize: unchanged ? old.byteSize ?? null : null,
      contentVersion: entry.contentVersion,
      audioVersion: entry.audioVersion,
      scriptHash: entry.scriptHash,
      scriptChecksum: entry.scriptChecksum,
      ready: Boolean(unchanged && old.ready),
      humanQa: "PENDING",
    };
  });
};

const generationText = (entry, segmentIndex) =>
  SPOKEN_TEXT_OVERRIDES[`${entry.audioId}:${segmentIndex}`] || entry.audio.segments[segmentIndex].text;

const validateVoiceConfig = (catalog) => {
  const errors = [];
  Object.entries(VOICE_ROLES).forEach(([role, voice]) => {
    if (voice.locale !== LOCALE || !voice.voiceName.startsWith(`${LOCALE}-Chirp3-HD-`)) errors.push(`invalid-voice:${role}`);
  });
  catalog.forEach((entry) => entry.voiceProfiles.forEach((profile) => {
    if (!profile.role || !profile.voiceName || profile.locale !== LOCALE) errors.push(`invalid-speaker-profile:${entry.audioId}:${profile.speakerId}`);
  }));
  return [...new Set(errors)];
};

const validateCatalog = (catalog) => {
  const errors = [];
  if (catalog.length !== 24) errors.push(`asset-count:${catalog.length}`);
  const ids = new Set(catalog.map(({ audioId }) => audioId));
  if (ids.size !== catalog.length) errors.push("duplicate-audio-id");
  const counts = [1, 2, 3, 4].map((part) => catalog.filter((entry) => entry.part === part).length);
  if (counts.join(",") !== "15,3,3,3") errors.push(`part-counts:${counts.join(",")}`);
  catalog.filter(({ part }) => part === 3).forEach((entry) => {
    if (new Set(entry.voiceProfiles.map(({ voiceName }) => voiceName)).size < 2) errors.push(`part-3-voices:${entry.audioId}`);
  });
  catalog.filter(({ part }) => part === 4).forEach((entry) => {
    if (new Set(entry.voiceProfiles.map(({ voiceName }) => voiceName)).size < 3) errors.push(`part-4-voices:${entry.audioId}`);
  });
  return [...errors, ...validateVoiceConfig(catalog)];
};

module.exports = {
  normalizeText,
  normalizedScript,
  sha256,
  scriptHash,
  assetPath,
  buildCatalog,
  createManifest,
  generationText,
  validateVoiceConfig,
  validateCatalog,
};
