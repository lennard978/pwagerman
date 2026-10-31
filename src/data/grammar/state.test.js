import {
  completeGrammarLessonState,
  createGrammarLessonState,
  getGrammarProgressSummary,
  openGrammarLessonState,
  recordGrammarStateAnswer,
} from "./state";
import { GERMAN_B1_GRAMMAR_LESSONS } from "./lessons";

test("lesson state moves from not started to learning to completed", () => {
  const initial = createGrammarLessonState("de-b1-word-order-foundation");
  const opened = openGrammarLessonState(initial, new Date("2026-10-31T10:00:00Z"));
  const answered = recordGrammarStateAnswer(recordGrammarStateAnswer(opened, true), false);
  const completed = completeGrammarLessonState(answered, new Date("2026-10-31T11:00:00Z"));
  expect(opened).toEqual(expect.objectContaining({ status: "learning", lastOpenedAt: "2026-10-31T10:00:00.000Z" }));
  expect(answered).toEqual(expect.objectContaining({ correctCount: 1, incorrectCount: 1, masteryScore: 50 }));
  expect(completed).toEqual(expect.objectContaining({ status: "completed", completedAt: "2026-10-31T11:00:00.000Z" }));
});

test("summary reports bands, unresolved mistakes, and average mastery honestly", () => {
  const first = completeGrammarLessonState(recordGrammarStateAnswer(createGrammarLessonState(GERMAN_B1_GRAMMAR_LESSONS[0].id), true));
  const core = recordGrammarStateAnswer(createGrammarLessonState(GERMAN_B1_GRAMMAR_LESSONS[10].id), false);
  expect(getGrammarProgressSummary(GERMAN_B1_GRAMMAR_LESSONS, [first, core], [{ resolvedAt: null }, { resolvedAt: "done" }])).toEqual({
    started: 2,
    completed: 1,
    foundationCompleted: 1,
    coreCompleted: 0,
    unresolvedMistakes: 1,
    averageMastery: 50,
  });
});
