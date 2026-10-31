export const GRAMMAR_LESSON_STATUSES = Object.freeze(["not-started", "learning", "completed"]);

export const createGrammarLessonState = (grammarLessonId, overrides = {}) => ({
  grammarLessonId,
  status: GRAMMAR_LESSON_STATUSES.includes(overrides.status) ? overrides.status : "not-started",
  lastOpenedAt: overrides.lastOpenedAt || null,
  completedAt: overrides.completedAt || null,
  correctCount: Number.isFinite(overrides.correctCount) ? overrides.correctCount : 0,
  incorrectCount: Number.isFinite(overrides.incorrectCount) ? overrides.incorrectCount : 0,
  masteryScore: Number.isFinite(overrides.masteryScore) ? Math.max(0, Math.min(100, overrides.masteryScore)) : 0,
});

const mastery = (correctCount, incorrectCount) => {
  const total = correctCount + incorrectCount;
  return total === 0 ? 0 : Math.round((correctCount / total) * 100);
};

export const openGrammarLessonState = (state, at = new Date()) => ({
  ...createGrammarLessonState(state.grammarLessonId, state),
  status: state.status === "completed" ? "completed" : "learning",
  lastOpenedAt: at.toISOString(),
});

export const recordGrammarStateAnswer = (state, correct) => {
  const current = createGrammarLessonState(state.grammarLessonId, state);
  const correctCount = current.correctCount + (correct ? 1 : 0);
  const incorrectCount = current.incorrectCount + (correct ? 0 : 1);
  return {
    ...current,
    status: current.status === "completed" ? "completed" : "learning",
    correctCount,
    incorrectCount,
    masteryScore: mastery(correctCount, incorrectCount),
  };
};

export const completeGrammarLessonState = (state, at = new Date()) => ({
  ...createGrammarLessonState(state.grammarLessonId, state),
  status: "completed",
  completedAt: at.toISOString(),
});

export const normalizeGrammarLessonStates = (states) => Array.isArray(states)
  ? states
    .filter((state) => typeof state?.grammarLessonId === "string" && state.grammarLessonId)
    .map((state) => createGrammarLessonState(state.grammarLessonId, state))
  : [];

export const getGrammarState = (states, grammarLessonId) =>
  createGrammarLessonState(
    grammarLessonId,
    states.find((state) => state.grammarLessonId === grammarLessonId) || {}
  );

export const getGrammarProgressSummary = (lessons, states, mistakes = []) => {
  const merged = lessons.map((lesson) => ({ lesson, state: getGrammarState(states, lesson.id) }));
  const stage = (stageId) => merged.filter(({ lesson }) => lesson.stage === stageId);
  const foundation = stage("foundation-review");
  const core = stage("b1-core");
  const answered = merged.filter(({ state }) => state.correctCount + state.incorrectCount > 0);
  return {
    started: merged.filter(({ state }) => state.status !== "not-started").length,
    completed: merged.filter(({ state }) => state.status === "completed").length,
    foundationCompleted: foundation.filter(({ state }) => state.status === "completed").length,
    coreCompleted: core.filter(({ state }) => state.status === "completed").length,
    unresolvedMistakes: mistakes.filter((mistake) => !mistake.resolvedAt).length,
    averageMastery: answered.length
      ? Math.round(answered.reduce((total, { state }) => total + state.masteryScore, 0) / answered.length)
      : 0,
  };
};
