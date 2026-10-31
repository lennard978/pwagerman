import { gradeGrammarExercise } from "./exercises";
import { FOUNDATION_GRAMMAR_LESSONS } from "./lessons";

export const FOUNDATION_DIAGNOSTIC_QUESTIONS = Object.freeze(
  FOUNDATION_GRAMMAR_LESSONS.flatMap((lesson) => [lesson.practice[0], lesson.practice[6]].map((exercise, index) => ({
    ...exercise,
    id: `diagnostic-${lesson.id}-${index + 1}`,
    grammarLessonId: lesson.id,
  })))
);

export const scoreFoundationDiagnostic = (responses = {}) => {
  const breakdown = FOUNDATION_GRAMMAR_LESSONS.map((lesson) => {
    const questions = FOUNDATION_DIAGNOSTIC_QUESTIONS.filter(({ grammarLessonId }) => grammarLessonId === lesson.id);
    const correct = questions.filter((question) => gradeGrammarExercise(question, responses[question.id])).length;
    return {
      grammarLessonId: lesson.id,
      title: lesson.title,
      correct,
      total: questions.length,
      recommendation: correct === questions.length ? "strong" : "review-recommended",
    };
  });
  return {
    correct: breakdown.reduce((total, item) => total + item.correct, 0),
    total: FOUNDATION_DIAGNOSTIC_QUESTIONS.length,
    breakdown,
  };
};
