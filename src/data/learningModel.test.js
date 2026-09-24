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
import { Test1, Test2, Test3, Test4, Test5, Test6, Tests } from "./test";
import { Cards } from "../screen/cards/Cards";
import { ChooseLesson } from "../screen/lesson/ChooseLesson";
import { Lesson } from "../screen/lesson/Lesson";
import { Pair } from "../screen/pair/Pair";
import { Quiz } from "../screen/quiz/Quiz";
import { Test } from "../screen/test/Test";
import { ChooseTest } from "../screen/test/ChooseTest";
import { Write } from "../screen/write/Write";
import SoundButton, { selectBestVoice } from "../components/SoundButton";
import { normalizeSpeechLanguage } from "../services/tts/ttsProvider";
import { LanguageProvider } from "../i18n/LanguageProvider";
import { Curriculum } from "./data";
import { createBoundedRound, EXERCISE_ROUND_LIMITS } from "./exerciseRounds";

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

test("built-in vocabulary exposes scalable A1 metadata without changing stable IDs", () => {
  const allItems = Curriculum.flatMap((lesson) => lesson.items);
  expect(allItems).toHaveLength(180);
  expect(Curriculum.slice(6).flatMap((lesson) => lesson.items)).toHaveLength(60);
  Curriculum.forEach((lesson) => {
    lesson.items.forEach((item, index) => {
      expect(item).toEqual(expect.objectContaining({
        id: `${lesson.id}-word-${index + 1}`,
        categoryId: lesson.id,
        level: "A1",
        sourceType: "supplementary",
        source: expect.any(String),
        target: expect.any(String),
      }));
      expect(["verified", "supplementary"]).toContain(item.sourceType);
      if (item.example) {
        expect(item.exampleTranslation).toEqual(expect.any(String));
        expect(item.exampleTranslation.length).toBeGreaterThan(0);
      }
    });
  });
  expect(new Set(allItems.map((item) => item.id)).size).toBe(allItems.length);
  Curriculum.slice(0, 6).forEach((lesson) => {
    expect(lesson.items).toHaveLength(20);
    lesson.items.forEach((item, index) => {
      expect(item.id).toBe(`${lesson.id}-word-${index + 1}`);
    });
  });
  Curriculum.slice(6).flatMap((lesson) => lesson.items).forEach((item) => {
    expect(item.partOfSpeech).toEqual(expect.any(String));
  });
});

test("has no duplicate vocabulary pairs across lessons", () => {
  const pairs = Curriculum.flatMap((lesson) =>
    lesson.items.map((item) => `${item.source}\u0000${item.target}`)
  );

  expect(new Set(pairs).size).toBe(pairs.length);
});

test("exercise rounds stay bounded as vocabulary categories grow", () => {
  const items = Curriculum.flatMap((lesson) => lesson.items);
  Object.values(EXERCISE_ROUND_LIMITS).forEach((limit) => {
    expect(createBoundedRound(items, limit, () => 0.5)).toHaveLength(limit);
  });
  expect(Math.max(...Tests.map((testSet) => testSet.questions.length)))
    .toBe(EXERCISE_ROUND_LIMITS.test);
});

