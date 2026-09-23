import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes, useNavigate } from "react-router-dom";
import {
  Lesson1,
  Lesson2,
  Lesson3,
  Lesson4,
  Lesson5,
  Lesson6,
} from "./data";
import { Test1, Test2, Test3 } from "./test";
import { Cards } from "../screen/cards/Cards";
import { ChooseLesson } from "../screen/lesson/ChooseLesson";
import { Lesson } from "../screen/lesson/Lesson";
import { Pair } from "../screen/pair/Pair";
import { Quiz } from "../screen/quiz/Quiz";
import { Test } from "../screen/test/Test";
import { Write } from "../screen/write/Write";
import SoundButton, { selectBestVoice } from "../components/SoundButton";
import { LanguageProvider } from "../i18n/LanguageProvider";

const mockSpeak = jest.fn();

jest.mock("react-speech-kit", () => ({
  useSpeechSynthesis: () => ({
    speak: mockSpeak,
    voices: [{ lang: "sr-RS" }, { lang: "en-US" }],
  }),
}));

const renderWithLanguage = (children) =>
  render(<LanguageProvider>{children}</LanguageProvider>);

const CardRouteSwitch = () => {
  const navigate = useNavigate();
  return <button onClick={() => navigate("/cards/1")}>Switch lesson</button>;
};

test("lesson data directly uses source and target fields", () => {
  [Lesson1, Lesson2, Lesson3, Lesson4, Lesson5, Lesson6].forEach((lesson) => {
    lesson.items.forEach((item) => {
      expect(item.source).toEqual(expect.any(String));
      expect(item.target).toEqual(expect.any(String));
      expect(item.german).toBeUndefined();
      expect(item.english).toBeUndefined();
      expect(item.gender).toBeUndefined();
    });
  });

  expect(Lesson3.items).toContainEqual({ source: "house", target: "kuća" });
  expect(Lesson2.items).toContainEqual({ source: "mother", target: "majka" });
  expect(Lesson4.items).toContainEqual({ source: "water", target: "voda" });
});

test("defines six structured lessons with localized metadata", () => {
  const lessons = [Lesson1, Lesson2, Lesson3, Lesson4, Lesson5, Lesson6];
  const ids = lessons.map((lesson) => lesson.id);

  expect(new Set(ids).size).toBe(6);
  lessons.forEach((lesson) => {
    expect(lesson.titleKey).toMatch(/^lessons\./);
    expect(lesson.descriptionKey).toMatch(/^lessons\./);
    expect(lesson.category).toEqual(expect.any(String));
    expect(lesson.items.length).toBeGreaterThanOrEqual(18);
  });
});

test("has no duplicate vocabulary pairs across lessons", () => {
  const lessons = [Lesson1, Lesson2, Lesson3, Lesson4, Lesson5, Lesson6];
  const pairs = lessons.flatMap((lesson) =>
    lesson.items.map((item) => `${item.source}\u0000${item.target}`)
  );

  expect(new Set(pairs).size).toBe(pairs.length);
});

test("lesson chooser exposes all six lessons", () => {
  const lessons = [Lesson1, Lesson2, Lesson3, Lesson4, Lesson5, Lesson6];

  renderWithLanguage(
    <MemoryRouter>
      <ChooseLesson data={lessons} />
    </MemoryRouter>
  );

  expect(screen.getAllByRole("link")).toHaveLength(6);
  expect(screen.getByText("Greetings & Introductions")).toBeTruthy();
  expect(screen.getByText("Travel & Places")).toBeTruthy();
});

test("Lessons 4 through 6 render in the shared Lesson engine", () => {
  [Lesson4, Lesson5, Lesson6].forEach((lesson) => {
    const rendered = renderWithLanguage(
      <MemoryRouter initialEntries={["/lesson/0"]}>
        <Routes>
          <Route
            path="/lesson/:userId"
            element={<Lesson data={[lesson]} />}
          />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText(lesson.items[0].source)).toBeTruthy();
    rendered.unmount();
  });
});

test("Write renders an English prompt and Serbian answer", () => {
  renderWithLanguage(
    <MemoryRouter initialEntries={["/write/0"]}>
      <Routes>
        <Route
          path="/write/:userId"
          element={
            <Write
              data={[{ items: [{ source: "house", target: "kuća" }] }]}
            />
          }
        />
      </Routes>
    </MemoryRouter>
  );

  expect(screen.getByText(/^(house|water|chair|city)$/)).toBeTruthy();
  expect(screen.getByText("ć")).toBeTruthy();
});

