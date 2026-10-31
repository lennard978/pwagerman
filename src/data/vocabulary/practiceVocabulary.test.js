import { GERMAN_B1_LEXEMES } from "./lexemes";
import { formatLexemeTarget } from "./presentation";
import { isCorrectLexemePair } from "../../screen/pair/Pair";
import { createQuizRound } from "../../screen/quiz/Quiz";
import { createSpellingAnswer, createSpellingTokens } from "../../screen/write/Write";
import { createReviewSession, REVIEW_SESSION_LIMIT } from "../../screen/review/Review";

test("Pair matches stable IDs rather than duplicate English glosses", () => {
  expect(isCorrectLexemePair({ id: "one", source: "bill" }, { id: "two", source: "bill" })).toBe(false);
  expect(isCorrectLexemePair({ id: "one", source: "bill" }, { id: "one", source: "invoice" })).toBe(true);
});

test("Spelling preserves umlauts, ß, spaces, hyphens, and duplicate-letter identity", () => {
  const tokens = createSpellingTokens("größer werden-test");
  expect(tokens.map((token) => token.char).join("")).toBe("größer werden-test");
  expect(tokens.filter((token) => token.char === "r").map((token) => token.id)).toEqual(expect.arrayContaining(["r-1", "r-5", "r-9"]));
  expect(tokens.find((token) => token.char === " ").type).toBe("fixed");
  expect(tokens.find((token) => token.char === "-").type).toBe("fixed");
  expect(createSpellingAnswer("E-Mail").filter(Boolean).map((token) => token.char)).toEqual(["-"]);
});

test("Cards expose noun articles through the learner target", () => {
  const termin = GERMAN_B1_LEXEMES.find((lexeme) => lexeme.lemma === "Termin");
  expect(formatLexemeTarget(termin)).toBe("der Termin");
});

test("Quiz choices have stable IDs and duplicate-free targets", () => {
  const items = GERMAN_B1_LEXEMES.slice(0, 30);
  const round = createQuizRound(items);
  round.forEach((question) => {
    expect(question.choices.some((choice) => choice.id === question.id)).toBe(true);
    expect(new Set(question.choices.map((choice) => choice.id)).size).toBe(question.choices.length);
    expect(new Set(question.choices.map((choice) => choice.target)).size).toBe(question.choices.length);
    expect(question.choices).toHaveLength(4);
  });
});

test("Quiz prioritizes same-part-of-speech and same-category distractors", () => {
  const items = GERMAN_B1_LEXEMES.filter(({ categoryId }) => categoryId === "health-body");
  const round = createQuizRound(items);
  round.forEach((question) => {
    const choiceLexemes = question.choices
      .filter(({ id }) => id !== question.id)
      .map(({ id }) => items.find((item) => item.id === id));
    expect(choiceLexemes.every(({ categoryId }) => categoryId === question.categoryId)).toBe(true);
    expect(choiceLexemes.some(({ partOfSpeech }) => partOfSpeech === question.partOfSpeech)).toBe(true);
  });
});

test("Review uses bounded rotating sessions for large collections", () => {
  const first = createReviewSession(GERMAN_B1_LEXEMES, 0);
  const second = createReviewSession(GERMAN_B1_LEXEMES, REVIEW_SESSION_LIMIT);
  expect(first).toHaveLength(20);
  expect(second).toHaveLength(20);
  expect(new Set([...first, ...second].map(({ id }) => id)).size).toBe(40);
});
