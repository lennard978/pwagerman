import { LISTENING_AUDIO_VERSION } from "../config/goetheB1Listening";
import { listeningForms } from "../data/listeningForms";
import productionAudioManifest from "./productionAudioManifest.json";

export const LISTENING_AUDIO_CACHE_NAME = `german-b1-listening-${LISTENING_AUDIO_VERSION}`;
export const LISTENING_AUDIO_CACHE_PREFIX = "german-b1-listening-";
export const LISTENING_AUDIO_CACHE_MAX_ENTRIES = 24;

const productionById = new Map(productionAudioManifest.map((entry) => [entry.audioId, entry]));

export const listeningAudioManifest = Object.freeze(
  listeningForms.flatMap((form) => form.parts.flatMap((part) => part.audio.map((audio) => {
    const production = productionById.get(audio.id);
    const scriptMatches = production?.scriptChecksum === audio.scriptChecksum;
    const productionReady = Boolean(production?.ready && scriptMatches);
    return Object.freeze({
      audioId: audio.id,
      formId: form.id,
      part: part.number,
      track: production?.track || 1,
      sourceType: audio.developmentFixture ? audio.sourceType : production?.sourceType || "generated-production",
      path: audio.developmentFixture ? audio.assetPath : production?.path || audio.assetPath,
      assetStatus: audio.developmentFixture ? audio.assetStatus : productionReady ? "ready" : scriptMatches ? "pending-generation" : "stale-script",
      ready: audio.developmentFixture ? audio.assetStatus === "ready" : productionReady,
      durationSeconds: productionReady ? production.durationSeconds : audio.durationSeconds,
      locale: audio.locale,
      speakerIds: audio.speakers.map(({ id }) => id),
      voiceProfiles: production?.voiceProfiles || [],
      scriptHash: production?.scriptHash || null,
      scriptChecksum: audio.scriptChecksum,
      assetChecksum: audio.developmentFixture ? audio.assetChecksum : productionReady ? production.sha256 : null,
      sha256: productionReady ? production.sha256 : null,
      byteSize: productionReady ? production.byteSize : null,
      developmentFixture: audio.developmentFixture,
      contentVersion: audio.contentVersion,
      audioVersion: audio.audioVersion,
    });
  })))
);

export const getListeningAudioManifestEntry = (audioId) =>
  listeningAudioManifest.find((entry) => entry.audioId === audioId) || null;

export const resolveListeningAudioUrl = (entry) => `${process.env.PUBLIC_URL}${entry.path}`;
