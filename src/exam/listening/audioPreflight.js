import { listeningAudioManifest, resolveListeningAudioUrl } from "./audioManifest";

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
} = {}) => {
  const requiredIds = new Set(form.parts.flatMap(({ audio }) => audio.map(({ id }) => id)));
  const entries = manifest.filter(({ audioId }) => requiredIds.has(audioId));
  const errors = [];
  const verifiedUrls = new Map();

  requiredIds.forEach((audioId) => {
    if (!entries.some((entry) => entry.audioId === audioId)) errors.push({ audioId, reason: "manifest-entry-missing" });
  });

  for (const entry of entries) {
    if (entry.assetStatus !== "ready" || !entry.assetChecksum) {
      errors.push({ audioId: entry.audioId, reason: "asset-pending" });
      continue;
    }
    const url = resolveListeningAudioUrl(entry);
    if (verifiedUrls.get(url) === true) continue;
    if (online) {
      try {
        const response = await fetchImpl(url, { method: "HEAD", cache: "no-store" });
        if (!response.ok) { errors.push({ audioId: entry.audioId, reason: "missing-asset" }); continue; }
      } catch (error) {
        errors.push({ audioId: entry.audioId, reason: "network-error" });
        continue;
      }
    }
    try {
      const metadata = await loadMetadata(url, audioFactory, timeoutMs);
      if (!metadata.ok) errors.push({ audioId: entry.audioId, reason: online ? metadata.reason : "offline-uncached" });
      else verifiedUrls.set(url, true);
    } catch (error) {
      errors.push({ audioId: entry.audioId, reason: online ? "decode-error" : "offline-uncached" });
    }
  }
  return { ready: entries.length > 0 && errors.length === 0, entries, errors };
};
