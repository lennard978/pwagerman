import React from "react";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import {
  createDefaultProgress,
  getCurrentStreak,
  loadProgress,
  loadProgressFromIndexedDb,
  normalizeProgress,
  PROGRESS_STORAGE_KEY,
  saveProgress,
  saveProgressToIndexedDb,
} from "./learningProgress";
import { MY_WORDS_STORAGE_KEY } from "./myWords";
import { ProgressProvider, useProgress } from "../i18n/ProgressProvider";

const createFakeIndexedDb = () => {
  const databases = new Map();
  const request = (getValue) => {
    const result = {};
    queueMicrotask(() => {
      result.result = getValue();
      result.onsuccess && result.onsuccess();
    });
    return result;
  };
  return {
    open(name) {
      const openRequest = {};
      queueMicrotask(() => {
        const isNew = !databases.has(name);
        if (isNew) databases.set(name, new Map());
        const stores = databases.get(name);
        openRequest.result = {
          objectStoreNames: { contains: (storeName) => stores.has(storeName) },
          createObjectStore: (storeName) => stores.set(storeName, new Map()),
          transaction: (storeName) => {
            const tx = {
              objectStore: () => ({
                get: (id) => request(() => stores.get(storeName).get(id)),
                getAll: () => request(() => Array.from(stores.get(storeName).values())),
                put: (value) => stores.get(storeName).set(value.id, value),
                clear: () => stores.get(storeName).clear(),
              }),
              set oncomplete(handler) { queueMicrotask(handler); },
              set onerror(handler) {},
            };
            return tx;
          },
        };
        if (isNew) openRequest.onupgradeneeded && openRequest.onupgradeneeded();
        openRequest.onsuccess && openRequest.onsuccess();
      });
      return openRequest;
    },
  };
};

const Probe = () => {
  const {
    progress,
    recordCompletion,
    recordAnswer,
    recordGrammarCompletion,
    recordGrammarAnswer,
    completeOnboarding,
  } = useProgress();
  return (
    <>
      <span data-testid="lessons">{progress.completedLessons.length}</span>
      <span data-testid="mistakes">{progress.recentMistakes.length}</span>
      <span data-testid="grammar-lessons">{progress.completedGrammarLessons.length}</span>
      <span data-testid="grammar-mistakes">{progress.grammarMistakes.length}</span>
      <span data-testid="onboarding">{String(progress.onboardingComplete)}</span>
      <button onClick={() => recordCompletion({ type: "lesson", categoryId: "lesson-1", route: "/chooselesson/0" })}>Complete</button>
      <button onClick={() => recordAnswer({ id: "word-1", source: "house", target: "kuća" }, false)}>Wrong</button>
      <button onClick={() => recordAnswer({ id: "word-1", source: "house", target: "kuća" }, true)}>Correct</button>
      <button onClick={() => recordGrammarCompletion({ lessonId: "noun-gender", route: "/grammar/noun-gender", title: "Noun gender" })}>Complete grammar</button>
      <button onClick={() => recordGrammarAnswer({ lessonId: "noun-gender", exerciseId: "gender-choice", correct: false })}>Grammar wrong</button>
      <button onClick={() => recordGrammarAnswer({ lessonId: "noun-gender", exerciseId: "gender-choice", correct: true })}>Grammar correct</button>
      <button onClick={completeOnboarding}>Onboard</button>
    </>
  );
};

beforeEach(() => {
  localStorage.clear();
  delete window.indexedDB;
});

test("new installs require onboarding while existing vocabulary users migrate safely", () => {
  expect(createDefaultProgress().onboardingComplete).toBe(false);
  localStorage.setItem(MY_WORDS_STORAGE_KEY, "[]");
  expect(createDefaultProgress().onboardingComplete).toBe(true);
  expect(normalizeProgress({ version: 0 }).onboardingComplete).toBe(true);
});

