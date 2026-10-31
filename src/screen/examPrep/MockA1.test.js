import { ExamVocabularyPool } from "../../data/examPrep";
import { GrammarLessons } from "../../data/grammar";
import {
  createMockA1,
  MockGrammarQuestions,
  scoreMockA1,
} from "../../data/mockA1";

test("Mock A1 has forty deterministic questions and complete section coverage", () => {
  const mock = createMockA1(0);
  const sameMock = createMockA1(0);
  const nextMock = createMockA1(1);
  expect(sameMock).toEqual(mock);
  expect(mock.sections.map(({ id, questions }) => [id, questions.length])).toEqual([
    ["reading", 10],
    ["listening", 10],
    ["vocabulary", 10],
    ["grammar", 10],
  ]);

  const questions = mock.sections.flatMap(({ questions: items }) => items);
  expect(questions).toHaveLength(40);
  expect(new Set(questions.map(({ id }) => id)).size).toBe(40);
  questions.forEach((question) => {
    expect(question.options).toContain(question.answer);
    expect(new Set(question.options).size).toBe(question.options.length);
    expect(question.explanation).toBeTruthy();
  });

  const reading = mock.sections[0].questions;
  expect(new Set(reading.map(({ stimulusId }) => stimulusId)).size).toBe(4);
  expect(reading.some(({ type }) => type === "true-false")).toBe(true);

  const listening = mock.sections[1].questions;
  expect(new Set(listening.map(({ transcript }) => transcript)).size).toBe(4);
  listening.forEach((question) => expect(question.transcript).toBeTruthy());

  const vocabularyIds = new Set(ExamVocabularyPool.map(({ id }) => id));
  mock.sections[2].questions.forEach((question) => {
    expect(vocabularyIds.has(question.sourceId)).toBe(true);
  });
  expect(new Set(mock.sections[2].questions.map(({ sourceId }) => sourceId)).size)
    .toBe(10);
  expect(new Set(mock.sections[2].questions.map(({ vocabularyDirection }) =>
    vocabularyDirection
  ))).toEqual(new Set(["english-serbian", "serbian-english", "context"]));

  expect(new Set(MockGrammarQuestions.flatMap(({ lessonIds }) => lessonIds))).toEqual(
    new Set(GrammarLessons.map(({ id }) => id))
  );
  expect(nextMock.sections[0].questions.map(({ id }) => id))
    .not.toEqual(mock.sections[0].questions.map(({ id }) => id));
  expect(nextMock.sections[2].questions.map(({ sourceId }) => sourceId))
    .not.toEqual(mock.sections[2].questions.map(({ sourceId }) => sourceId));
});
test("randomized mock selections remain valid and duplicate-free", () => {
  Array.from({ length: 100 }, (_, seed) => createMockA1(seed)).forEach((mock) => {
    const questions = mock.sections.flatMap(({ questions: items }) => items);
    expect(new Set(questions.map(({ id }) => id)).size).toBe(40);
    questions.forEach((question) => {
      expect(question.options).toContain(question.answer);
      expect(new Set(question.options).size).toBe(question.options.length);
    });
    const vocabulary = mock.sections.find(({ id }) => id === "vocabulary").questions;
    expect(new Set(vocabulary.map(({ sourceId }) => sourceId)).size).toBe(10);
  });
});

test("Mock A1 scoring reports totals and each section independently", () => {
  const mock = createMockA1(3);
  const answers = {};
  mock.sections.forEach((section) => {
    section.questions.slice(0, 6).forEach((question) => {
      answers[question.id] = question.answer;
    });
  });

  expect(scoreMockA1(mock, answers)).toEqual({
    score: 24,
    total: 40,
    sections: [
      { id: "reading", title: "Reading", score: 6, total: 10 },
      { id: "listening", title: "Listening", score: 6, total: 10 },
      { id: "vocabulary", title: "Vocabulary", score: 6, total: 10 },
      { id: "grammar", title: "Grammar", score: 6, total: 10 },
    ],
  });
});
