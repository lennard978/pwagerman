import {
  createLexemeState,
  isReviewDue,
  mergeLexemeState,
  normalizeLexemeState,
  recordLexemeAnswer,
} from "./lexemeState";

test("creates separate fresh German lexeme state", () => {
  expect(createLexemeState("de-b1-travel-transport-zug")).toEqual({
    id: "de-b1-travel-transport-zug",
    lexemeId: "de-b1-travel-transport-zug",
    status: "new",
    favorite: false,
    lastReviewedAt: null,
    nextReviewAt: null,
    correctCount: 0,
    incorrectCount: 0,
  });
});

test("normalizes Phase 1 IDs without reading Serbian state", () => {
  expect(normalizeLexemeState({ id: "de-b1-work-stelle", status: "known", favorite: true })).toMatchObject({
    lexemeId: "de-b1-work-stelle",
    status: "known",
    favorite: true,
  });
  expect(normalizeLexemeState({ id: "", status: "known" })).toBeNull();
});

test("records correct and incorrect review counters and due dates", () => {
  const now = new Date("2026-10-31T12:00:00.000Z");
  const learning = recordLexemeAnswer(createLexemeState("de-b1-test"), true, now);
  expect(learning).toMatchObject({ status: "learning", correctCount: 1, incorrectCount: 0 });
  expect(isReviewDue(learning, new Date("2026-11-03T12:00:00.000Z"))).toBe(true);
  const relearn = recordLexemeAnswer(createLexemeState("de-b1-test", { status: "known" }), false, now);
  expect(relearn).toMatchObject({ status: "learning", correctCount: 0, incorrectCount: 1 });
  expect(isReviewDue(relearn, now)).toBe(true);
});

test("merges state at runtime without changing static lexeme content", () => {
  const lexeme = Object.freeze({ id: "de-b1-test", source: "test", target: "Test" });
  const merged = mergeLexemeState(lexeme, [createLexemeState(lexeme.id, { status: "known", favorite: true })]);
  expect(merged).toMatchObject({ status: "known", favorite: true });
  expect(Object.prototype.hasOwnProperty.call(lexeme, "status")).toBe(false);
});
