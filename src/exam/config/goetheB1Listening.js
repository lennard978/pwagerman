export const LISTENING_CONTENT_VERSION = "listening-v1";
export const LISTENING_AUDIO_VERSION = "audio-v1";
export const LISTENING_SCORING_VERSION = "goethe-b1-listening-1";
export const LISTENING_DEVELOPMENT_FIXTURE_MODE =
  process.env.NODE_ENV !== "production" && process.env.REACT_APP_LISTENING_FIXTURE_MODE === "true";

export const LISTENING_PART_CONFIG = Object.freeze([
  { number: 1, title: "Five short recordings", type: "mixed-shorts", recordingCount: 5, itemCount: 10, playbackLimit: 2, preparationSeconds: 10 },
  { number: 2, title: "Information text", type: "multiple-choice", recordingCount: 1, itemCount: 5, playbackLimit: 1, preparationSeconds: 60 },
  { number: 3, title: "Conversation", type: "true-false", recordingCount: 1, itemCount: 7, playbackLimit: 1, preparationSeconds: 60 },
  { number: 4, title: "Three-speaker discussion", type: "speaker-attribution", recordingCount: 1, itemCount: 8, playbackLimit: 2, preparationSeconds: 60 },
]);

export const GOETHE_B1_LISTENING_CONFIG = Object.freeze({
  module: "listening",
  level: "B1",
  formatReference: "goethe-b1",
  durationSeconds: 2400,
  totalItems: 30,
  totalParts: 4,
  passResultScore: 60,
  parts: LISTENING_PART_CONFIG,
  finalReviewModel: "Digital answers remain editable until submission; no separate paper-transfer phase is added.",
  disclaimer: "Independent preparation tool. Not affiliated with or endorsed by the Goethe-Institut.",
});
