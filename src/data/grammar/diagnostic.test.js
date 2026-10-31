import { FOUNDATION_DIAGNOSTIC_QUESTIONS, scoreFoundationDiagnostic } from "./diagnostic";
import { FOUNDATION_GRAMMAR_LESSONS } from "./lessons";

test("diagnostic has exactly two questions for each of ten Foundation lessons", () => {
  expect(FOUNDATION_DIAGNOSTIC_QUESTIONS).toHaveLength(20);
  FOUNDATION_GRAMMAR_LESSONS.forEach((lesson) => {
    expect(FOUNDATION_DIAGNOSTIC_QUESTIONS.filter(({ grammarLessonId }) => grammarLessonId === lesson.id)).toHaveLength(2);
  });
});

test("diagnostic reports Strong only when both lesson questions are correct", () => {
  const allCorrect = Object.fromEntries(FOUNDATION_DIAGNOSTIC_QUESTIONS.map(({ id, answer }) => [id, answer]));
  expect(scoreFoundationDiagnostic(allCorrect)).toEqual(expect.objectContaining({ correct: 20, total: 20 }));
  expect(scoreFoundationDiagnostic(allCorrect).breakdown.every(({ recommendation }) => recommendation === "strong")).toBe(true);
  const firstQuestionRemoved = { ...allCorrect };
  delete firstQuestionRemoved[FOUNDATION_DIAGNOSTIC_QUESTIONS[0].id];
  expect(scoreFoundationDiagnostic(firstQuestionRemoved).breakdown[0].recommendation).toBe("review-recommended");
});
