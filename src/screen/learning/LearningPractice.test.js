import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { LanguageProvider } from "../../i18n/LanguageProvider";
import { MyWordsProvider } from "../../i18n/MyWordsProvider";
import { WORD_STATUSES_STORAGE_KEY } from "../../data/myWords";
import { GermanCurriculum } from "../../data/vocabulary/curriculum";
import { getExerciseRoundLimit, LEARNING_SESSION_LIMIT } from "../../data/exerciseRounds";
import { getLearningWords, LearningPractice } from "./LearningPractice";

const renderPractice = () => render(
  <LanguageProvider><MyWordsProvider><MemoryRouter><LearningPractice /></MemoryRouter></MyWordsProvider></LanguageProvider>
);

beforeEach(() => {
  localStorage.clear();
  delete window.indexedDB;
});

test("Learning practice selects only canonical Learning items and stays bounded", () => {
  expect(getLearningWords([
    { id: "new", status: "new" },
    { id: "learning", status: "learning" },
    { id: "known", status: "known" },
  ])).toEqual([{ id: "learning", status: "learning" }]);
  expect(LEARNING_SESSION_LIMIT).toBe(10);
  expect(getExerciseRoundLimit("cards", "learning")).toBe(10);
  expect(getExerciseRoundLimit("cards", "other")).toBe(12);
});

test("Learning practice shows an actionable empty state", () => {
  renderPractice();
  expect(screen.getByText("Mark words you want to practise.")).toBeTruthy();
  expect(screen.getByRole("link", { name: "Browse vocabulary" }).getAttribute("href"))
    .toBe("/learn/vocabulary?browse=1");
});

test("Learning practice reuses focused engines and reports the live count", () => {
  localStorage.setItem(WORD_STATUSES_STORAGE_KEY, JSON.stringify([
    { lexemeId: GermanCurriculum[0].items[0].id, status: "learning" },
    { lexemeId: GermanCurriculum[0].items[1].id, status: "learning" },
  ]));
  renderPractice();

  expect(screen.getByText("Learning: 2")).toBeTruthy();
  expect(screen.getByRole("link", { name: /Cards/ }).getAttribute("href")).toBe("/practice/cards/learning");
  expect(screen.getByRole("link", { name: /Quiz/ }).getAttribute("href")).toBe("/practice/quiz/learning");
  expect(screen.getByRole("link", { name: /Spelling/ }).getAttribute("href")).toBe("/practice/spelling/learning");
  expect(screen.getByRole("link", { name: /Pair/ }).getAttribute("href")).toBe("/practice/pair/learning");
});
