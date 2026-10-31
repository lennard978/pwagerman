export const READING_CONTENT_VERSION = "reading-1";
export const READING_SCORING_VERSION = "goethe-b1-reading-1";

export const READING_PART_CONFIG = Object.freeze([
  { number: 1, type: "true-false", itemCount: 6, recommendedSeconds: 600, title: "Personal text" },
  { number: 2, type: "multiple-choice", itemCount: 6, recommendedSeconds: 1200, title: "Press and information" },
  { number: 3, type: "matching", itemCount: 7, recommendedSeconds: 600, title: "Situations and advertisements" },
  { number: 4, type: "binary-position", itemCount: 7, recommendedSeconds: 900, title: "Opinions" },
  { number: 5, type: "multiple-choice", itemCount: 4, recommendedSeconds: 600, title: "Rules and instructions" },
]);

export const GOETHE_B1_READING_CONFIG = Object.freeze({
  module: "reading",
  level: "B1",
  formatReference: "goethe-b1",
  durationSeconds: 3900,
  parts: READING_PART_CONFIG,
  totalItems: 30,
  passResultScore: 60,
  disclaimer: "Independent preparation tool. Not affiliated with or endorsed by the Goethe-Institut.",
});
