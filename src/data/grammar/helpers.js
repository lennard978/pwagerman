import { buildGrammarPractice } from "./exercises";

export const grammarRule = (title, explanation, pattern, options = {}) => ({
  title,
  explanation,
  pattern,
  notes: options.notes || [],
  table: options.table || null,
});

export const grammarExample = (german, english, note = null) => ({ german, english, note });

export const grammarMistake = (wrong, correct, explanation) => ({
  wrong,
  correct,
  explanation,
});

export const grammarSeed = ({ choice, fill, transform, connector, form, order, orderExplanation }) => ({
  choice: {
    prompt: choice[0],
    answer: choice[1],
    distractors: choice[2],
    explanation: choice[3],
  },
  fill: {
    prompt: fill[0],
    answer: fill[1],
    acceptedAnswers: fill[2] || [],
    explanation: fill[3],
  },
  transform: {
    prompt: transform[0],
    answer: transform[1],
    acceptedAnswers: transform[2] || [],
    explanation: transform[3],
  },
  connector: {
    prompt: connector[0],
    answer: connector[1],
    distractors: connector[2],
    explanation: connector[3],
  },
  form: {
    prompt: form[0],
    answer: form[1],
    distractors: form[2],
    explanation: form[3],
  },
  order,
  orderExplanation,
});

export const createGrammarLesson = (config) => {
  const lesson = {
    id: config.id,
    slug: config.slug,
    title: config.title,
    level: "B1",
    stage: config.stage,
    categoryId: config.categoryId,
    shortDescription: config.shortDescription,
    explanation: config.explanation,
    rules: config.rules.map((rule, index) => ({
      id: `${config.id}-rule-${index + 1}`,
      ...rule,
    })),
    examples: config.examples.map((example, index) => ({
      id: `${config.id}-example-${index + 1}`,
      ...example,
    })),
    commonMistakes: config.commonMistakes.map((mistake, index) => ({
      id: `${config.id}-mistake-${index + 1}`,
      ...mistake,
    })),
    prerequisites: config.prerequisites || [],
    examSkills: config.examSkills,
    sourceType: "original-curated",
  };
  return Object.freeze({
    ...lesson,
    practice: Object.freeze(buildGrammarPractice({
      lessonId: lesson.id,
      examples: lesson.examples,
      commonMistakes: lesson.commonMistakes,
      seed: config.seed,
    })),
  });
};
