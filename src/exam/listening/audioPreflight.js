import { listeningAudioManifest, resolveListeningAudioUrl } from "./audioManifest";
import { getCachedListeningAudioUrl, resolveListeningAudioSource } from "./audioCache";

const loadMetadata = (url, audioFactory, timeoutMs) => new Promise((resolve) => {
  const audio = audioFactory();
  let settled = false;
  const finish = (ok, reason = null) => {
    if (settled) return;
    settled = true;
    clearTimeout(timer);
    audio.removeAttribute?.("src");
    resolve({ ok, reason });
  };
  const timer = setTimeout(() => finish(false, "metadata-timeout"), timeoutMs);
  audio.preload = "metadata";
  audio.addEventListener("loadedmetadata", () => finish(Number.isFinite(audio.duration) && audio.duration > 0, "invalid-duration"), { once: true });
  audio.addEventListener("error", () => finish(false, "decode-error"), { once: true });
  audio.src = url;
  audio.load();
});

export const preflightListeningAudio = async (form, {
  fetchImpl = window.fetch.bind(window),
  audioFactory = () => new Audio(),
  timeoutMs = 8000,
  online = navigator.onLine,
  manifest = listeningAudioManifest,
  cacheResolver = getCachedListeningAudioUrl,
  onProgress = () => {},
} = {}) => {
  const requiredIds = new Set(form.parts.flatMap(({ audio }) => audio.map(({ id }) => id)));
  const entries = manifest.filter(({ audioId }) => requiredIds.has(audioId));
  const errors = [];
  const verifiedUrls = new Map();
  let completed = 0;
  const reportProgress = (entry) => {
    completed += 1;
    onProgress({ completed, total: entries.length, audioId: entry.audioId });
  };

  requiredIds.forEach((audioId) => {
    if (!entries.some((entry) => entry.audioId === audioId)) errors.push({ audioId, reason: "manifest-entry-missing" });
  });

  for (const entry of entries) {
    if (entry.assetStatus !== "ready" || !entry.assetChecksum) {
      errors.push({ audioId: entry.audioId, reason: "asset-pending" });
      reportProgress(entry);
      continue;
    }
    if (!entry.developmentFixture && (!entry.ready || !entry.scriptHash || !entry.sha256 || !entry.byteSize || !entry.durationSeconds)) {
      errors.push({ audioId: entry.audioId, reason: "manifest-metadata-invalid" });
      reportProgress(entry);
      continue;
    }
    const url = resolveListeningAudioUrl(entry);
    if (verifiedUrls.get(url) === true) { reportProgress(entry); continue; }
    const playable = await resolveListeningAudioSource(entry, { online, cacheResolver });
    if (!playable) {
      errors.push({ audioId: entry.audioId, reason: "offline-uncached" });
      reportProgress(entry);
      continue;
    }
    if (playable.source === "network") {
      try {
        const response = await fetchImpl(url, { method: "HEAD", cache: "no-store" });
        if (!response.ok) { errors.push({ audioId: entry.audioId, reason: "missing-asset" }); reportProgress(entry); continue; }
      } catch (error) {
        errors.push({ audioId: entry.audioId, reason: "network-error" });
        reportProgress(entry);
        continue;
      }
    }
    try {
      const metadata = await loadMetadata(playable.url, audioFactory, timeoutMs);
      if (!metadata.ok) errors.push({ audioId: entry.audioId, reason: playable.source === "network" ? metadata.reason : "offline-uncached" });
      else verifiedUrls.set(url, true);
    } catch (error) {
      errors.push({ audioId: entry.audioId, reason: playable.source === "network" ? "decode-error" : "offline-uncached" });
    } finally {
      playable.revoke();
    }
    reportProgress(entry);
  }
  return { ready: entries.length > 0 && errors.length === 0, entries, errors };
};
