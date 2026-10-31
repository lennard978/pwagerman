import {
  createExamPrepSession,
  ExamGrammarPool,
  ExamPrepAreas,
  ExamVocabularyPool,
  ListeningTasks,
  ReadingTasks,
} from "../../data/examPrep";
import { GrammarLessons } from "../../data/grammar";

test("exam prep data provides complete original reading and listening tasks", () => {
  expect(ExamPrepAreas.map(({ id, status }) => [id, status])).toEqual([
    ["reading", "available"],
    ["listening", "available"],
    ["vocabulary-grammar", "available"],
    ["mock-a1", "available"],
  ]);

  [ReadingTasks, ListeningTasks].forEach((tasks) => {
    expect(tasks).toHaveLength(4);
    expect(new Set(tasks.map(({ id }) => id)).size).toBe(tasks.length);
    tasks.forEach((task) => {
      expect(task.questions.length).toBeGreaterThanOrEqual(3);
      expect(task.questions.length).toBeLessThanOrEqual(5);
      expect(new Set(task.questions.map(({ id }) => id)).size).toBe(task.questions.length);
      task.questions.forEach((question) => {
        expect(question.options).toContain(question.answer);
        expect(new Set(question.options).size).toBe(question.options.length);
        expect(question.explanation).toBeTruthy();
      });
    });
  });

  ReadingTasks.forEach((task) => expect(task.text).toBeTruthy());
  ListeningTasks.forEach((task) => {
    expect(task.transcript).toBeTruthy();
    expect(task.translation).toBeTruthy();
  });
});
test("mixed review draws bounded deterministic questions from all course data", () => {
  expect(ExamVocabularyPool).toHaveLength(356);
  expect(new Set(ExamGrammarPool.map(({ lessonId }) => lessonId))).toEqual(
    new Set(GrammarLessons.map(({ id }) => id))
  );

  const first = createExamPrepSession({ seed: 7 });
  const second = createExamPrepSession({ seed: 7 });
  expect(second).toEqual(first);
  expect(first).toHaveLength(20);
  expect(first.filter(({ kind }) => kind === "vocabulary")).toHaveLength(10);
  expect(first.filter(({ kind }) => kind === "grammar")).toHaveLength(10);
  expect(new Set(first.map(({ id }) => id)).size).toBe(first.length);
  first.forEach((question) => {
    expect(question.options).toContain(question.answer);
    expect(question.explanation).toBeTruthy();
  });
  expect(first.some(({ id }) => id.includes("present-raditi-choice"))).toBe(true);
  expect(first.some(({ id }) => id.includes("negation-work-choice"))).toBe(true);
  expect(first.some(({ id }) => id.includes("question-place-choice"))).toBe(true);
  expect(first.some(({ id }) => id.includes("prepositions-school-choice"))).toBe(true);
});
