export const READINESS_CATEGORIES = Object.freeze(["Not started", "Building", "Developing", "Strong practice"]);

const objectiveReadiness = (moduleProgress = {}) => {
  const simulations = (moduleProgress.attemptHistory || []).filter(({ mode }) => mode === "simulation").slice(-3);
  const thresholdCount = simulations.filter(({ resultScore }) => resultScore >= 60).length;
  if (simulations.length >= 3 && thresholdCount >= 2) return { category: "Strong practice", detail: `${thresholdCount} of the latest ${simulations.length} simulations met 60.` };
  if (simulations.length) return { category: "Developing", detail: `${simulations.length} recent simulation${simulations.length === 1 ? "" : "s"}; repeated results are needed.` };
  if ((moduleProgress.practicePartsCompleted || []).length) return { category: "Building", detail: "Part practice started; no full simulation yet." };
  return { category: "Not started", detail: "No recorded practice yet." };
};

const productiveReadiness = (moduleProgress = {}, simulationField = "simulationsCompleted", practiceCount = 0) => {
  const attempts = (moduleProgress.attemptHistory || []).filter((item) => item.mode !== "practice");
  const assessed = attempts.filter((item) => {
    const values = Object.values(item.selfAssessment || {});
    return values.length && values.every(Number.isInteger);
  }).slice(-3);
  const averages = assessed.map((item) => {
    const values = Object.values(item.selfAssessment);
    return values.reduce((sum, value) => sum + value, 0) / values.length;
  });
  if (attempts.length >= 3 && averages.length >= 2 && averages.slice(-2).every((value) => value >= 2)) return { category: "Strong practice", detail: "At least three simulations with two recent complete self-assessments averaging 2 or more." };
  if ((moduleProgress[simulationField] || 0) > 0 || practiceCount >= 2) return { category: "Developing", detail: "Practice is established; continue simulations and self-review." };
  if (practiceCount > 0) return { category: "Building", detail: "Focused practice started." };
  return { category: "Not started", detail: "No recorded practice yet." };
};

export const getReadinessIndicators = (progress = {}) => {
  const vocabularyComplete = progress.completedLessons?.length || 0;
  const grammarComplete = progress.completedGrammarLessons?.length || 0;
  const writingPractice = Object.values(progress.writingProgress?.taskPracticesCompleted || {}).reduce((a, b) => a + b, 0);
  const speakingPractice = Object.values(progress.speakingProgress?.partPracticesCompleted || {}).reduce((a, b) => a + b, 0);
  const curriculum = (complete, developing, strong, label) => complete >= strong
    ? { category: "Strong practice", detail: `${complete} ${label} completed.` }
    : complete >= developing
      ? { category: "Developing", detail: `${complete} ${label} completed.` }
      : complete > 0
        ? { category: "Building", detail: `${complete} ${label} completed.` }
        : { category: "Not started", detail: `No ${label} completed yet.` };
  return {
    vocabulary: curriculum(vocabularyComplete, 10, 20, "vocabulary categories"),
    grammar: curriculum(grammarComplete, 8, 18, "grammar lessons"),
    reading: objectiveReadiness(progress.readingProgress),
    listening: objectiveReadiness(progress.listeningProgress),
    writing: productiveReadiness(progress.writingProgress, "simulationsCompleted", writingPractice),
    speaking: productiveReadiness(progress.speakingProgress, "soloSimulationsCompleted", speakingPractice + (progress.speakingProgress?.pairSimulationsCompleted || 0)),
  };
};