test("Write filled answer tiles expose an explicit readable state", () => {
  renderWithLanguage(
    <MemoryRouter initialEntries={["/write/0"]}>
      <Routes>
        <Route
          path="/write/:userId"
          element={<Write data={[{ items: [{ source: "house", target: "kuća" }] }]} />}
        />
      </Routes>
    </MemoryRouter>
  );

  fireEvent.click(screen.getByText("k"));
  expect(screen.getByText("k").getAttribute("data-filled")).toBe("true");
});

test("Pair renders English source and Serbian target values", () => {
  renderWithLanguage(
    <MemoryRouter initialEntries={["/pair/0"]}>
      <Routes>
        <Route
          path="/pair/:userId"
          element={
            <Pair data={[{ items: [
              { source: "house", target: "kuća" },
              { source: "water", target: "voda" },
            ] }]} />
          }
        />
      </Routes>
    </MemoryRouter>
  );

  expect(screen.getByRole("button", { name: "house" })).toBeTruthy();
  expect(screen.getAllByRole("button", { name: "kuća" })[0]).toBeTruthy();
});

test("Pair shows no more than ten vocabulary pairs per round", () => {
  const items = Array.from({ length: 12 }, (_, index) => ({
    source: `word ${index}`,
    target: `reč ${index}`,
  }));

  renderWithLanguage(
    <MemoryRouter initialEntries={["/pair/0"]}>
      <Routes>
        <Route path="/pair/:userId" element={<Pair data={[{ items }]} />} />
      </Routes>
    </MemoryRouter>
  );

  expect(screen.getAllByRole("button")).toHaveLength(20);
});

test("Cards render English on the front and Serbian on the back", () => {
  renderWithLanguage(
    <MemoryRouter initialEntries={["/cards/0"]}>
      <Routes>
        <Route
          path="/cards/:userId"
          element={
            <Cards data={[{ items: [{ source: "house", target: "kuća" }] }]} />
          }
        />
      </Routes>
    </MemoryRouter>
  );

  expect(screen.getByText(/^(house|water|chair|city)$/)).toBeTruthy();
  expect(screen.getByText("kuća")).toBeTruthy();
});

test("Cards update when navigating to another lesson", () => {
  const lessons = [
    { items: [{ source: "house", target: "kuća" }] },
    { items: [{ source: "car", target: "auto" }] },
  ];

  renderWithLanguage(
    <MemoryRouter initialEntries={["/cards/0"]}>
      <Routes>
        <Route path="/cards/:userId" element={<Cards data={lessons} />} />
      </Routes>
      <CardRouteSwitch />
    </MemoryRouter>
  );

  fireEvent.click(screen.getByRole("button", { name: "Switch lesson" }));

  expect(screen.getByText("car")).toBeTruthy();
  expect(screen.queryByText("house")).toBeNull();
});

test("Test receives multiple-choice options from generic question data", () => {
  renderWithLanguage(
    <MemoryRouter initialEntries={["/test/0"]}>
      <Routes>
        <Route
          path="/test/:userId"
          element={
            <Test
              data={[
                [
                  {
                    prompt: "house",
                    options: ["kuća", "voda", "stolica"],
                    answer: "kuća",
                  },
                ],
              ]}
            />
          }
        />
      </Routes>
    </MemoryRouter>
  );

  expect(screen.getByText("house")).toBeTruthy();
  expect(screen.getByTestId("test-exercise-content")).toBeTruthy();
  ["kuća", "voda", "stolica"].forEach((option) => {
    expect(screen.getByRole("button", { name: option })).toBeTruthy();
  });
  expect(screen.queryByRole("button", { name: "English" })).toBeNull();
});

