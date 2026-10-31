const path = require("node:path");

const LOCALE = "de-DE";
const AUDIO_VERSION = "audio-v1";
const CONTENT_VERSION = "listening-v1";
const SAMPLE_RATE_HZ = 24000;
const MP3_BITRATE = "64k";
const TURN_PAUSE_SECONDS = 0.28;

const VOICE_ROLES = Object.freeze({
  narratorFemale: Object.freeze({ locale: LOCALE, voiceName: "de-DE-Chirp3-HD-Aoede" }),
  narratorMale: Object.freeze({ locale: LOCALE, voiceName: "de-DE-Chirp3-HD-Puck" }),
  femaleA: Object.freeze({ locale: LOCALE, voiceName: "de-DE-Chirp3-HD-Kore" }),
  femaleB: Object.freeze({ locale: LOCALE, voiceName: "de-DE-Chirp3-HD-Leda" }),
  maleA: Object.freeze({ locale: LOCALE, voiceName: "de-DE-Chirp3-HD-Charon" }),
  maleB: Object.freeze({ locale: LOCALE, voiceName: "de-DE-Chirp3-HD-Orus" }),
});

const PROFILE_TO_ROLE = Object.freeze({
  "voice-female-1": "femaleA",
  "voice-female-2": "femaleB",
  "voice-male-1": "maleA",
  "voice-male-2": "maleB",
});

// Generation-only replacements belong here when literal synthesis of a number,
// date, or abbreviation is unclear. Keys use "audioId:segmentIndex". The
// semantic content must remain identical to the learner-visible transcript.
const SPOKEN_TEXT_OVERRIDES = Object.freeze({});

const ROOT = path.resolve(__dirname, "..", "..");

module.exports = Object.freeze({
  ROOT,
  LOCALE,
  AUDIO_VERSION,
  CONTENT_VERSION,
  SAMPLE_RATE_HZ,
  MP3_BITRATE,
  TURN_PAUSE_SECONDS,
  VOICE_ROLES,
  PROFILE_TO_ROLE,
  SPOKEN_TEXT_OVERRIDES,
  PUBLIC_AUDIO_DIR: path.join(ROOT, "public", "audio", "listening", AUDIO_VERSION),
  MANIFEST_PATH: path.join(ROOT, "src", "exam", "listening", "productionAudioManifest.json"),
  QA_REPORT_PATH: path.join(ROOT, "docs", "GERMAN-B1-LISTENING-AUDIO-QA.md"),
});