test("malformed progress migrates to the versioned default without losing valid arrays", () => {
  localStorage.setItem(PROGRESS_STORAGE_KEY, JSON.stringify({
    completedLessons: ["lesson-2"],
    completedExercises: "invalid",
    activityDates: ["2026-09-24", "2026-09-24"],
    onboardingComplete: true,
  }));
  expect(loadProgress()).toEqual(expect.objectContaining({
    version: 2,
    completedLessons: ["lesson-2"],
    completedExercises: [],
    completedGrammarLessons: [],
    grammarMistakes: [],
    activityDates: ["2026-09-24"],
    onboardingComplete: true,
  }));
});

test("progress provider keeps grammar completion and mistakes separate from vocabulary review", () => {
  render(<ProgressProvider><Probe /></ProgressProvider>);
  fireEvent.click(screen.getByRole("button", { name: "Grammar wrong" }));
  expect(screen.getByTestId("grammar-mistakes").textContent).toBe("1");
  expect(screen.getByTestId("mistakes").textContent).toBe("0");

  const savedMistake = JSON.parse(localStorage.getItem(PROGRESS_STORAGE_KEY)).grammarMistakes[0];
  expect(savedMistake).toEqual(expect.objectContaining({
    id: "noun-gender:gender-choice",
    reviewEligible: true,
  }));

  fireEvent.click(screen.getByRole("button", { name: "Grammar correct" }));
  fireEvent.click(screen.getByRole("button", { name: "Complete grammar" }));
  expect(screen.getByTestId("grammar-mistakes").textContent).toBe("0");
  expect(screen.getByTestId("grammar-lessons").textContent).toBe("1");
  expect(JSON.parse(localStorage.getItem(PROGRESS_STORAGE_KEY)).lastActivity.type).toBe("grammar");
});

test("progress provider records completions, mistakes, corrections, and onboarding", () => {
  render(<ProgressProvider><Probe /></ProgressProvider>);
  fireEvent.click(screen.getByRole("button", { name: "Complete" }));
  fireEvent.click(screen.getByRole("button", { name: "Wrong" }));
  expect(screen.getByTestId("lessons").textContent).toBe("1");
  expect(screen.getByTestId("mistakes").textContent).toBe("1");
  fireEvent.click(screen.getByRole("button", { name: "Correct" }));
  fireEvent.click(screen.getByRole("button", { name: "Onboard" }));
  expect(screen.getByTestId("mistakes").textContent).toBe("0");
  expect(screen.getByTestId("onboarding").textContent).toBe("true");
  expect(JSON.parse(localStorage.getItem(PROGRESS_STORAGE_KEY)).lastActivity.route).toBe("/chooselesson/0");
});

test("progress persists through IndexedDB with localStorage migration and reload", async () => {
  const idbFactory = createFakeIndexedDb();
  const progress = { ...createDefaultProgress(), onboardingComplete: true, completedLessons: ["lesson-1"] };
  saveProgress(progress);
  expect((await loadProgressFromIndexedDb({ idbFactory })).completedLessons).toEqual(["lesson-1"]);
  const updated = { ...progress, completedExercises: [{ type: "quiz" }] };
  expect(await saveProgressToIndexedDb(updated, idbFactory)).toBe(true);
  localStorage.clear();
  await waitFor(async () =>
    expect((await loadProgressFromIndexedDb({ idbFactory })).completedExercises).toHaveLength(1)
  );
});

test("streak counts consecutive local calendar dates honestly", () => {
  const now = new Date(2026, 8, 24, 12);
  expect(getCurrentStreak(["2026-09-22", "2026-09-23", "2026-09-24"], now)).toBe(3);
  expect(getCurrentStreak(["2026-09-22", "2026-09-24"], now)).toBe(1);
  expect(getCurrentStreak(["2026-09-23"], now)).toBe(0);
});

test("progress remains usable when Safari-style localStorage access fails", () => {
  const unavailableStorage = {
    getItem: () => { throw new Error("storage unavailable"); },
    setItem: () => { throw new Error("storage unavailable"); },
  };
  expect(createDefaultProgress(unavailableStorage)).toEqual(expect.objectContaining({
    onboardingComplete: false,
    completedLessons: [],
  }));
  expect(saveProgress(createDefaultProgress(), unavailableStorage)).toBe(false);
});
