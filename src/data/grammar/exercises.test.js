import { GERMAN_B1_GRAMMAR_LESSONS } from "./lessons";
import { gradeGrammarExercise, normalizeGrammarAnswer } from "./exercises";

test("the engine grades every supported type using stable answer data", () => {
  const practice = GERMAN_B1_GRAMMAR_LESSONS[0].practice;
  practice.forEach((exercise) => {
    expect(gradeGrammarExercise(exercise, exercise.answer)).toBe(true);
  });
  const matching = practice.find(({ type }) => type === "matching");
  expect(gradeGrammarExercise(matching, { ...matching.answer, extra: "wrong" })).toBe(false);
  const ordering = practice.find(({ type }) => type === "sentence-ordering");
  expect(gradeGrammarExercise(ordering, [...ordering.answer].reverse())).toBe(false);
});

test("normalization tolerates whitespace, terminal punctuation, and Unicode composition", () => {
  expect(normalizeGrammarAnswer("  Grüße   aus Köln!  ")).toBe("grüße aus köln");
  expect(normalizeGrammarAnswer("Gru\u0308ße.")).toBe("grüße");
  const exercise = { type: "fill-blank", answer: "Grüße aus Köln", acceptedAnswers: [] };
  expect(gradeGrammarExercise(exercise, "  Grüße   aus Köln. ")).toBe(true);
});

test("normalization preserves meaningful German grammar differences", () => {
  expect(normalizeGrammarAnswer("das")).not.toBe(normalizeGrammarAnswer("dass"));
  expect(normalizeGrammarAnswer("wurde")).not.toBe(normalizeGrammarAnswer("würde"));
  expect(normalizeGrammarAnswer("Gruß")).not.toBe(normalizeGrammarAnswer("Gruss"));
});
