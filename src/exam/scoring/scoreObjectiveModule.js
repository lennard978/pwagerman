import { getExamResultDescriptor } from "../config/results";
import { getReadingResultScore } from "./readingScoreTable";

export const flattenReadingItems = (form) => form.parts.flatMap((part) =>
  part.items.map((item) => ({ ...item, partNumber: part.number }))
);

const recommendationMap = {
  rules: { title: "Rules and instructions", grammarRefs: ["de-b1-modal-verbs", "de-b1-passive-voice", "de-b1-two-way-local-temporal-prepositions"] },
  attitude: { title: "Opinions and attitude", grammarRefs: ["de-b1-cohesive-connectors", "de-b1-subordinate-clauses"] },
  opinion: { title: "Opinions and attitude", grammarRefs: ["de-b1-cohesive-connectors", "de-b1-subordinate-clauses"] },
  sequence: { title: "Sequence and chronology", grammarRefs: ["de-b1-temporal-clauses", "de-b1-perfekt"] },
  "cause-effect": { title: "Cause and result", grammarRefs: ["de-b1-subordinate-clauses", "de-b1-main-clause-connectors"] },
  advertisements: { title: "Practical advertisements", grammarRefs: ["de-b1-prepositional-verbs", "de-b1-adjective-endings"] },
};

export const scoreReadingForm = (form, answers = {}) => {
  const items = flattenReadingItems(form);
  const graded = items.map((item) => ({
    itemId: item.id,
    partNumber: item.partNumber,
    skillTags: item.skillTags,
    learnerAnswer: answers[item.id] ?? null,
    correctAnswer: item.correctAnswer,
    correct: answers[item.id] === item.correctAnswer,
  }));
  const rawScore = graded.filter(({ correct }) => correct).length;
  const resultScore = items.length === 30
    ? getReadingResultScore(rawScore)
    : Math.round((rawScore / Math.max(items.length, 1)) * 100);
  const partBreakdown = form.parts.map((part) => {
    const partItems = graded.filter(({ partNumber }) => partNumber === part.number);
    return { partNumber: part.number, score: partItems.filter(({ correct }) => correct).length, total: partItems.length };
  });
  const skillMap = {};
  graded.forEach((item) => item.skillTags.forEach((skill) => {
    const current = skillMap[skill] || { correct: 0, total: 0 };
    skillMap[skill] = { correct: current.correct + (item.correct ? 1 : 0), total: current.total + 1 };
  }));
  const skillPerformance = Object.fromEntries(Object.entries(skillMap).map(([skill, value]) => [skill, { ...value, percentage: Math.round((value.correct / value.total) * 100) }]));
  const rankedSkills = Object.entries(skillPerformance).sort((a, b) => b[1].percentage - a[1].percentage || b[1].total - a[1].total);
  const weakest = [...rankedSkills].reverse().find(([skill]) => recommendationMap[skill]);
  return {
    rawScore,
    total: items.length,
    resultScore,
    passed: resultScore >= 60,
    descriptor: getExamResultDescriptor(resultScore),
    partBreakdown,
    skillPerformance,
    strongestSkill: rankedSkills[0]?.[0] || null,
    needsReview: rankedSkills.at(-1)?.[0] || null,
    recommendation: weakest ? { skill: weakest[0], ...recommendationMap[weakest[0]] } : null,
    graded,
  };
};