test("lesson chooser exposes all six lessons", () => {
  const lessons = [Lesson1, Lesson2, Lesson3, Lesson4, Lesson5, Lesson6];

  renderWithLanguage(
    <MemoryRouter>
      <ChooseLesson data={lessons} />
    </MemoryRouter>
  );

  expect(screen.getAllByRole("link")).toHaveLength(7);
  expect(screen.getByRole("link", { name: /Grammar/ })).toBeTruthy();
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
  expect(screen.queryByTestId("write-answer-space")).toBeNull();
  expect(screen.queryByTestId("write-pool-space")).toBeNull();
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

test("Write changes incorrect answers to correct and speaks once", () => {
  mockSpeak.mockClear();
  renderWithLanguage(
    <MemoryRouter initialEntries={["/write/0"]}>
      <Routes>
        <Route path="/write/:userId" element={<Write data={[{ items: [{ source: "house", target: "kuća" }] }]} />} />
      </Routes>
    </MemoryRouter>
  );

  ["u", "k", "ć", "a"].forEach((letter) => fireEvent.click(screen.getByRole("button", { name: letter })));
  expect(screen.getAllByText(/^[ukća]$/).filter((tile) => tile.getAttribute("data-filled") === "true")[0].getAttribute("data-result-state")).toBe("incorrect");
  expect(screen.getByRole("status").textContent).toBe("Not quite");
  expect(mockSpeak).not.toHaveBeenCalled();

  screen.getAllByText(/^[ukća]$/).filter((tile) => tile.getAttribute("data-filled") === "true").forEach((tile) => fireEvent.click(tile));
  ["k", "u", "ć", "a"].forEach((letter) => fireEvent.click(screen.getByRole("button", { name: letter })));
  expect(screen.getAllByText(/^[ukća]$/).filter((tile) => tile.getAttribute("data-filled") === "true")[0].getAttribute("data-result-state")).toBe("correct");
  expect(screen.getByRole("status").textContent).toBe("Correct");
  expect(mockSpeak).toHaveBeenCalledTimes(1);
});

test("Write preserves a non-interactive word-boundary spacer in both rows", () => {
  renderWithLanguage(
    <MemoryRouter initialEntries={["/write/0"]}>
      <Routes>
        <Route path="/write/:userId" element={<Write data={[{ items: [{ source: "I love you", target: "volim te" }] }]} />} />
      </Routes>
    </MemoryRouter>
  );

  const answerSpace = screen.getByTestId("write-answer-space");
  const poolSpace = screen.getByTestId("write-pool-space");
  expect(answerSpace.closest("button")).toBeNull();
  expect(poolSpace.closest("button")).toBeNull();
  expect(screen.getAllByRole("button", { name: "?" })).toHaveLength(7);
});

test("Write keeps duplicate letter IDs stable when returning an exact tile", () => {
  renderWithLanguage(
    <MemoryRouter initialEntries={["/write/0"]}>
      <Routes>
        <Route path="/write/:userId" element={<Write data={[{ items: [{ source: "mom loves", target: "mama voli" }] }]} />} />
      </Routes>
    </MemoryRouter>
  );

  const duplicateTiles = screen.getAllByRole("button", { name: "a" });
  const tileIds = duplicateTiles.map((tile) => tile.getAttribute("data-tile-id"));
  expect(new Set(tileIds).size).toBe(2);

  fireEvent.click(duplicateTiles[0]);
  const filledTile = document.querySelector(`[data-filled="true"][data-tile-id="${tileIds[0]}"]`);
  expect(filledTile).toBeTruthy();
  fireEvent.click(filledTile);
  expect(document.querySelector(`[data-filled="false"][data-tile-id="${tileIds[0]}"]`)).toBeTruthy();
});

test("Write preserves Serbian diacritics as individual letter tiles", () => {
  renderWithLanguage(
    <MemoryRouter initialEntries={["/write/0"]}>
      <Routes>
        <Route path="/write/:userId" element={<Write data={[{ items: [{ source: "letters", target: "čćšžđ" }] }]} />} />
      </Routes>
    </MemoryRouter>
  );

  ["č", "ć", "š", "ž", "đ"].forEach((letter) => {
    expect(screen.getByRole("button", { name: letter })).toBeTruthy();
  });
});

test("Write evaluates the exact target with automatic spaces and speaks once", () => {
  mockSpeak.mockClear();
  renderWithLanguage(
    <MemoryRouter initialEntries={["/write/0"]}>
      <Routes>
        <Route path="/write/:userId" element={<Write data={[{ items: [{ source: "I love you", target: "volim te" }] }]} />} />
      </Routes>
    </MemoryRouter>
  );

  "volimte".split("").forEach((letter) => {
    const poolTile = screen.getAllByRole("button", { name: letter })
      .find((tile) => tile.getAttribute("data-filled") === "false");
    fireEvent.click(poolTile);
  });

  expect(screen.getAllByRole("button", { name: /^[volimte]$/ })[0].getAttribute("data-result-state")).toBe("correct");
  expect(screen.getByTestId("write-answer-space")).toBeTruthy();
  expect(mockSpeak).toHaveBeenCalledTimes(1);
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

test("Pair completion links back to the existing selector", () => {
  renderWithLanguage(
    <MemoryRouter initialEntries={["/pair/0"]}>
      <Routes>
        <Route path="/pair/:userId" element={<Pair data={[{ items: [
          { source: "house", target: "kuća" },
          { source: "water", target: "voda" },
        ] }]} />} />
      </Routes>
    </MemoryRouter>
  );

  fireEvent.click(screen.getByRole("button", { name: "house" }));
  fireEvent.click(screen.getByRole("button", { name: "kuća" }));
  fireEvent.click(screen.getByRole("button", { name: "water" }));
  fireEvent.click(screen.getByRole("button", { name: "voda" }));

  expect(screen.getByText("All pairs matched")).toBeTruthy();
  expect(screen.getByRole("link", { name: "Back to Pair" }).getAttribute("href")).toBe("/choosepair");
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

test("Cards speak once each time they flip to Serbian", () => {
  mockSpeak.mockClear();
  renderWithLanguage(
    <MemoryRouter initialEntries={["/cards/0"]}>
      <Routes>
        <Route path="/cards/:userId" element={<Cards data={[{ items: [{ source: "house", target: "kuća" }] }]} />} />
      </Routes>
    </MemoryRouter>
  );

  fireEvent.click(screen.getByRole("button", { name: "Show Serbian translation" }));
  expect(mockSpeak).toHaveBeenCalledTimes(1);
  fireEvent.click(screen.getByRole("button", { name: "Show English word" }));
  expect(mockSpeak).toHaveBeenCalledTimes(1);
  fireEvent.click(screen.getByRole("button", { name: "Show Serbian translation" }));
  expect(mockSpeak).toHaveBeenCalledTimes(2);
  expect(screen.getByRole("link", { name: "Back to Cards" }).getAttribute("href")).toBe("/choosecards");
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

test("Test speaker pronounces without selecting the answer", () => {
  mockSpeak.mockClear();
  renderWithLanguage(
    <MemoryRouter initialEntries={["/test/0"]}>
      <Routes>
        <Route path="/test/:userId" element={<Test data={[[{ prompt: "house", options: ["kuća", "voda"], answer: "kuća" }]]} />} />
      </Routes>
    </MemoryRouter>
  );

  fireEvent.click(screen.getByRole("button", { name: "Hear Serbian pronunciation: kuća" }));
  expect(mockSpeak).toHaveBeenCalledTimes(1);
  expect(screen.getByRole("button", { name: "Next" }).disabled).toBe(true);
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
  expect(screen.getAllByRole("button")).toHaveLength(8);
  ["kuća", "voda", "stolica", "grad"].forEach((answer) => {
    fireEvent.click(screen.getAllByRole("button", { name: answer })[0]);
    fireEvent.click(screen.getByRole("button", { name: "Next" }));
  });

  expect(screen.getByText("Quiz complete")).toBeTruthy();
  expect(screen.getByRole("link", { name: "Back to Quiz" }).getAttribute("href")).toBe("/choosequiz");
});

test("Quiz uses answer colors without an extra correctness label", () => {
  renderWithLanguage(
    <MemoryRouter initialEntries={["/quiz/0"]}>
      <Routes>
        <Route
          path="/quiz/:userId"
          element={<Quiz data={[{ items: [{ source: "house", target: "kuća" }] }]} />}
        />
      </Routes>
    </MemoryRouter>
  );

  fireEvent.click(screen.getByRole("button", { name: "kuća" }));

  expect(document.querySelector('[data-status="correct"]')).toBeTruthy();
  expect(screen.queryByText("Correct")).toBeNull();
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
  expect(screen.queryByText("Not quite")).toBeNull();
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
  expect(document.querySelectorAll('[data-status="correct"]')).toHaveLength(1);
});

test("Quiz speaker does not select and results review every answer", () => {
  mockSpeak.mockClear();
  const items = [
    { source: "house", target: "kuća" },
    { source: "water", target: "voda" },
    { source: "chair", target: "stolica" },
    { source: "city", target: "grad" },
  ];
  renderWithLanguage(
    <MemoryRouter initialEntries={["/quiz/0"]}>
      <Routes>
        <Route path="/quiz/:userId" element={<Quiz data={[{ items }]} />} />
      </Routes>
    </MemoryRouter>
  );

  const firstPrompt = screen.getByText(/^(house|water|chair|city)$/).textContent;
  const firstTarget = items.find((item) => item.source === firstPrompt).target;
  fireEvent.click(screen.getByRole("button", { name: `Hear Serbian pronunciation: ${firstTarget}` }));
  expect(mockSpeak).toHaveBeenCalledTimes(1);
  expect(screen.queryByRole("button", { name: "Next" })).toBeNull();

  for (let index = 0; index < items.length; index += 1) {
    const prompt = screen.getByText(/^(house|water|chair|city)$/).textContent;
    const target = items.find((item) => item.source === prompt).target;
    fireEvent.click(screen.getByRole("button", { name: target }));
    fireEvent.click(screen.getByRole("button", { name: "Next" }));
  }
  expect(document.querySelectorAll('[data-status="correct"]')).toHaveLength(items.length);
});

test("active test data contains bounded questions for every curriculum category", () => {
  const testSets = [Test1, Test2, Test3, Test4, Test5, Test6];

  expect(Tests.slice(0, 6)).toEqual(testSets);
  expect(Tests).toHaveLength(Curriculum.length);
  Tests.forEach((testSet, index) => {
    const lesson = Curriculum[index];
    const lessonTargets = lesson.items.map((item) => item.target);
    expect(testSet.titleKey).toBe(lesson.titleKey);
    expect(testSet.descriptionKey).toBe(lesson.descriptionKey);
    expect(testSet.category).toBe(lesson.category);
    expect(testSet.questions.length).toBeLessThanOrEqual(EXERCISE_ROUND_LIMITS.test);
    testSet.questions.forEach((question) => {
      expect(question.options).not.toEqual(["der", "die", "das"]);
      expect(question.prompt).toContain("Serbian");
      expect(lessonTargets).toContain(question.answer);
      question.options.forEach((option) => expect(lessonTargets).toContain(option));
    });
  });
});

test("Test chooser renders every bounded curriculum test", () => {
  renderWithLanguage(
    <MemoryRouter>
      <ChooseTest data={Tests} />
    </MemoryRouter>
  );

  expect(screen.getAllByRole("link")).toHaveLength(15);
  expect(screen.getByText("Greetings & Introductions")).toBeTruthy();
  expect(screen.getByText("Travel & Places")).toBeTruthy();
  expect(screen.getByText("Common Verbs")).toBeTruthy();
  expect(screen.getByText("Learn essential greetings and simple introductions.")).toBeTruthy();
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

test.each([
  ["sr", "sr-RS"],
  ["sr-Latn", "sr-RS"],
  ["sr-RS", "sr-RS"],
])("normalizes Serbian locale %s to %s", (input, expected) => {
  expect(normalizeSpeechLanguage(input)).toBe(expected);
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

  fireEvent.click(screen.getByRole("button", {
    name: "Hear Serbian pronunciation: kuća",
  }));

  expect(mockSpeak).toHaveBeenCalledWith({
    rate: 0.92,
    pitch: 1,
    volume: 1,
    voice: { lang: "sr-RS" },
    text: "kuća",
  });
});
