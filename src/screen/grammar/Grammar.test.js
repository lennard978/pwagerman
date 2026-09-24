import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import App from "../../components/App";
import { createDefaultProgress, PROGRESS_STORAGE_KEY } from "../../data/learningProgress";
import { GrammarLessons, GrammarSyllabus } from "../../data/grammar";
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

test("grammar syllabus contains eleven available A1 lessons and eight planned topics", () => {
  expect(GrammarSyllabus).toHaveLength(19);
  expect(GrammarLessons.map((lesson) => lesson.id)).toEqual([
    "latin-alphabet",
    "cyrillic-alphabet",
    "noun-gender",
    "plural-basics",
    "personal-pronouns",
    "present-tense",
    "biti",
    "imati",
    "adjective-agreement",
    "negation",
    "question-formation",
  ]);
  GrammarLessons.forEach((lesson) => {
    expect(lesson.examples.length).toBeGreaterThanOrEqual(3);
    expect(lesson.practice.length).toBeGreaterThanOrEqual(3);
    expect(lesson.contentOrigin).toBe("app-authored");
  });
  expect(new Set(GrammarLessons.flatMap((lesson) =>
    lesson.practice.map((exercise) => exercise.type)
  ))).toEqual(new Set(["choose", "fill", "match", "order"]));
  expect(GrammarLessons[0].source.evidence).toBe("verified-scope");
  expect(GrammarLessons[2].source.evidence).toBe("supplementary");
});

test("phase 2A grammar lessons have complete examples and bounded mixed practice", () => {
  const newLessonIds = [
    "plural-basics",
    "personal-pronouns",
    "present-tense",
    "biti",
  ];

  newLessonIds.forEach((lessonId) => {
    const lesson = GrammarLessons.find(({ id }) => id === lessonId);
    expect(lesson).toBeDefined();
    expect(lesson.examples.length).toBeGreaterThanOrEqual(4);
    expect(lesson.examples.length).toBeLessThanOrEqual(8);
    lesson.examples.forEach((example) => {
      expect(example.serbian).toBeTruthy();
      expect(example.english).toBeTruthy();
    });
    expect(lesson.practice.length).toBeGreaterThanOrEqual(8);
    expect(lesson.practice.length).toBeLessThanOrEqual(12);
    expect(new Set(lesson.practice.map(({ type }) => type))).toEqual(
      new Set(["choose", "fill", "match", "order"])
    );
  });
});

test("phase 2B lessons have translated examples and deterministic mixed practice", () => {
  const newLessonIds = [
    "imati",
    "adjective-agreement",
    "negation",
    "question-formation",
  ];

  newLessonIds.forEach((lessonId) => {
    const lesson = GrammarLessons.find(({ id }) => id === lessonId);
    expect(lesson).toBeDefined();
    expect(lesson.examples.length).toBeGreaterThanOrEqual(4);
    expect(lesson.examples.length).toBeLessThanOrEqual(8);
    lesson.examples.forEach((example) => {
      expect(example.serbian).toBeTruthy();
      expect(example.english).toBeTruthy();
    });
    expect(lesson.practice.length).toBeGreaterThanOrEqual(8);
    expect(lesson.practice.length).toBeLessThanOrEqual(12);
    expect(new Set(lesson.practice.map(({ type }) => type))).toEqual(
      new Set(["choose", "fill", "match", "order"])
    );
    lesson.practice.forEach((exercise) => {
      if (exercise.type === "choose") {
        expect(exercise.options).toContain(exercise.answer);
      }
      if (exercise.type === "fill") {
        expect(exercise.answer.trim()).toBeTruthy();
      }
      if (exercise.type === "match") {
        expect(new Set(exercise.pairs.map(({ right }) => right)).size).toBe(
          exercise.pairs.length
        );
      }
      if (exercise.type === "order") {
        expect([...exercise.answer].sort()).toEqual([...exercise.tokens].sort());
      }
    });
  });
});

test("Learn exposes Grammar without changing the four-tab navigation", () => {
  renderApp("/learn");

  expect(screen.getByRole("link", { name: /Grammar/ }).getAttribute("href")).toBe("/grammar");
  expect(screen.getAllByRole("navigation")).toHaveLength(1);
  expect(screen.getByRole("navigation").querySelectorAll("a")).toHaveLength(4);
  ["Home", "Learn", "Practice", "My Words"].forEach((label) => {
    expect(screen.getByRole("link", { name: label })).toBeTruthy();
  });
});

test("grammar route renders the syllabus and routes into a lesson", () => {
  renderApp("/grammar");

  expect(screen.getByRole("heading", { name: "Grammar" })).toBeTruthy();
  expect(screen.getByRole("link", { name: /Serbian Latin alphabet/ })).toBeTruthy();
  expect(screen.getByRole("link", { name: /Plural basics/ })).toBeTruthy();
  expect(screen.getByRole("link", { name: /The verb biti/ })).toBeTruthy();
  expect(screen.getByRole("link", { name: /The verb imati/ })).toBeTruthy();
  expect(screen.getByRole("link", { name: /Question formation/ })).toBeTruthy();
  expect(screen.getByText("Accusative")).toBeTruthy();
  expect(screen.getAllByText("Planned for a reviewed future lesson").length).toBe(8);
});

test.each([
  ["imati", "The verb imati", "Imam brata."],
  ["adjective-agreement", "Adjective agreement", "Ovo je dobar restoran."],
  ["negation", "Negation", "Ne razumem."],
  ["question-formation", "Question formation", "Gde živiš?"],
])("new grammar lesson %s renders its complete content", (lessonId, title, example) => {
  renderApp(`/grammar/${lessonId}`);

  expect(screen.getByRole("heading", { name: title })).toBeTruthy();
  expect(screen.getByRole("heading", { name: "Rule" })).toBeTruthy();
  expect(screen.getAllByText(example).length).toBeGreaterThan(0);
  expect(screen.getByText("Common mistake")).toBeTruthy();
  expect(screen.getAllByText(/^Practice [1-8]$/)).toHaveLength(8);
});

test("new grammar examples use Serbian TTS and lesson completion persists", () => {
  renderApp("/grammar/imati");

  fireEvent.click(screen.getByRole("button", {
    name: "Hear Serbian example: Imam brata.",
  }));
  expect(mockSpeak).toHaveBeenCalledWith(expect.objectContaining({
    text: "Imam brata.",
    lang: "sr-RS",
  }));

  fireEvent.click(screen.getByRole("button", { name: "Complete grammar lesson" }));
  const saved = JSON.parse(localStorage.getItem(PROGRESS_STORAGE_KEY));
  expect(saved.completedGrammarLessons).toContain("imati");
  expect(saved.lastActivity.route).toBe("/grammar/imati");
});

test("grammar practice records a review-eligible mistake without adding a vocabulary mistake", () => {
  renderApp("/grammar/negation");

  fireEvent.click(screen.getByRole("button", { name: "Nisam radim danas." }));

  const saved = JSON.parse(localStorage.getItem(PROGRESS_STORAGE_KEY));
  expect(saved.grammarMistakes).toEqual([
    expect.objectContaining({
      lessonId: "negation",
      exerciseId: "negation-work-choice",
      reviewEligible: true,
    }),
  ]);
  expect(saved.recentMistakes).toEqual([]);
});
