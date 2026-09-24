import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import App from "../../components/App";
import { ExamVocabularyPool } from "../../data/examPrep";
import { GrammarLessons } from "../../data/grammar";
import {
  createMockA1,
  MockGrammarQuestions,
  scoreMockA1,
} from "../../data/mockA1";
import { createDefaultProgress, PROGRESS_STORAGE_KEY } from "../../data/learningProgress";
import { LanguageProvider } from "../../i18n/LanguageProvider";
import { MyWordsProvider } from "../../i18n/MyWordsProvider";
import { ProgressProvider } from "../../i18n/ProgressProvider";

const mockSpeak = jest.fn();

jest.mock("../../services/tts/ttsProvider", () => ({
  speak: (...args) => mockSpeak(...args),
}));

jest.mock("react-speech-kit", () => ({
  useSpeechSynthesis: () => ({ speak: jest.fn(), voices: [{ lang: "sr-RS" }] }),
}));

const renderApp = (route) => render(
  <LanguageProvider>
    <MyWordsProvider>
      <ProgressProvider>
        <MemoryRouter initialEntries={[route]}>
          <App />
        </MemoryRouter>
      </ProgressProvider>
    </MyWordsProvider>
  </LanguageProvider>
);

const chooseAndAdvance = (answer, nextName) => {
  fireEvent.click(screen.getByRole("button", { name: answer }));
  fireEvent.click(screen.getByRole("button", { name: nextName }));
};

beforeEach(() => {
  localStorage.clear();
  delete window.indexedDB;
  localStorage.setItem(PROGRESS_STORAGE_KEY, JSON.stringify({
    ...createDefaultProgress(),
    onboardingComplete: true,
  }));
  mockSpeak.mockClear();
});

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

test("Mock A1 route shows original-practice instructions and four sections", () => {
  renderApp("/exam-prep/mock-a1");

  expect(screen.getByRole("heading", { name: "Mock A1" })).toBeTruthy();
  expect(screen.getByText(/not an official Serbian government or University of Belgrade exam/i))
    .toBeTruthy();
  ["Reading", "Listening", "Vocabulary", "Grammar"].forEach((section) => {
    expect(screen.getByText(section)).toBeTruthy();
  });
  expect(screen.getAllByText("10 questions")).toHaveLength(4);
  expect(screen.getByRole("button", { name: "Start Mock A1" })).toBeTruthy();
});

test("Mock navigation preserves an answer when moving back", () => {
  const mock = createMockA1(0);
  renderApp("/exam-prep/mock-a1");
  fireEvent.click(screen.getByRole("button", { name: "Start Mock A1" }));

  const first = mock.sections[0].questions[0];
  chooseAndAdvance(first.answer, "Next");
  fireEvent.click(screen.getByRole("button", { name: "Previous" }));
  expect(screen.getByRole("button", { name: first.answer }).getAttribute("aria-pressed"))
    .toBe("true");
  expect(screen.getByText("Question 1 of 40")).toBeTruthy();
});

test("Mock listening replays audio and keeps transcripts hidden before submission", () => {
  const mock = createMockA1(0);
  renderApp("/exam-prep/mock-a1");
  fireEvent.click(screen.getByRole("button", { name: "Start Mock A1" }));

  mock.sections[0].questions.forEach((question, index) => {
    chooseAndAdvance(
      question.answer,
      index === 9 ? "Continue to Listening" : "Next"
    );
  });

  const listeningQuestion = mock.sections[1].questions[0];
  expect(screen.queryByText(listeningQuestion.transcript)).toBeNull();
  const play = screen.getByRole("button", {
    name: `Play mock listening: ${listeningQuestion.audioTitle}`,
  });
  fireEvent.click(play);
  fireEvent.click(play);
  expect(mockSpeak).toHaveBeenCalledTimes(2);
  expect(mockSpeak).toHaveBeenLastCalledWith(expect.objectContaining({
    text: listeningQuestion.transcript,
    lang: "sr-RS",
  }));
});

test("Mock submits with confirmation, persists scores, and starts a new selection", () => {
  const mock = createMockA1(0);
  renderApp("/exam-prep/mock-a1");
  fireEvent.click(screen.getByRole("button", { name: "Start Mock A1" }));

  mock.sections.forEach((section, sectionIndex) => {
    section.questions.forEach((question, questionIndex) => {
      const isLastQuestion = questionIndex === section.questions.length - 1;
      const isLastSection = sectionIndex === mock.sections.length - 1;
      chooseAndAdvance(
        question.answer,
        isLastSection && isLastQuestion
          ? "Review submission"
          : isLastQuestion
            ? `Continue to ${mock.sections[sectionIndex + 1].title}`
            : "Next"
      );
    });
  });

  expect(screen.getByRole("dialog")).toBeTruthy();
  expect(screen.getByText(/answered all 40 questions/i)).toBeTruthy();
  fireEvent.click(screen.getByRole("button", { name: "Submit mock" }));

  expect(screen.getByRole("heading", { name: "Practice score" })).toBeTruthy();
  expect(screen.getByText("40 / 40")).toBeTruthy();
  expect(screen.getAllByText("10 / 10")).toHaveLength(4);
  expect(screen.queryByText(/\bpassed\b|\bfailed\b/i)).toBeNull();
  expect(screen.getByRole("button", { name: "Retry same mock" })).toBeTruthy();

  fireEvent.click(screen.getByRole("button", { name: "Review answers" }));
  expect(screen.getByLabelText("Mock answer review")).toBeTruthy();
  expect(screen.getByText(mock.sections[1].questions[0].transcript)).toBeTruthy();

  const saved = JSON.parse(localStorage.getItem(PROGRESS_STORAGE_KEY));
  expect(saved.completedMockExams).toHaveLength(1);
  expect(saved.latestMockScore).toEqual(expect.objectContaining({ score: 40, total: 40 }));
  expect(saved.bestMockScore).toBe(40);
  expect(saved.bestMockSectionScores).toEqual({
    reading: 10,
    listening: 10,
    vocabulary: 10,
    grammar: 10,
  });
  expect(saved.recentMistakes).toEqual([]);
  expect(saved.grammarMistakes).toEqual([]);

  fireEvent.click(screen.getByRole("button", { name: "Start new mock" }));
  expect(screen.getByText("Question 1 of 40")).toBeTruthy();
  expect(screen.getByRole("heading", {
    name: createMockA1(1).sections[0].questions[0].prompt,
  })).toBeTruthy();
});
