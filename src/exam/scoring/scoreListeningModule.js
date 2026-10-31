import { getObjective30ResultScore } from "./objectiveScoreTable";
import { scoreObjectiveForm } from "./scoreObjectiveModule";

export const listeningRecommendationMap = Object.freeze({
  "speaker-intent": { title: "Speaker intent", grammarRefs: ["de-b1-modal-verbs", "de-b1-indirect-questions"], vocabularyCategoryIds: ["media-communication"] },
  discussion: { title: "Discussion and opinion", grammarRefs: ["de-b1-cohesive-connectors", "de-b1-konjunktiv-ii"], vocabularyCategoryIds: ["feelings-opinions", "functional-exam-phrases"] },
  opinion: { title: "Discussion and opinion", grammarRefs: ["de-b1-cohesive-connectors", "de-b1-subordinate-clauses"], vocabularyCategoryIds: ["feelings-opinions"] },
  announcement: { title: "Announcements and practical details", grammarRefs: ["de-b1-temporal-clauses", "de-b1-two-way-local-temporal-prepositions"], vocabularyCategoryIds: ["travel-transport", "city-services"] },
  "number-time": { title: "Numbers and time", grammarRefs: ["de-b1-temporal-clauses", "de-b1-two-way-local-temporal-prepositions"], vocabularyCategoryIds: ["plans-goals-time"] },
  sequence: { title: "Sequence", grammarRefs: ["de-b1-temporal-clauses", "de-b1-main-clause-connectors"], vocabularyCategoryIds: ["connectors-prepositions"] },
});

export const scoreListeningForm = (form, answers = {}) =>
  scoreObjectiveForm(form, answers, {
    recommendationMap: listeningRecommendationMap,
    resultScoreForRaw: getObjective30ResultScore,
  });
