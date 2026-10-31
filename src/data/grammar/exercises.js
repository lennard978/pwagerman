export const GRAMMAR_EXERCISE_TYPES = Object.freeze([
  "multiple-choice",
  "fill-blank",
  "sentence-ordering",
  "transformation",
  "error-correction",
  "matching",
  "connector-choice",
  "case-article-choice",
]);

const terminalPunctuation = /[.!?]+$/u;

export const normalizeGrammarAnswer = (value) => String(value ?? "")
  .normalize("NFKC")
  .trim()
  .replace(/\s+/gu, " ")
  .replace(/\s+([,;:])/gu, "$1")
  .replace(terminalPunctuation, "")
  .trim()
  .toLocaleLowerCase("de-DE");

const sameText = (candidate, answer) =>
  normalizeGrammarAnswer(candidate) === normalizeGrammarAnswer(answer);

export const gradeGrammarExercise = (exercise, response) => {
  if (!exercise) return false;
  if (["multiple-choice", "connector-choice", "case-article-choice"].includes(exercise.type)) {
    return response === exercise.answer;
  }
  if (exercise.type === "sentence-ordering") {
    return Array.isArray(response) &&
      response.length === exercise.answer.length &&
      response.every((tokenId, index) => tokenId === exercise.answer[index]);
  }
  if (exercise.type === "matching") {
    return response && typeof response === "object" &&
      Object.keys(exercise.answer).length === Object.keys(response).length &&
      Object.entries(exercise.answer).every(([leftId, rightId]) => response[leftId] === rightId);
  }
  const accepted = [exercise.answer, ...(exercise.acceptedAnswers || [])];
  return accepted.some((answer) => sameText(response, answer));
};

export const getGrammarCorrectAnswer = (exercise) => {
  if (!exercise) return "";
  if (["multiple-choice", "connector-choice", "case-article-choice"].includes(exercise.type)) {
    return exercise.options.find(({ id }) => id === exercise.answer)?.label || "";
  }
  if (exercise.type === "sentence-ordering") {
    const tokenById = new Map(exercise.tokens.map((token) => [token.id, token.label]));
    return exercise.answer.map((id) => tokenById.get(id)).join(" ");
  }
  if (exercise.type === "matching") return "Match each item with its corresponding meaning.";
  return exercise.answer;
};

const hashOffset = (value, length) =>
  [...value].reduce((total, char) => total + char.charCodeAt(0), 0) % length;

const makeOptions = (exerciseId, answer, distractors) => {
  const labels = [...new Set([answer, ...distractors])];
  const options = labels.map((label, index) => ({ id: `${exerciseId}-option-${index + 1}`, label }));
  const offset = hashOffset(exerciseId, options.length);
  return [...options.slice(offset), ...options.slice(0, offset)];
};

const makeChoice = (lessonId, suffix, type, config) => {
  const id = `${lessonId}-${suffix}`;
  const options = makeOptions(id, config.answer, config.distractors);
  return {
    id,
    type,
    prompt: config.prompt,
    options,
    answer: options.find(({ label }) => label === config.answer).id,
    explanation: config.explanation,
    skillTag: config.skillTag || "grammar-form",
  };
};

const makeText = (lessonId, suffix, type, config) => ({
  id: `${lessonId}-${suffix}`,
  type,
  prompt: config.prompt,
  answer: config.answer,
  acceptedAnswers: config.acceptedAnswers || [],
  explanation: config.explanation,
  skillTag: config.skillTag || "controlled-production",
});

const makeOrdering = (lessonId, sentence, explanation) => {
  const labels = sentence.split(/\s+/u);
  const answerTokens = labels.map((label, index) => ({
    id: `${lessonId}-order-token-${index + 1}`,
    label,
  }));
  const displayed = answerTokens.length > 2
    ? [...answerTokens.slice(2), ...answerTokens.slice(0, 2)]
    : [...answerTokens].reverse();
  return {
    id: `${lessonId}-sentence-ordering`,
    type: "sentence-ordering",
    prompt: "Build the sentence in the correct German word order.",
    tokens: displayed,
    answer: answerTokens.map(({ id }) => id),
    explanation,
    skillTag: "word-order",
  };
};

const makeMatching = (lessonId, examples) => {
  const pairs = examples.slice(2, 5).map((example, index) => ({
    id: `${lessonId}-match-${index + 1}`,
    left: example.german,
    rightId: `${lessonId}-meaning-${index + 1}`,
    right: example.english,
  }));
  return {
    id: `${lessonId}-matching`,
    type: "matching",
    prompt: "Match each German example with its meaning.",
    pairs: pairs.map(({ id, left }) => ({ id, label: left })),
    choices: [...pairs].reverse().map(({ rightId, right }) => ({ id: rightId, label: right })),
    answer: Object.fromEntries(pairs.map(({ id, rightId }) => [id, rightId])),
    explanation: "The translations preserve the grammar relationship shown in each example.",
    skillTag: "form-and-meaning",
  };
};

export const buildGrammarPractice = ({ lessonId, examples, commonMistakes, seed }) => [
  makeChoice(lessonId, "multiple-choice", "multiple-choice", seed.choice),
  makeText(lessonId, "fill-blank", "fill-blank", seed.fill),
  makeOrdering(lessonId, seed.order || examples[1].german, seed.orderExplanation || "Keep the conjugated verb and sentence elements in their required positions."),
  makeText(lessonId, "transformation", "transformation", seed.transform),
  makeText(lessonId, "error-correction", "error-correction", {
    prompt: `Correct the sentence: ${commonMistakes[0].wrong}`,
    answer: commonMistakes[0].correct,
    acceptedAnswers: [],
    explanation: commonMistakes[0].explanation,
    skillTag: "error-correction",
  }),
  makeMatching(lessonId, examples),
  makeChoice(lessonId, "connector-choice", "connector-choice", seed.connector),
  makeChoice(lessonId, "case-article-choice", "case-article-choice", seed.form),
];
