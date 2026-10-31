export const WRITING_CONTENT_VERSION = "writing-v1";
export const WRITING_RUBRIC_VERSION = "b1-writing-v1";

export const GOETHE_B1_WRITING_CONFIG = Object.freeze({
  module: "writing",
  level: "B1",
  durationSeconds: 3600,
  taskCount: 3,
  suggestedTotalWords: 200,
  contentVersion: WRITING_CONTENT_VERSION,
  rubricVersion: WRITING_RUBRIC_VERSION,
  alignment: "Writing practice aligned with the Goethe-Zertifikat B1 exam format.",
  disclaimer: "Independent preparation tool. Not affiliated with or endorsed by the Goethe-Institut.",
});

export const WRITING_TASK_CONFIG = Object.freeze([
  Object.freeze({ number: 1, taskType: "personal-email", title: "Personal email", approximateWordTarget: 80, suggestedMinutes: 20 }),
  Object.freeze({ number: 2, taskType: "opinion-forum", title: "Opinion contribution", approximateWordTarget: 80, suggestedMinutes: 25 }),
  Object.freeze({ number: 3, taskType: "formal-email", title: "Short formal email", approximateWordTarget: 40, suggestedMinutes: 15 }),
]);

export const WRITING_SKILL_TAGS = Object.freeze([
  "personal-email", "formal-email", "opinion", "register", "task-fulfilment",
  "coherence", "connectors", "reasons", "examples", "request", "apology",
  "planning", "formal-register", "informal-register",
]);

export const WRITING_RUBRIC = Object.freeze([
  Object.freeze({ id: "taskFulfilment", label: "Task fulfilment", description: "I addressed the requested points, purpose, and register." }),
  Object.freeze({ id: "coherence", label: "Coherence / organisation", description: "My ideas follow a clear order and use helpful connections." }),
  Object.freeze({ id: "vocabulary", label: "Vocabulary", description: "My vocabulary fits the situation and avoids unnecessary repetition." }),
  Object.freeze({ id: "grammar", label: "Grammar / structures", description: "My structures communicate reliably with appropriate B1 variety." }),
]);

export const WRITING_RUBRIC_SCALE = Object.freeze([
  Object.freeze({ value: 3, label: "Strong" }),
  Object.freeze({ value: 2, label: "Mostly successful" }),
  Object.freeze({ value: 1, label: "Needs improvement" }),
  Object.freeze({ value: 0, label: "Task not achieved" }),
]);
