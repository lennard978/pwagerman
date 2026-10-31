import {
  LISTENING_AUDIO_VERSION,
  LISTENING_CONTENT_VERSION,
  LISTENING_DEVELOPMENT_FIXTURE_MODE,
} from "../config/goetheB1Listening";

export const trueFalseOptions = Object.freeze([
  { id: "true", label: "Richtig" },
  { id: "false", label: "Falsch" },
]);

export const choiceOptions = (...labels) => labels.map((label, index) => ({ id: String.fromCharCode(97 + index), label }));

const scriptChecksum = (segments) => {
  const text = segments.map(({ speakerId, text: segmentText }) => `${speakerId}:${segmentText}`).join("|");
  let hash = 2166136261;
  for (let index = 0; index < text.length; index += 1) {
    hash ^= text.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return `fnv1a-${(hash >>> 0).toString(16).padStart(8, "0")}`;
};

export const makeListeningAudio = ({
  id,
  formId,
  partNumber,
  title,
  durationSeconds,
  playbackLimit,
  speakers,
  segments,
  sourceType = "generated",
  assetPath = LISTENING_DEVELOPMENT_FIXTURE_MODE
    ? `/audio/listening/${LISTENING_AUDIO_VERSION}/development-fixture.wav`
    : `/audio/listening/${LISTENING_AUDIO_VERSION}/${id}.mp3`,
  assetStatus = LISTENING_DEVELOPMENT_FIXTURE_MODE ? "ready" : "pending-generation",
  assetChecksum = LISTENING_DEVELOPMENT_FIXTURE_MODE ? "development-fixture-silence-v1" : null,
}) => ({
  id,
  scriptId: `${id}-script`,
  formId,
  partNumber,
  title,
  sourceType,
  assetPath,
  assetStatus,
  assetChecksum,
  developmentFixture: LISTENING_DEVELOPMENT_FIXTURE_MODE,
  durationSeconds,
  locale: "de-DE",
  playbackLimit,
  speakers,
  segments,
  scriptChecksum: scriptChecksum(segments),
  contentVersion: LISTENING_CONTENT_VERSION,
  audioVersion: LISTENING_AUDIO_VERSION,
});

export const makeListeningItem = ({ id, number, type, prompt, options, correctAnswer, explanation, evidence, audioRef, skillTags }) => ({
  id,
  number,
  type,
  prompt,
  options,
  correctAnswer: String(correctAnswer),
  explanation,
  evidence,
  audioRef,
  skillTags,
});

export const makeListeningPart = ({ formId, number, title, type, preparationSeconds, playbackLimit, instructions, audio, items }) => ({
  id: `${formId}-part-${number}`,
  number,
  title,
  type,
  preparationSeconds,
  playbackLimit,
  instructions,
  audio,
  items,
});

export const makeListeningForm = (id, title, parts) => ({
  id,
  title,
  module: "listening",
  level: "B1",
  formatReference: "goethe-b1",
  durationSeconds: 2400,
  contentVersion: LISTENING_CONTENT_VERSION,
  audioVersion: LISTENING_AUDIO_VERSION,
  sourceType: "original-curated",
  parts,
});
