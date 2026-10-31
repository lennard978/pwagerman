import React from "react";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { COURSE_CONFIG, STORAGE_CONFIG, TARGET_LANGUAGE, TTS_CONFIG } from "./course";
import { B1_EXAM_CONFIG } from "./exam";
import { LanguageProvider } from "../i18n/LanguageProvider";
import { ProgressProvider } from "../i18n/ProgressProvider";
import Nav from "../components/nav/Nav";
import { Learn } from "../screen/learn/Learn";
import { Practice } from "../screen/practice/Practice";
import { Exam } from "../screen/exam/Exam";
import { createDefaultProgress, PROGRESS_STORAGE_KEY } from "../data/learningProgress";
import { loadMyWords, MY_WORDS_STORAGE_KEY } from "../data/myWords";
import { GermanCurriculum } from "../data/vocabulary/curriculum";
import { resolveContentByRouteId } from "../data/contentSelection";

const renderUi = (children, route = "/") => render(
  <LanguageProvider><ProgressProvider><MemoryRouter initialEntries={[route]}>{children}</MemoryRouter></ProgressProvider></LanguageProvider>
);

test("central course config separates English UI, German content, and German speech", () => {
  expect(COURSE_CONFIG).toEqual(expect.objectContaining({
    id: "german-b1",
    sourceLanguage: "en",
    targetLanguage: "de-DE",
    level: "B1",
    productName: "German B1",
    descriptor: "Exam Preparation",
    provider: "Asenda Studio",
    examReference: "Goethe-Zertifikat B1",
    officialAffiliation: false,
  }));
  expect(COURSE_CONFIG.uiLanguage).toBe("en");
  expect(TARGET_LANGUAGE).toBe("de-DE");
  expect(TTS_CONFIG.defaultVoice).toBe("de-DE-Chirp3-HD-Aoede");
});

test("German storage has a fresh namespace and ignores preserved legacy keys", () => {
  expect(Object.values(STORAGE_CONFIG).every((key) => key.startsWith("asenda.german-b1") || key === "asenda-german-b1")).toBe(true);
  expect(PROGRESS_STORAGE_KEY).toBe("asenda.german-b1.learningProgress.v1");
  expect(MY_WORDS_STORAGE_KEY).toBe("asenda.german-b1.myWords.v1");
  const legacyStorage = {
    getItem: (key) => key.startsWith("serbian-a1") || key === "pwagerman.language"
      ? JSON.stringify([{ id: "legacy", source: "old", target: "data", createdAt: "2026-01-01" }])
      : null,
  };
  expect(loadMyWords(legacyStorage)).toEqual([]);
  expect(createDefaultProgress(legacyStorage).onboardingComplete).toBe(false);
});

test("navigation exposes Home, Learn, Practice, and Exam", () => {
  renderUi(<Nav />);
  ["Home", "Learn", "Practice", "Exam"].forEach((name) => {
    expect(screen.getByRole("link", { name })).toBeTruthy();
  });
  expect(screen.queryByRole("link", { name: "My Words" })).toBeNull();
});

test("Learn nests My Words and Practice calls the letter-tile mode Spelling", () => {
  const { unmount } = renderUi(<Learn />, "/learn");
  expect(screen.getByRole("link", { name: /My Words/ }).getAttribute("href")).toBe("/learn/my-words");
  unmount();
  renderUi(<Practice />, "/practice");
  expect(screen.getByRole("link", { name: /Spelling/ }).getAttribute("href")).toBe("/practice/spelling");
  expect(screen.getByRole("link", { name: /Writing Phrase Bank/ }).getAttribute("href")).toBe("/practice/writing-phrases");
});

test("Exam exposes independent modules, verified timing, scoring, and disclaimer", () => {
  renderUi(<Exam />, "/exam");
  ["Reading", "Listening", "Writing", "Speaking", "Full Mock B1"].forEach((name) => {
    expect(screen.getByRole("link", { name: new RegExp(`^${name}\\b`) })).toBeTruthy();
  });
  expect(screen.getByText("Independent preparation tool. Not affiliated with or endorsed by the Goethe-Institut.")).toBeTruthy();
  expect(B1_EXAM_CONFIG.reading).toEqual(expect.objectContaining({ durationMinutes: 65, parts: 5 }));
  expect(B1_EXAM_CONFIG.listening).toEqual(expect.objectContaining({ durationMinutes: 40, parts: 4 }));
  expect(B1_EXAM_CONFIG.writing).toEqual(expect.objectContaining({ durationMinutes: 60, parts: 3 }));
  expect(B1_EXAM_CONFIG.speaking).toEqual(expect.objectContaining({ pairDurationMinutes: 15, preparationMinutes: 15, parts: 3 }));
  expect(B1_EXAM_CONFIG.reading.scoring).toEqual(expect.objectContaining({ maximumPoints: 100, passThreshold: 60 }));
  expect(B1_EXAM_CONFIG).not.toHaveProperty("overallPass");
});

test("stable content slugs resolve without depending on array position", () => {
  expect(resolveContentByRouteId(GermanCurriculum, "travel-transport")).toBe(
    GermanCurriculum.find(({ id }) => id === "travel-transport")
  );
  expect(resolveContentByRouteId(GermanCurriculum, "media-communication")).toBe(
    GermanCurriculum.find(({ id }) => id === "media-communication")
  );
  expect(GermanCurriculum.every((lesson) => !/^\d+$/.test(lesson.id))).toBe(true);
});