test("Quiz presents an English prompt with Serbian choices and completes", () => {
  renderWithLanguage(
    <MemoryRouter initialEntries={["/quiz/0"]}>
      <Routes>
        <Route
          path="/quiz/:userId"
          element={
            <Quiz
              data={[
                {
                  items: [
                    { source: "house", target: "kuća" },
                    { source: "water", target: "voda" },
                    { source: "chair", target: "stolica" },
                    { source: "city", target: "grad" },
                  ],
                },
              ]}
            />
          }
        />
      </Routes>
    </MemoryRouter>
  );

  expect(screen.getByText(/^(house|water|chair|city)$/)).toBeTruthy();
  expect(screen.getAllByRole("button", { name: "kuća" })[0]).toBeTruthy();
  expect(screen.getAllByRole("button")).toHaveLength(4);
  ["kuća", "voda", "stolica", "grad"].forEach((answer) => {
    fireEvent.click(screen.getAllByRole("button", { name: answer })[0]);
    fireEvent.click(screen.getByRole("button", { name: "Next" }));
  });
  expect(screen.getByText("Quiz complete")).toBeTruthy();
  expect(screen.getByRole("link", { name: "Back to Quiz" }).getAttribute("href")).toBe("/choosequiz");
});

test("Test results review the learner answer and correct answer", () => {
  renderWithLanguage(
    <MemoryRouter initialEntries={["/test/0"]}>
      <Routes>
        <Route
          path="/test/:userId"
          element={<Test data={[[{ prompt: '"house" in Serbian is:', options: ["kuća", "voda"], answer: "kuća" }]]} />}
        />
      </Routes>
    </MemoryRouter>
  );

  fireEvent.click(screen.getByRole("button", { name: "voda" }));
  fireEvent.click(screen.getByRole("button", { name: "Next" }));

  expect(screen.getByText("Test complete")).toBeTruthy();
  expect(screen.getByText("Your answer: voda")).toBeTruthy();
  expect(screen.getByText("Correct answer: kuća")).toBeTruthy();
  expect(screen.getByRole("button", { name: "Retry Test" })).toBeTruthy();
});

test("Test perfect result reports no mistakes", () => {
  renderWithLanguage(
    <MemoryRouter initialEntries={["/test/0"]}>
      <Routes>
        <Route
          path="/test/:userId"
          element={<Test data={[[{ prompt: '"house" in Serbian is:', options: ["kuća", "voda"], answer: "kuća" }]]} />}
        />
      </Routes>
    </MemoryRouter>
  );

  fireEvent.click(screen.getAllByRole("button", { name: "kuća" })[0]);
  fireEvent.click(screen.getByRole("button", { name: "Next" }));

  expect(screen.getByText("Perfect - no mistakes.")).toBeTruthy();
});

test("active test data contains Serbian-learning questions", () => {
  [Test1, Test2, Test3].forEach((testSet) => {
    testSet.forEach((question) => {
      expect(question.options).not.toEqual(["der", "die", "das"]);
      expect(question.prompt).toContain("Serbian");
      expect(question.answer).toEqual(expect.any(String));
    });
  });
});

test("SoundButton selects a Serbian voice from its explicit content language", () => {
  mockSpeak.mockClear();
  render(<SoundButton text="kuća" lang="sr">Kuća</SoundButton>);

  fireEvent.click(screen.getByText("Kuća"));

  expect(mockSpeak).toHaveBeenCalledWith({
    rate: 0.92,
    pitch: 1,
    volume: 1,
    voice: { lang: "sr-RS" },
    text: "kuća",
  });
});

test("Serbian voice selection prefers exact local sr-RS voices", () => {
  const voice = selectBestVoice([
    { name: "Serbian Basic", lang: "sr", localService: false },
    { name: "Serbian Natural", lang: "sr-RS", localService: true },
  ], "sr");

  expect(voice.name).toBe("Serbian Natural");
});

test("Serbian speech falls back to another sr voice or browser default", () => {
  expect(selectBestVoice([{ name: "Serbian", lang: "sr-Latn" }], "sr").lang).toBe("sr-Latn");
  expect(selectBestVoice([{ name: "English", lang: "en-US" }], "sr")).toBeUndefined();
});

test("Lesson speaks the Serbian target", () => {
  mockSpeak.mockClear();
  renderWithLanguage(
    <MemoryRouter initialEntries={["/lesson/0"]}>
      <Routes>
        <Route
          path="/lesson/:userId"
          element={
            <Lesson data={[{ items: [{ source: "house", target: "kuća" }] }]} />
          }
        />
      </Routes>
    </MemoryRouter>
  );

  fireEvent.click(screen.getByText("kuća"));

  expect(mockSpeak).toHaveBeenCalledWith({
    rate: 0.92,
    pitch: 1,
    volume: 1,
    voice: { lang: "sr-RS" },
    text: "kuća",
  });
});
