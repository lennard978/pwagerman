import {
  GRAMMAR_CATEGORY_IDS,
  GRAMMAR_EXAM_SKILLS,
  GRAMMAR_STAGE_IDS,
} from "./categories";
import { GRAMMAR_EXERCISE_TYPES } from "./exercises";

const text = (value) => typeof value === "string" && value.trim().length > 0;
const idPattern = /^de-b1-[a-z0-9]+(?:-[a-z0-9]+)*$/u;

const validateExercise = (exercise) => {
  const errors = [];
  if (!text(exercise?.id)) errors.push("exercise id is required");
  if (!GRAMMAR_EXERCISE_TYPES.includes(exercise?.type)) errors.push("exercise type is invalid");
  if (!text(exercise?.prompt)) errors.push("exercise prompt is required");
  if (!text(exercise?.explanation)) errors.push("exercise explanation is required");
  if (!text(exercise?.skillTag)) errors.push("exercise skillTag is required");
  if (["multiple-choice", "connector-choice", "case-article-choice"].includes(exercise?.type)) {
    if (!Array.isArray(exercise.options) || exercise.options.length < 2) errors.push("choice exercise options are required");
    if (!exercise.options?.some(({ id }) => id === exercise.answer)) errors.push("choice answer must reference an option ID");
  } else if (exercise?.type === "sentence-ordering") {
    if (!Array.isArray(exercise.tokens) || !Array.isArray(exercise.answer)) errors.push("ordering tokens and answer are required");
    const ids = new Set((exercise.tokens || []).map(({ id }) => id));
    if (!(exercise.answer || []).every((id) => ids.has(id))) errors.push("ordering answer must reference token IDs");
  } else if (exercise?.type === "matching") {
    if (!Array.isArray(exercise.pairs) || !Array.isArray(exercise.choices)) errors.push("matching pairs and choices are required");
    const choiceIds = new Set((exercise.choices || []).map(({ id }) => id));
    if (!exercise.answer || !Object.values(exercise.answer).every((id) => choiceIds.has(id))) errors.push("matching answers must reference choice IDs");
  } else {
    if (!text(exercise?.answer)) errors.push("text exercise answer is required");
    if (exercise.acceptedAnswers && !Array.isArray(exercise.acceptedAnswers)) errors.push("acceptedAnswers must be an array");
  }
  return errors;
};

export const validateGrammarLesson = (lesson) => {
  const errors = [];
  ["id", "slug", "title", "level", "stage", "categoryId", "shortDescription", "explanation", "sourceType"].forEach((field) => {
    if (!text(lesson?.[field])) errors.push(`${field} is required`);
  });
  if (!idPattern.test(lesson?.id || "")) errors.push("lesson id must be a stable German B1 slug");
  if (lesson?.level !== "B1") errors.push("level must be B1");
  if (!GRAMMAR_STAGE_IDS.includes(lesson?.stage)) errors.push("stage is invalid");
  if (!GRAMMAR_CATEGORY_IDS.includes(lesson?.categoryId)) errors.push("categoryId is invalid");
  if (lesson?.sourceType !== "original-curated") errors.push("sourceType must be original-curated");
  if (!Array.isArray(lesson?.rules) || lesson.rules.length < 2 || lesson.rules.length > 5) errors.push("lessons require 2–5 rules");
  if (!Array.isArray(lesson?.examples) || lesson.examples.length < 6 || lesson.examples.length > 10) errors.push("lessons require 6–10 examples");
  lesson?.examples?.forEach((example) => {
    if (!text(example.id) || !text(example.german) || !text(example.english)) errors.push("each example requires id, German, and English");
  });
  if (!Array.isArray(lesson?.commonMistakes) || lesson.commonMistakes.length < 2 || lesson.commonMistakes.length > 4) errors.push("lessons require 2–4 mistakes");
  if (!Array.isArray(lesson?.practice) || lesson.practice.length < 8 || lesson.practice.length > 12) errors.push("lessons require 8–12 exercises");
  lesson?.practice?.forEach((exercise) => validateExercise(exercise).forEach((error) => errors.push(`${exercise.id}: ${error}`)));
  if (!Array.isArray(lesson?.prerequisites)) errors.push("prerequisites must be an array");
  if (!Array.isArray(lesson?.examSkills) || lesson.examSkills.length === 0 || !lesson.examSkills.every((skill) => GRAMMAR_EXAM_SKILLS.includes(skill))) errors.push("examSkills are invalid");
  if (JSON.stringify(lesson).match(/TODO|TBD|PLACEHOLDER/iu)) errors.push("lesson contains an unresolved placeholder");
  ["status", "masteryScore", "correctCount", "incorrectCount"].forEach((field) => {
    if (Object.prototype.hasOwnProperty.call(lesson || {}, field)) errors.push(`static lesson must not contain ${field}`);
  });
  return errors;
};

export const validateGrammarCurriculum = (lessons) => {
  const errors = [];
  if (!Array.isArray(lessons) || lessons.length !== 24) errors.push("curriculum must contain exactly 24 lessons");
  const lessonIds = new Set();
  const exerciseIds = new Set();
  (lessons || []).forEach((lesson) => {
    validateGrammarLesson(lesson).forEach((error) => errors.push(`${lesson?.id}: ${error}`));
    if (lessonIds.has(lesson.id)) errors.push(`${lesson.id}: duplicate lesson id`);
    lessonIds.add(lesson.id);
    lesson.practice.forEach((exercise) => {
      if (exerciseIds.has(exercise.id)) errors.push(`${exercise.id}: duplicate exercise id`);
      exerciseIds.add(exercise.id);
    });
  });
  (lessons || []).forEach((lesson) => lesson.prerequisites.forEach((id) => {
    if (!lessonIds.has(id)) errors.push(`${lesson.id}: unknown prerequisite ${id}`);
  }));
  const foundationCount = (lessons || []).filter(({ stage }) => stage === "foundation-review").length;
  const coreCount = (lessons || []).filter(({ stage }) => stage === "b1-core").length;
  if (foundationCount !== 10 || coreCount !== 14) errors.push("curriculum must contain 10 Foundation Review and 14 B1 Core lessons");
  return errors;
};
