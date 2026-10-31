export const GRAMMAR_STAGES = Object.freeze([
  {
    id: "foundation-review",
    title: "Foundation Review",
    description: "Reinforce high-value A2 structures before moving through the B1 progression.",
  },
  {
    id: "b1-core",
    title: "B1 Core",
    description: "Build the structures needed for connected B1 reading, listening, writing, and speaking.",
  },
]);

export const GRAMMAR_CATEGORIES = Object.freeze([
  { id: "sentence-structure", title: "Sentence structure" },
  { id: "cases-articles", title: "Cases and articles" },
  { id: "pronouns", title: "Pronouns" },
  { id: "verb-forms", title: "Verb forms" },
  { id: "tenses", title: "Tenses" },
  { id: "prepositions", title: "Prepositions" },
  { id: "adjective-forms", title: "Adjective forms" },
  { id: "connectors", title: "Connectors and cohesion" },
  { id: "relative-clauses", title: "Relative clauses" },
  { id: "passive-mood", title: "Passive and mood" },
  { id: "writing-cohesion", title: "B1 writing cohesion" },
]);

export const GRAMMAR_STAGE_IDS = Object.freeze(GRAMMAR_STAGES.map(({ id }) => id));
export const GRAMMAR_CATEGORY_IDS = Object.freeze(GRAMMAR_CATEGORIES.map(({ id }) => id));
export const GRAMMAR_EXAM_SKILLS = Object.freeze(["reading", "listening", "writing", "speaking"]);

export const getGrammarStage = (stageId) =>
  GRAMMAR_STAGES.find(({ id }) => id === stageId);
