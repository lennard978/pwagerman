import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import App from "../../components/App";
import {
  createExamPrepSession,
  ExamGrammarPool,
  ExamPrepAreas,
  ExamVocabularyPool,
  ListeningTasks,
  ReadingTasks,
} from "../../data/examPrep";
import { GrammarLessons } from "../../data/grammar";
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

beforeEach(() => {
  localStorage.clear();
  delete window.indexedDB;
  localStorage.setItem(PROGRESS_STORAGE_KEY, JSON.stringify({
    ...createDefaultProgress(),
    onboardingComplete: true,
  }));
  mockSpeak.mockClear();
});

test("exam prep data provides complete original reading and listening tasks", () => {
  expect(ExamPrepAreas.map(({ id, status }) => [id, status])).toEqual([
    ["reading", "available"],
    ["listening", "available"],
    ["vocabulary-grammar", "available"],
    ["mock-a1", "locked"],
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

test("Practice links to Exam Prep without changing the four-tab navigation", () => {
  renderApp("/practice");

  expect(screen.getByRole("link", { name: /Exam Prep/ }).getAttribute("href"))
    .toBe("/exam-prep");
  expect(screen.getByRole("navigation").querySelectorAll("a")).toHaveLength(4);
});

test("Exam Prep landing exposes three skills and keeps Mock A1 locked", () => {
  renderApp("/exam-prep");

  expect(screen.getByRole("heading", { name: "Exam Prep" })).toBeTruthy();
  expect(screen.getByText(/not official exam content/i)).toBeTruthy();
  expect(screen.getByRole("link", { name: /Reading/ }).getAttribute("href"))
    .toBe("/exam-prep/reading");
  expect(screen.getByRole("link", { name: /Listening/ }).getAttribute("href"))
    .toBe("/exam-prep/listening");
  expect(screen.getByRole("link", { name: /Vocabulary & Grammar/ }).getAttribute("href"))
    .toBe("/exam-prep/vocabulary-grammar");
  expect(screen.getByText("Mock A1").closest("[aria-disabled='true']")).toBeTruthy();
});

test("reading task grades answers, shows shared results, and persists completion", () => {
  renderApp("/exam-prep/reading/reading-introduction");

  [
    "In Novi Sad",
    "At a school",
    "Serbian and English",
    "She drinks coffee with Mila",
  ].forEach((answer, index) => {
    fireEvent.click(screen.getByRole("button", { name: answer }));
    fireEvent.click(screen.getByRole("button", {
      name: index === 3 ? "Show results" : "Next",
    }));
  });

  expect(screen.getByRole("heading", { name: "Practice complete" })).toBeTruthy();
  expect(screen.getByText("100% practice score")).toBeTruthy();
  expect(screen.getAllByText(/Correct answer:/)).toHaveLength(4);
  expect(screen.getByRole("button", { name: "Retry" })).toBeTruthy();
  expect(screen.getByRole("link", { name: "Back to Exam Prep" })).toBeTruthy();

  const saved = JSON.parse(localStorage.getItem(PROGRESS_STORAGE_KEY));
  expect(saved.completedExamReadingTasks).toContain("reading-introduction");
  expect(saved.completedExamPrepSessions).toHaveLength(1);
  expect(saved.examPrepBestScores.reading).toBe(100);
  expect(saved.recentMistakes).toEqual([]);
  expect(saved.grammarMistakes).toEqual([]);
});

test("listening supports replay and reveals its transcript only after completion", () => {
  const task = ListeningTasks[0];
  renderApp(`/exam-prep/listening/${task.id}`);

  expect(screen.queryByText(task.transcript)).toBeNull();
  const play = screen.getByRole("button", { name: `Play listening task: ${task.title}` });
  fireEvent.click(play);
  fireEvent.click(play);
  expect(mockSpeak).toHaveBeenCalledTimes(2);
  expect(mockSpeak).toHaveBeenLastCalledWith(expect.objectContaining({
    text: task.transcript,
    lang: "sr-RS",
  }));

  ["28", "In Belgrade", "At a bank", "He plays football"].forEach((answer, index) => {
    fireEvent.click(screen.getByRole("button", { name: answer }));
    fireEvent.click(screen.getByRole("button", {
      name: index === 3 ? "Show results" : "Next",
    }));
  });

  expect(screen.getByRole("heading", { name: "Transcript" })).toBeTruthy();
  expect(screen.getByText(task.transcript)).toBeTruthy();
  expect(screen.getByText(task.translation)).toBeTruthy();
  const saved = JSON.parse(localStorage.getItem(PROGRESS_STORAGE_KEY));
  expect(saved.completedExamListeningTasks).toContain(task.id);
});

test("mixed review starts a twenty-question bounded session", () => {
  renderApp("/exam-prep/vocabulary-grammar");

  expect(screen.getByRole("heading", { name: "Vocabulary & Grammar" })).toBeTruthy();
  expect(screen.getByText("Question 1 of 20")).toBeTruthy();
  expect(screen.getByText(/10 vocabulary questions and 10 grammar questions/)).toBeTruthy();
});
