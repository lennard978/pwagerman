import { listeningForms } from "./listeningForms";
import { listeningAudioManifest } from "../listening/audioManifest";
import { validateListeningForms } from "../listening/validation";

describe("German B1 Listening forms", () => {
  test("contain three structurally valid complete and unique forms", () => {
    const validation = validateListeningForms(listeningForms);
    expect(validation.errors).toEqual([]);
    expect(validation.valid).toBe(true);
    expect(validation.itemCount).toBe(90);
    expect(validation.audioCount).toBe(24);
  });

  test.each(listeningForms)("$id has the exact recording and item distribution", (form) => {
    expect(form.parts.map(({ audio, items }) => [audio.length, items.length])).toEqual([[5, 10], [1, 5], [1, 7], [1, 8]]);
    expect(form.parts.map(({ playbackLimit }) => playbackLimit)).toEqual([2, 1, 1, 2]);
    expect(form.parts.flatMap(({ items }) => items)).toHaveLength(30);
    expect(form.parts[0].audio.every((audio) => form.parts[0].items.filter(({ audioRef }) => audioRef === audio.id).length === 2)).toBe(true);
  });

  test("unlocks simulations when all reviewed versioned audio exists", () => {
    const validation = validateListeningForms(listeningForms);
    expect(listeningAudioManifest).toHaveLength(24);
    expect(validation.audioReady).toBe(true);
    expect(validation.audioBlockers).toHaveLength(0);
    expect(listeningAudioManifest.every(({ assetStatus, assetChecksum }) => assetStatus === "ready" && /^[a-f0-9]{64}$/.test(assetChecksum))).toBe(true);
  });
});
