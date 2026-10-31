import { GERMAN_B1_LEXEMES } from "../vocabulary/lexemes";
import {
  B1_CORE_GRAMMAR_LESSONS,
  FOUNDATION_GRAMMAR_LESSONS,
  GERMAN_B1_GRAMMAR_LESSONS,
} from "./lessons";
import { GRAMMAR_EXERCISE_TYPES } from "./exercises";
import { validateGrammarCurriculum } from "./schema";

test("the production curriculum has exactly 10 Foundation Review and 14 B1 Core lessons", () => {
  expect(GERMAN_B1_GRAMMAR_LESSONS).toHaveLength(24);
  expect(FOUNDATION_GRAMMAR_LESSONS).toHaveLength(10);
  expect(B1_CORE_GRAMMAR_LESSONS).toHaveLength(14);
  expect(validateGrammarCurriculum(GERMAN_B1_GRAMMAR_LESSONS)).toEqual([]);
});

test("every lesson meets the content contract and static content contains no learner state", () => {
  const serialized = JSON.stringify(GERMAN_B1_GRAMMAR_LESSONS);
  GERMAN_B1_GRAMMAR_LESSONS.forEach((lesson) => {
    expect(lesson.rules.length).toBeGreaterThanOrEqual(2);
    expect(lesson.rules.length).toBeLessThanOrEqual(5);
    expect(lesson.examples.length).toBeGreaterThanOrEqual(6);
    expect(lesson.examples.length).toBeLessThanOrEqual(10);
    expect(lesson.commonMistakes.length).toBeGreaterThanOrEqual(2);
    expect(lesson.commonMistakes.length).toBeLessThanOrEqual(4);
    expect(lesson.practice.length).toBeGreaterThanOrEqual(8);
    expect(lesson.practice.length).toBeLessThanOrEqual(12);
    expect(lesson.sourceType).toBe("original-curated");
    expect(lesson.examSkills.length).toBeGreaterThan(0);
    expect(lesson).not.toHaveProperty("status");
    expect(lesson).not.toHaveProperty("masteryScore");
  });
  expect(GERMAN_B1_GRAMMAR_LESSONS.flatMap(({ examples }) => examples)).toHaveLength(144);
  expect(GERMAN_B1_GRAMMAR_LESSONS.flatMap(({ practice }) => practice)).toHaveLength(192);
  expect(serialized).not.toMatch(/TODO|TBD|PLACEHOLDER/);
  expect(serialized).not.toMatch(/sr-RS|Srpski|Serbian A1/);
});

test("the reusable practice collection covers all eight exercise types with unique IDs", () => {
  const exercises = GERMAN_B1_GRAMMAR_LESSONS.flatMap(({ practice }) => practice);
  expect(new Set(exercises.map(({ id }) => id)).size).toBe(exercises.length);
  expect(new Set(exercises.map(({ type }) => type))).toEqual(new Set(GRAMMAR_EXERCISE_TYPES));
});

test("prerequisites and vocabulary grammar references resolve to production lessons", () => {
  const lessonIds = new Set(GERMAN_B1_GRAMMAR_LESSONS.map(({ id }) => id));
  GERMAN_B1_GRAMMAR_LESSONS.forEach(({ prerequisites }) => prerequisites.forEach((id) => expect(lessonIds.has(id)).toBe(true)));
  GERMAN_B1_LEXEMES.flatMap(({ grammarRefs }) => grammarRefs).forEach((id) => expect(lessonIds.has(id)).toBe(true));
  expect(GERMAN_B1_LEXEMES.filter(({ grammarRefs }) => grammarRefs.length > 0).length).toBeGreaterThanOrEqual(6);
});
