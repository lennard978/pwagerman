import { LISTENING_DEVELOPMENT_FIXTURE_MODE } from "./goetheB1Listening";
import { listeningAudioManifest } from "../listening/audioManifest";
import { getListeningProductionReadiness } from "../listening/manifestValidation";

export const MOCK_CONTENT_VERSION = "mock-v1";
export const MOCK_SCORING_VERSION = "b1-module-scoring-v1";
export const MOCK_MODULE_ORDER = Object.freeze(["reading", "listening", "writing", "speaking"]);
export const MOCK_MODULE_STATUSES = Object.freeze(["not-started", "in-progress", "completed", "abandoned"]);

export const GOETHE_B1_MOCK_CONFIG = Object.freeze({
  examId: "goethe-zertifikat-b1",
  level: "B1",
  title: "Full B1 Practice Mock",
  contentVersion: MOCK_CONTENT_VERSION,
  scoringVersion: MOCK_SCORING_VERSION,
  moduleOrder: MOCK_MODULE_ORDER,
  disclaimer: "Independent preparation tool. Not affiliated with or endorsed by the Goethe-Institut.",
});

export const getFullMockAvailability = ({
  manifest = listeningAudioManifest,
  nodeEnv = process.env.NODE_ENV,
  fixtureMode = LISTENING_DEVELOPMENT_FIXTURE_MODE,
  allowDevelopmentFixture = true,
} = {}) => {
  const productionReady = getListeningProductionReadiness(manifest).productionReady;
  const fixtureReady = nodeEnv !== "production" && allowDevelopmentFixture && fixtureMode && manifest.length > 0 &&
    manifest.every((entry) => entry.developmentFixture || (entry.assetStatus === "ready" && entry.assetChecksum));
  return {
    available: productionReady || fixtureReady,
    productionReady,
    developmentFixture: !productionReady && fixtureReady,
    reason: productionReady || fixtureReady ? null : "listening-audio-pending",
  };
};
