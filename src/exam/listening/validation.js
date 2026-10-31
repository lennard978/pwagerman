import { LISTENING_PART_CONFIG } from "../config/goetheB1Listening";
import { listeningAudioManifest } from "./audioManifest";

const BAD_CONTENT = /\b(todo|tbd|lorem|placeholder)\b|[čćšđž]|\b(tačno|netačno|pitanje|odgovor)\b/i;

export const validateListeningForms = (forms, manifest = listeningAudioManifest) => {
  const errors = [];
  const audioBlockers = [];
  const formIds = new Set();
  const itemIds = new Set();
  const audioIds = new Set();
  const prompts = new Set();
  const manifestById = new Map(manifest.map((entry) => [entry.audioId, entry]));

  if (forms.length !== 3) errors.push(`Expected 3 forms, received ${forms.length}.`);

  forms.forEach((form) => {
    if (formIds.has(form.id)) errors.push(`Duplicate form id: ${form.id}.`);
    formIds.add(form.id);
    if (form.module !== "listening" || form.level !== "B1" || form.durationSeconds !== 2400) errors.push(`${form.id} has invalid metadata.`);
    if (form.parts.length !== 4) errors.push(`${form.id} must contain four parts.`);

    LISTENING_PART_CONFIG.forEach((expected, index) => {
      const part = form.parts[index];
      if (!part) return;
      if (part.number !== expected.number || part.type !== expected.type || part.items.length !== expected.itemCount || part.audio.length !== expected.recordingCount || part.playbackLimit !== expected.playbackLimit || part.preparationSeconds !== expected.preparationSeconds) {
        errors.push(`${form.id} part ${expected.number} does not match the configured architecture.`);
      }
      if (part.number === 1) {
        part.audio.forEach((audio) => {
          if (part.items.filter(({ audioRef }) => audioRef === audio.id).length !== 2) errors.push(`${audio.id} must have two questions.`);
        });
      }

      part.audio.forEach((audio) => {
        if (audioIds.has(audio.id)) errors.push(`Duplicate audio id: ${audio.id}.`);
        audioIds.add(audio.id);
        const speakerIds = new Set(audio.speakers.map(({ id }) => id));
        if (!audio.segments.length || audio.segments.some(({ speakerId, text }) => !speakerIds.has(speakerId) || !text.trim())) errors.push(`${audio.id} has an invalid structured transcript.`);
        if (audio.playbackLimit !== expected.playbackLimit) errors.push(`${audio.id} has the wrong playback rule.`);
        const entry = manifestById.get(audio.id);
        if (!entry || entry.scriptChecksum !== audio.scriptChecksum || entry.audioVersion !== form.audioVersion) errors.push(`${audio.id} is missing a matching manifest entry.`);
        if (!entry || entry.assetStatus !== "ready" || !entry.assetChecksum) audioBlockers.push(audio.id);
      });

      const partAudioIds = new Set(part.audio.map(({ id }) => id));
      part.items.forEach((item) => {
        if (itemIds.has(item.id)) errors.push(`Duplicate item id: ${item.id}.`);
        itemIds.add(item.id);
        if (prompts.has(item.prompt)) errors.push(`Duplicate prompt: ${item.prompt}.`);
        prompts.add(item.prompt);
        if (!partAudioIds.has(item.audioRef)) errors.push(`${item.id} references unknown audio.`);
        const optionIds = item.options.map(({ id }) => id);
        if (new Set(optionIds).size !== optionIds.length || !optionIds.includes(item.correctAnswer)) errors.push(`${item.id} has invalid options.`);
        if (!item.explanation || !item.evidence || !item.skillTags?.length) errors.push(`${item.id} lacks review metadata.`);
        if (part.number === 4 && optionIds.some((id) => !part.audio[0].speakers.some((speaker) => speaker.id === id))) errors.push(`${item.id} has invalid attribution options.`);
      });
    });

    if (form.parts.flatMap(({ items }) => items).length !== 30) errors.push(`${form.id} must contain 30 scored items.`);
    if (BAD_CONTENT.test(JSON.stringify(form))) errors.push(`${form.id} contains placeholder or Serbian content.`);
  });

  return {
    valid: errors.length === 0,
    audioReady: audioBlockers.length === 0,
    errors,
    audioBlockers: [...new Set(audioBlockers)],
    itemCount: itemIds.size,
    audioCount: audioIds.size,
  };
};
