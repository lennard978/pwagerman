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

test("grammar syllabus contains the complete nineteen-lesson A1 roadmap", () => {
  expect(GrammarSyllabus).toHaveLength(19);
  expect(GrammarSyllabus.every(({ status }) => status === "available")).toBe(true);
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
    "accusative",
    "genitive",
    "dative",
    "locative",
    "instrumental",
    "common-prepositions",
    "possessives",
    "number-agreement",
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

test("all grammar content is complete, unique, and deterministic", () => {
  expect(new Set(GrammarLessons.map(({ id }) => id)).size).toBe(GrammarLessons.length);

  const exampleTexts = [];
  const exerciseIds = [];
  GrammarLessons.forEach((lesson) => {
    expect(lesson.level).toBe("A1");
    expect(lesson.status).toBe("available");
    expect(lesson.title).toBeTruthy();
    expect(lesson.titleSr).toBeTruthy();
    expect(lesson.explanation).toBeTruthy();
    expect(lesson.source).toBeTruthy();
    expect(lesson.contentOrigin).toBe("app-authored");
    expect(lesson.rule.headers.length).toBeGreaterThan(0);
    expect(lesson.rule.rows.length).toBeGreaterThan(0);
    expect(lesson.commonMistake).toBeTruthy();

    lesson.examples.forEach(({ serbian, english }) => {
      expect(serbian).toBeTruthy();
      expect(english).toBeTruthy();
      exampleTexts.push(serbian.toLocaleLowerCase("sr"));
    });
    (lesson.compare || []).forEach(({ serbian, english, note }) => {
      expect(serbian).toBeTruthy();
      expect(english).toBeTruthy();
      expect(note).toBeTruthy();
    });
    lesson.practice.forEach((exercise) => {
      exerciseIds.push(exercise.id);
      expect(["choose", "fill", "match", "order"]).toContain(exercise.type);
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

  expect(new Set(exampleTexts).size).toBe(exampleTexts.length);
  expect(new Set(exerciseIds).size).toBe(exerciseIds.length);
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

test("phase 2C case lessons have comparisons and deterministic mixed practice", () => {
  const caseLessonIds = ["accusative", "genitive", "dative", "locative"];

  caseLessonIds.forEach((lessonId) => {
    const lesson = GrammarLessons.find(({ id }) => id === lessonId);
    expect(lesson).toBeDefined();
    expect(lesson.examples.length).toBeGreaterThanOrEqual(5);
    expect(lesson.examples.length).toBeLessThanOrEqual(8);
    lesson.examples.forEach((example) => {
      expect(example.serbian).toBeTruthy();
      expect(example.english).toBeTruthy();
    });
    expect(lesson.compare.length).toBeGreaterThanOrEqual(2);
    lesson.compare.forEach((item) => {
      expect(item.serbian).toBeTruthy();
      expect(item.english).toBeTruthy();
      expect(item.note).toBeTruthy();
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

  const accusative = GrammarLessons.find(({ id }) => id === "accusative");
  const locative = GrammarLessons.find(({ id }) => id === "locative");
  expect(accusative.compare).toEqual(expect.arrayContaining([
    expect.objectContaining({ serbian: "Idem u školu.", note: "movement → Accusative" }),
    expect.objectContaining({ serbian: "Radim u školi.", note: "location → Locative" }),
  ]));
  expect(locative.compare).toEqual(expect.arrayContaining([
    expect.objectContaining({ serbian: "Idem na posao.", note: "movement → Accusative" }),
    expect.objectContaining({ serbian: "Ja sam na poslu.", note: "location → Locative" }),
  ]));
});

test("phase 2D lessons complete the roadmap with reviewed examples and mixed practice", () => {
  const finalLessonIds = [
    "instrumental",
    "common-prepositions",
    "possessives",
    "number-agreement",
  ];

  finalLessonIds.forEach((lessonId) => {
    const lesson = GrammarLessons.find(({ id }) => id === lessonId);
    expect(lesson).toBeDefined();
    expect(lesson.examples.length).toBeGreaterThanOrEqual(5);
    expect(lesson.examples.length).toBeLessThanOrEqual(8);
    expect(lesson.practice.length).toBeGreaterThanOrEqual(8);
    expect(lesson.practice.length).toBeLessThanOrEqual(12);
    expect(new Set(lesson.practice.map(({ type }) => type))).toEqual(
      new Set(["choose", "fill", "match", "order"])
    );
  });

  const instrumental = GrammarLessons.find(({ id }) => id === "instrumental");
  expect(instrumental.examples).toEqual(expect.arrayContaining([
    { serbian: "Idem autobusom.", english: "I am going by bus." },
    { serbian: "Pišem olovkom.", english: "I am writing with a pencil." },
    { serbian: "Idem sa prijateljem.", english: "I am going with a friend." },
  ]));
  expect(instrumental.commonMistake).toContain("Do not use sa for a means of transport");

  const prepositions = GrammarLessons.find(({ id }) => id === "common-prepositions");
  expect(prepositions.rule.rows.map(([preposition]) => preposition)).toEqual([
    "u", "na", "iz", "sa", "kod", "do", "od", "o", "za",
  ]);
  expect(prepositions.compare).toEqual(expect.arrayContaining([
    expect.objectContaining({ serbian: "Idem u školu.", note: "movement → u + Accusative" }),
    expect.objectContaining({ serbian: "Ja sam u školi.", note: "location → u + Locative" }),
  ]));

  const possessives = GrammarLessons.find(({ id }) => id === "possessives");
  expect(possessives.rule.rows).toEqual(expect.arrayContaining([
    ["my", "moj brat", "moja sestra", "moje dete"],
    ["her", "njen brat", "njena sestra", "njeno dete"],
    ["their", "njihov brat", "njihova sestra", "njihovo dete"],
  ]));

  const numbers = GrammarLessons.find(({ id }) => id === "number-agreement");
  expect(numbers.examples).toEqual(expect.arrayContaining([
    { serbian: "jedan student", english: "one student" },
    { serbian: "dve knjige", english: "two books" },
    { serbian: "tri dana", english: "three days" },
    { serbian: "pet ljudi", english: "five people" },
  ]));
  expect(numbers.explanation).toContain("compound numbers have additional rules");
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
  expect(screen.getByRole("link", { name: /Accusative/ })).toBeTruthy();
  expect(screen.getByRole("link", { name: /Locative/ })).toBeTruthy();
  expect(screen.getByRole("link", { name: /Instrumental/ })).toBeTruthy();
  expect(screen.getByRole("link", { name: /Common prepositions/ })).toBeTruthy();
  expect(screen.getByRole("link", { name: /Possessives/ })).toBeTruthy();
  expect(screen.getByRole("link", { name: /Numbers and noun agreement/ })).toBeTruthy();
  expect(screen.queryByText("Planned for a reviewed future lesson")).toBeNull();
});

test.each([
  ["accusative", "Accusative", "Vidim čoveka."],
  ["genitive", "Genitive", "Nema hleba."],
  ["dative", "Dative", "Treba mi pomoć."],
  ["locative", "Locative", "Živim u Srbiji."],
  ["instrumental", "Instrumental", "Idem autobusom."],
  ["common-prepositions", "Common prepositions", "Idem u školu."],
  ["possessives", "Possessives", "Moj brat radi danas."],
  ["number-agreement", "Numbers and noun agreement", "jedan student"],
])("new grammar lesson %s renders its complete content", (lessonId, title, example) => {
  renderApp(`/grammar/${lessonId}`);

  expect(screen.getByRole("heading", { name: title })).toBeTruthy();
  expect(screen.getByRole("heading", { name: "Rule" })).toBeTruthy();
  expect(screen.getAllByText(example).length).toBeGreaterThan(0);
  expect(screen.getByRole("heading", { name: "Compare" })).toBeTruthy();
  expect(screen.getByText("Common mistake")).toBeTruthy();
  expect(screen.getAllByText(/^Practice [1-8]$/)).toHaveLength(8);
});

test("new grammar examples use Serbian TTS and lesson completion persists", () => {
  renderApp("/grammar/instrumental");

  fireEvent.click(screen.getByRole("button", {
    name: "Hear Serbian example: Idem autobusom.",
  }));
  expect(mockSpeak).toHaveBeenCalledWith(expect.objectContaining({
    text: "Idem autobusom.",
    lang: "sr-RS",
  }));

  fireEvent.click(screen.getByRole("button", { name: "Complete grammar lesson" }));
  const saved = JSON.parse(localStorage.getItem(PROGRESS_STORAGE_KEY));
  expect(saved.completedGrammarLessons).toContain("instrumental");
  expect(saved.lastActivity.route).toBe("/grammar/instrumental");
});

test("grammar practice records a review-eligible mistake without adding a vocabulary mistake", () => {
  renderApp("/grammar/instrumental");

  fireEvent.click(screen.getByRole("button", { name: "Idem sa autobusom." }));

  const saved = JSON.parse(localStorage.getItem(PROGRESS_STORAGE_KEY));
  expect(saved.grammarMistakes).toEqual([
    expect.objectContaining({
      lessonId: "instrumental",
      exerciseId: "instrumental-transport-choice",
      reviewEligible: true,
    }),
  ]);
  expect(saved.recentMistakes).toEqual([]);
});
