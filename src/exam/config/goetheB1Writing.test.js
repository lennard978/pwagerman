import { GOETHE_B1_WRITING_CONFIG, WRITING_RUBRIC, WRITING_TASK_CONFIG } from "./goetheB1Writing";

test("Writing configuration models the three-task 60-minute structure without automatic grading", () => {
  expect(GOETHE_B1_WRITING_CONFIG).toEqual(expect.objectContaining({ durationSeconds: 3600, taskCount: 3, suggestedTotalWords: 200 }));
  expect(WRITING_TASK_CONFIG.map(({ taskType }) => taskType)).toEqual(["personal-email", "opinion-forum", "formal-email"]);
  expect(WRITING_TASK_CONFIG.map(({ approximateWordTarget }) => approximateWordTarget)).toEqual([80, 80, 40]);
  expect(WRITING_RUBRIC.map(({ id }) => id)).toEqual(["taskFulfilment", "coherence", "vocabulary", "grammar"]);
  expect(GOETHE_B1_WRITING_CONFIG).not.toHaveProperty("passThreshold");
});
