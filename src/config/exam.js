export const B1_EXAM_CONFIG = Object.freeze({
  reference: "Goethe-Zertifikat B1",
  reading: Object.freeze({
    durationMinutes: 65,
    parts: 5,
    scoring: Object.freeze({ maximumPoints: 100, passThreshold: 60, mode: "objective" }),
  }),
  listening: Object.freeze({
    durationMinutes: 40,
    parts: 4,
    itemCount: 30,
    scoring: Object.freeze({ maximumPoints: 100, passThreshold: 60, mode: "objective" }),
  }),
  writing: Object.freeze({
    durationMinutes: 60,
    parts: 3,
    scoring: Object.freeze({ mode: "module-specific" }),
  }),
  speaking: Object.freeze({
    pairDurationMinutes: 15,
    preparationMinutes: 15,
    parts: 3,
    scoring: Object.freeze({ mode: "module-specific" }),
  }),
});

export const EXAM_MODULE_IDS = Object.freeze([
  "reading",
  "listening",
  "writing",
  "speaking",
]);
