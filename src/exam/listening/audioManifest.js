import { LISTENING_AUDIO_VERSION } from "../config/goetheB1Listening";
import { listeningForms } from "../data/listeningForms";

export const LISTENING_AUDIO_CACHE_NAME = `german-b1-listening-${LISTENING_AUDIO_VERSION}`;
export const LISTENING_AUDIO_CACHE_PREFIX = "german-b1-listening-";
export const LISTENING_AUDIO_CACHE_MAX_ENTRIES = 24;

export const listeningAudioManifest = Object.freeze(
  listeningForms.flatMap((form) => form.parts.flatMap((part) => part.audio.map((audio) => Object.freeze({
    audioId: audio.id,
    formId: form.id,
    part: part.number,
    sourceType: audio.sourceType,
    path: audio.assetPath,
    assetStatus: audio.assetStatus,
    durationSeconds: audio.durationSeconds,
    locale: audio.locale,
    speakerIds: audio.speakers.map(({ id }) => id),
    scriptChecksum: audio.scriptChecksum,
    assetChecksum: audio.assetChecksum,
    developmentFixture: audio.developmentFixture,
    contentVersion: audio.contentVersion,
    audioVersion: audio.audioVersion,
  }))))
);

export const getListeningAudioManifestEntry = (audioId) =>
  listeningAudioManifest.find((entry) => entry.audioId === audioId) || null;

export const resolveListeningAudioUrl = (entry) => `${process.env.PUBLIC_URL}${entry.path}`;
