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

test("grammar syllabus contains the requested A1 architecture and three available proof lessons", () => {
  expect(GrammarSyllabus).toHaveLength(19);
  expect(GrammarLessons.map((lesson) => lesson.id)).toEqual([
    "latin-alphabet",
    "cyrillic-alphabet",
    "noun-gender",
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
  expect(screen.getByText("Accusative")).toBeTruthy();
  expect(screen.getAllByText("Planned for a reviewed future lesson").length).toBe(16);
});

test("grammar lesson renders rule, examples, mistakes, practice, TTS, and completion", () => {
  renderApp("/grammar/latin-alphabet");

  expect(screen.getByRole("heading", { name: "Serbian Latin alphabet" })).toBeTruthy();
  expect(screen.getByRole("heading", { name: "Rule" })).toBeTruthy();
  expect(screen.getByText("Čitam knjigu.")).toBeTruthy();
  expect(screen.getByText("Common mistake")).toBeTruthy();
  expect(screen.getAllByText(/^Practice [1-3]$/)).toHaveLength(3);

  fireEvent.click(screen.getByRole("button", {
    name: "Hear Serbian example: Čitam knjigu.",
  }));
  expect(mockSpeak).toHaveBeenCalledWith(expect.objectContaining({
    text: "Čitam knjigu.",
    lang: "sr-RS",
  }));

  fireEvent.click(screen.getByRole("button", { name: "Complete grammar lesson" }));
  const saved = JSON.parse(localStorage.getItem(PROGRESS_STORAGE_KEY));
  expect(saved.completedGrammarLessons).toContain("latin-alphabet");
  expect(saved.lastActivity.route).toBe("/grammar/latin-alphabet");
});

test("grammar practice records a review-eligible mistake without adding a vocabulary mistake", () => {
  renderApp("/grammar/noun-gender");

  fireEvent.click(screen.getByRole("button", { name: "grad" }));

  const saved = JSON.parse(localStorage.getItem(PROGRESS_STORAGE_KEY));
  expect(saved.grammarMistakes).toEqual([
    expect.objectContaining({
      lessonId: "noun-gender",
      exerciseId: "gender-feminine-choice",
      reviewEligible: true,
    }),
  ]);
  expect(saved.recentMistakes).toEqual([]);
});
