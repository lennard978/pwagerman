import { getObjective30ResultScore } from "./objectiveScoreTable";
import { scoreObjectiveForm } from "./scoreObjectiveModule";

export const listeningRecommendationMap = Object.freeze({
  "speaker-intent": { title: "Speaker intent", grammarRefs: ["de-b1-modal-verbs", "de-b1-indirect-questions"] },
  discussion: { title: "Discussion and opinion", grammarRefs: ["de-b1-cohesive-connectors", "de-b1-konjunktiv-ii"] },
  opinion: { title: "Discussion and opinion", grammarRefs: ["de-b1-cohesive-connectors", "de-b1-subordinate-clauses"] },
  announcement: { title: "Announcements and practical details", grammarRefs: ["de-b1-temporal-clauses", "de-b1-two-way-local-temporal-prepositions"] },
  "number-time": { title: "Numbers and time", grammarRefs: ["de-b1-temporal-clauses", "de-b1-two-way-local-temporal-prepositions"] },
  sequence: { title: "Sequence", grammarRefs: ["de-b1-temporal-clauses", "de-b1-main-clause-connectors"] },
});

export const scoreListeningForm = (form, answers = {}) =>
  scoreObjectiveForm(form, answers, {
    recommendationMap: listeningRecommendationMap,
    resultScoreForRaw: getObjective30ResultScore,
  });
