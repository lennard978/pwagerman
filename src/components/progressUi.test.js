import React from "react";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { LanguageProvider } from "../i18n/LanguageProvider";
import { MyWordsProvider } from "../i18n/MyWordsProvider";
import { ProgressProvider } from "../i18n/ProgressProvider";
import { createDefaultProgress, PROGRESS_STORAGE_KEY } from "../data/learningProgress";
import { Onboarding } from "./Onboarding";
import { Review } from "../screen/review/Review";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { Home } from "../screen/home/Home";
import { Lesson } from "../screen/lesson/Lesson";
import { Test } from "../screen/test/Test";

jest.mock("../services/tts/ttsProvider", () => ({ speak: jest.fn() }));
jest.mock("react-speech-kit", () => ({
  useSpeechSynthesis: () => ({ speak: jest.fn(), voices: [] }),
}));

const Providers = ({ children }) => (
  <LanguageProvider>
    <MyWordsProvider>
      <ProgressProvider>{children}</ProgressProvider>
    </MyWordsProvider>
  </LanguageProvider>
);

beforeEach(() => {
  localStorage.clear();
  delete window.indexedDB;
});

test("first-run onboarding advances through three screens and persists completion", () => {
  render(<Providers><Onboarding /></Providers>);
  expect(screen.getByRole("heading", { name: "Serbian A1" })).toBeTruthy();
  fireEvent.click(screen.getByRole("button", { name: "Continue" }));
  expect(screen.getByRole("heading", { name: "Learn" })).toBeTruthy();
  fireEvent.click(screen.getByRole("button", { name: "Continue" }));
  expect(screen.getByRole("heading", { name: "Practice & My Words" })).toBeTruthy();
  fireEvent.click(screen.getByRole("button", { name: "Start learning" }));
  expect(JSON.parse(localStorage.getItem(PROGRESS_STORAGE_KEY)).onboardingComplete).toBe(true);
});

test("onboarding can be skipped without opening install help", () => {
  render(<Providers><Onboarding /></Providers>);
  expect(screen.queryByRole("button", { name: "Install app" })).toBeNull();
  fireEvent.click(screen.getByRole("button", { name: "Skip" }));
  expect(JSON.parse(localStorage.getItem(PROGRESS_STORAGE_KEY)).onboardingComplete).toBe(true);
});

test("Review shows a clear empty state when there are no recent mistakes", () => {
  localStorage.setItem(PROGRESS_STORAGE_KEY, JSON.stringify({
    ...createDefaultProgress(),
    onboardingComplete: true,
  }));
  render(<Providers><Review /></Providers>);
  expect(screen.getByText("No recent mistakes. Keep practising!")).toBeTruthy();
});

test("Review reveals a mistake, supports word statuses, and clears it when correct", async () => {
  localStorage.setItem(PROGRESS_STORAGE_KEY, JSON.stringify({
    ...createDefaultProgress(),
    onboardingComplete: true,
    recentMistakes: [{
      word: { id: "custom-house", source: "house", target: "kuća", kind: "custom" },
      count: 1,
      lastMissedAt: "2026-09-24T08:00:00.000Z",
    }],
  }));
  render(<Providers><Review /></Providers>);
  expect(screen.getByRole("heading", { name: "house" })).toBeTruthy();
  fireEvent.click(screen.getByRole("button", { name: "Reveal Serbian" }));
  expect(screen.getByText("kuća")).toBeTruthy();
  fireEvent.click(screen.getByRole("button", { name: "Add to favorites" }));
  fireEvent.click(screen.getByRole("button", { name: "Mark as Known" }));
  fireEvent.click(screen.getByRole("button", { name: "Got it" }));
  await waitFor(() =>
    expect(screen.getByText("No recent mistakes. Keep practising!")).toBeTruthy()
  );
});

test("completing a lesson persists the category and makes Home offer Continue learning", () => {
  localStorage.setItem(PROGRESS_STORAGE_KEY, JSON.stringify({
    ...createDefaultProgress(),
    onboardingComplete: true,
  }));
  const data = [{
    id: "lesson-1",
    titleKey: "lessons.greetings.title",
    items: [{ id: "word-1", source: "hello", target: "zdravo", status: "learning", favorite: false }],
  }];
  const { unmount } = render(
    <Providers>
      <MemoryRouter initialEntries={["/chooselesson/0"]}>
        <Routes>
          <Route path="/chooselesson/:userId" element={<Lesson data={data} />} />
          <Route path="/learn" element={<span>Learn</span>} />
        </Routes>
      </MemoryRouter>
    </Providers>
  );
  fireEvent.click(screen.getByRole("link", { name: "Complete lesson" }));
  expect(JSON.parse(localStorage.getItem(PROGRESS_STORAGE_KEY)).completedLessons).toEqual(["lesson-1"]);
  unmount();

  render(<Providers><MemoryRouter><Home /></MemoryRouter></Providers>);
  expect(screen.getByText("Continue learning")).toBeTruthy();
  expect(screen.getByText("1 / 15")).toBeTruthy();
});

test("a wrong Test answer persists a recent mistake and completed practice session", () => {
  localStorage.setItem(PROGRESS_STORAGE_KEY, JSON.stringify({
    ...createDefaultProgress(),
    onboardingComplete: true,
  }));
  const data = [{
    id: "test-1",
    titleKey: "lessons.greetings.title",
    questions: [{
      wordId: "word-house",
      source: "house",
      target: "kuća",
      prompt: "\"house\" in Serbian is:",
      options: ["kuća", "voda"],
      answer: "kuća",
    }],
  }];
  render(
    <Providers>
      <MemoryRouter initialEntries={["/choosetest/0"]}>
        <Routes>
          <Route path="/choosetest/:userId" element={<Test data={data} />} />
        </Routes>
      </MemoryRouter>
    </Providers>
  );
  fireEvent.click(screen.getByRole("button", { name: "voda" }));
  fireEvent.click(screen.getByRole("button", { name: "Next" }));
  const progress = JSON.parse(localStorage.getItem(PROGRESS_STORAGE_KEY));
  expect(progress.recentMistakes[0].word).toEqual(expect.objectContaining({
    id: "word-house",
    source: "house",
    target: "kuća",
  }));
  expect(progress.completedExercises[0].type).toBe("test");
});
