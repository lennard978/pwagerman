import React from "react";
import "@testing-library/jest-dom";
import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { ProgressProvider } from "../../i18n/ProgressProvider";
import { PROGRESS_STORAGE_KEY, createDefaultProgress } from "../../data/learningProgress";
import { GermanGrammarList } from "./GermanGrammarList";
import { GermanGrammarLesson } from "./GermanGrammarLesson";
import { GermanGrammarPractice } from "./GermanGrammarPractice";
import { GrammarDiagnostic } from "./GrammarDiagnostic";
import { GrammarReview } from "./GrammarReview";

jest.mock("react-speech-kit", () => ({
  useSpeechSynthesis: () => ({ speak: jest.fn(), voices: [] }),
}));

const renderRoute = (path, route, element) => render(
  <ProgressProvider><MemoryRouter initialEntries={[path]}><Routes><Route path={route} element={element} /></Routes></MemoryRouter></ProgressProvider>
);

beforeEach(() => {
  localStorage.clear();
  delete window.indexedDB;
});

test("grammar list groups Foundation Review and B1 Core and supports focus filters", () => {
  renderRoute("/learn/grammar", "/learn/grammar", <GermanGrammarList />);
  expect(screen.getByRole("heading", { name: "Foundation Review" })).toBeInTheDocument();
  expect(screen.getByRole("heading", { name: "B1 Core" })).toBeInTheDocument();
  expect(screen.getByText("Word order, questions, negation and sentence bracket")).toBeInTheDocument();
  expect(screen.getAllByLabelText("Status: not-started").length).toBe(24);
});

test("lesson presents rules, translated examples, mistakes, TTS, and Start Practice", () => {
  renderRoute("/learn/grammar/de-b1-passive-voice", "/learn/grammar/:grammarLessonId", <GermanGrammarLesson />);
  expect(screen.getByRole("heading", { name: "Passive voice" })).toBeInTheDocument();
  expect(screen.getByRole("heading", { name: "Rules" })).toBeInTheDocument();
  expect(screen.getByText("The device is being repaired today.")).toBeInTheDocument();
  expect(screen.getByRole("button", { name: /Hear German example: Das Gerät wird heute repariert/ })).toBeInTheDocument();
  expect(screen.getByRole("link", { name: /Start Practice/ })).toHaveAttribute("href", "/learn/grammar/de-b1-passive-voice/practice");
});

test("practice grades by stable option ID and shows an explanation", () => {
  renderRoute("/learn/grammar/de-b1-word-order-foundation/practice", "/learn/grammar/:grammarLessonId/practice", <GermanGrammarPractice />);
  fireEvent.click(screen.getByRole("button", { name: "Heute arbeitet sie im Büro." }));
  fireEvent.click(screen.getByRole("button", { name: "Check answer" }));
  expect(screen.getByRole("status")).toHaveTextContent("Correct");
  expect(screen.getByRole("status")).toHaveTextContent("The conjugated verb arbeitet is the second sentence element.");
});

test("diagnostic identifies itself as independent and starts a 20-question flow", () => {
  renderRoute("/learn/grammar/diagnostic", "/learn/grammar/diagnostic", <GrammarDiagnostic />);
  expect(screen.getByRole("heading", { name: "Grammar diagnostic" })).toBeInTheDocument();
  expect(screen.getByText(/20 questions/)).toBeInTheDocument();
  expect(screen.getByText("Question 1 of 20")).toBeInTheDocument();
});

test("Grammar Review keeps its queue separate and exposes detailed mistakes", () => {
  const progress = createDefaultProgress();
  progress.onboardingComplete = true;
  progress.grammarMistakes = [{
    id: "de-b1-passive-voice:one",
    grammarLessonId: "de-b1-passive-voice",
    exerciseId: "one",
    prompt: "Choose wurde or würde.",
    learnerAnswer: "würde",
    correctAnswer: "wurde",
    explanation: "Wurde is past passive.",
    createdAt: "2026-10-31T10:00:00.000Z",
    resolvedAt: null,
  }];
  localStorage.setItem(PROGRESS_STORAGE_KEY, JSON.stringify(progress));
  renderRoute("/learn/grammar/review", "/learn/grammar/review", <GrammarReview />);
  expect(screen.getByRole("heading", { name: "Grammar Review" })).toBeInTheDocument();
  expect(screen.getByText("Choose wurde or würde.")).toBeInTheDocument();
  expect(screen.getByText("Correct answer: wurde")).toBeInTheDocument();
  expect(screen.getByRole("button", { name: /Mark resolved/ })).toBeInTheDocument();
});
