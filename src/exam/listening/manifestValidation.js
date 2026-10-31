export const EXPECTED_LISTENING_AUDIO_COUNT = 24;

export const validateListeningAudioManifest = (manifest) => {
  const errors = [];
  const productionEntries = manifest.filter(({ developmentFixture }) => !developmentFixture);
  if (productionEntries.length !== EXPECTED_LISTENING_AUDIO_COUNT) errors.push(`Expected ${EXPECTED_LISTENING_AUDIO_COUNT} production assets, received ${productionEntries.length}.`);
  if (new Set(productionEntries.map(({ audioId }) => audioId)).size !== productionEntries.length) errors.push("Production audio IDs must be unique.");

  const counts = [1, 2, 3, 4].map((part) => productionEntries.filter((entry) => entry.part === part).length);
  if (productionEntries.length && counts.join(",") !== "15,3,3,3") errors.push(`Invalid per-part production asset counts: ${counts.join(",")}.`);

  productionEntries.forEach((entry) => {
    if (entry.locale !== "de-DE" || entry.sourceType !== "generated-production") errors.push(`${entry.audioId} has invalid production source metadata.`);
    if (!entry.path?.startsWith(`/audio/listening/${entry.audioVersion}/form-`) || !entry.path?.endsWith(".mp3")) errors.push(`${entry.audioId} has an invalid production path.`);
    if (!/^[a-f0-9]{64}$/.test(entry.scriptHash || "") || !entry.scriptChecksum) errors.push(`${entry.audioId} has invalid script metadata.`);
    if (!entry.ready) return;
    if (entry.assetStatus !== "ready" || !/^[a-f0-9]{64}$/.test(entry.assetChecksum || "") || entry.assetChecksum !== entry.sha256) errors.push(`${entry.audioId} is ready without a matching checksum.`);
    if (!Number.isInteger(entry.byteSize) || entry.byteSize <= 0 || !Number.isFinite(entry.durationSeconds) || entry.durationSeconds <= 0) errors.push(`${entry.audioId} is ready without valid size and duration metadata.`);
  });

  const readyCount = productionEntries.filter(({ ready }) => ready).length;
  return {
    valid: errors.length === 0,
    productionReady: errors.length === 0 && readyCount === EXPECTED_LISTENING_AUDIO_COUNT,
    readyCount,
    totalCount: productionEntries.length,
    errors,
  };
};

export const getListeningProductionReadiness = validateListeningAudioManifest;
