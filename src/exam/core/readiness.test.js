import { getReadinessIndicators } from "./readiness";

const base = () => ({
  completedLessons: [], completedGrammarLessons: [],
  readingProgress: { attemptHistory: [], practicePartsCompleted: [] },
  listeningProgress: { attemptHistory: [], practicePartsCompleted: [] },
  writingProgress: { attemptHistory: [], simulationsCompleted: 0, taskPracticesCompleted: { 1: 0, 2: 0, 3: 0 } },
  speakingProgress: { attemptHistory: [], soloSimulationsCompleted: 0, pairSimulationsCompleted: 0, partPracticesCompleted: { 1: 0, 2: 0, 3: 0 } },
});

test("readiness starts conservatively", () => {
  expect(Object.values(getReadinessIndicators(base())).every(({ category }) => category === "Not started")).toBe(true);
});

test("one lucky objective result is not Strong practice", () => {
  const progress = base();
  progress.readingProgress.attemptHistory = [{ mode: "simulation", resultScore: 100 }];
  expect(getReadinessIndicators(progress).reading.category).toBe("Developing");
});

test("repeated objective thresholds and productive trends can become Strong practice", () => {
  const progress = base();
  progress.readingProgress.attemptHistory = [55, 67, 72].map((resultScore) => ({ mode: "simulation", resultScore }));
  const assessment = { taskFulfilment: 2, coherence: 2, vocabulary: 2, grammar: 2 };
  progress.writingProgress.simulationsCompleted = 3;
  progress.writingProgress.attemptHistory = [1, 2, 3].map((id) => ({ id, mode: "simulation", selfAssessment: assessment }));
  const indicators = getReadinessIndicators(progress);
  expect(indicators.reading.category).toBe("Strong practice");
  expect(indicators.writing.category).toBe("Strong practice");
});
