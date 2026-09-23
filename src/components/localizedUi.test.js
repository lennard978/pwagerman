import React from "react";
import { render, screen, act, fireEvent } from "@testing-library/react";
import { MemoryRouter, Route, Routes, useLocation } from "react-router-dom";
import Nav from "./nav/Nav";
import { NoMatch } from "./nav/NoMatch";
import { ChooseLesson } from "../screen/lesson/ChooseLesson";
import { Home } from "../screen/home/Home";
import { Write } from "../screen/write/Write";
import {
  LANGUAGE_STORAGE_KEY,
  LanguageProvider,
  useLanguage,
} from "../i18n/LanguageProvider";

const lessonData = [
  {
    id: "lesson-1",
    titleKey: "lessons.greetings.title",
    descriptionKey: "lessons.greetings.description",
    category: "greetings",
    items: [{ source: "house", target: "kuća" }],
  },
];

const renderWithLanguage = (children, language) => {
  window.localStorage.setItem(LANGUAGE_STORAGE_KEY, language);
  return render(<LanguageProvider>{children}</LanguageProvider>);
};

const RouteLanguageProbe = () => {
  const { setLanguage } = useLanguage();
  const location = useLocation();

  return (
    <>
      <span data-testid="current-path">{location.pathname}</span>
      <button onClick={() => setLanguage("sr-Latn")}>Change language</button>
    </>
  );
};

beforeEach(() => {
  window.localStorage.clear();
});

test("renders all active navigation labels in English", () => {
  renderWithLanguage(
    <MemoryRouter>
      <Nav />
    </MemoryRouter>,
    "en"
  );

  ["Home", "Lesson", "Pair", "Write", "Cards", "Test", "Quiz"].forEach(
    (label) => {
      expect(screen.getByRole("link", { name: label })).toBeTruthy();
    }
  );
});

test("shows the English language selector with the current language selected", () => {
  renderWithLanguage(
    <MemoryRouter>
      <Nav />
    </MemoryRouter>,
    "en"
  );

  const selector = screen.getByRole("combobox", { name: "Language" });
  expect(selector.value).toBe("en");
  expect(screen.getByRole("option", { name: "Srpski" })).toBeTruthy();
  expect(screen.getByRole("combobox", { name: "Language" }).closest("nav")).toBeNull();
  expect(screen.getAllByRole("link")).toHaveLength(7);
});

test("renders all active navigation labels in Serbian Latin", () => {
  renderWithLanguage(
    <MemoryRouter>
      <Nav />
    </MemoryRouter>,
    "sr-Latn"
  );

  ["Početna", "Lekcija", "Poveži", "Pisanje", "Kartice", "Test", "Kviz"].forEach(
    (label) => {
      expect(screen.getByRole("link", { name: label })).toBeTruthy();
    }
  );
});

test("switches between Serbian and English through the selector", () => {
  renderWithLanguage(
    <MemoryRouter>
      <Nav />
    </MemoryRouter>,
    "en"
  );

  const selector = screen.getByRole("combobox", { name: "Language" });
  fireEvent.change(selector, { target: { value: "sr-Latn" } });

  expect(selector.value).toBe("sr-Latn");
  expect(screen.getByRole("link", { name: "Početna" })).toBeTruthy();
  expect(window.localStorage.getItem(LANGUAGE_STORAGE_KEY)).toBe("sr-Latn");
  expect(screen.getByRole("combobox", { name: "Jezik" })).toBeTruthy();

  fireEvent.change(selector, { target: { value: "en" } });

  expect(selector.value).toBe("en");
  expect(screen.getByRole("link", { name: "Home" })).toBeTruthy();
  expect(window.localStorage.getItem(LANGUAGE_STORAGE_KEY)).toBe("en");
});

test("localizes lesson metadata without changing vocabulary", () => {
  renderWithLanguage(
    <MemoryRouter>
      <Nav />
      <ChooseLesson data={lessonData} />
      <span data-testid="lesson-source">{lessonData[0].items[0].source}</span>
    </MemoryRouter>,
    "en"
  );

  expect(screen.getByText("Greetings & Introductions")).toBeTruthy();
  expect(screen.getByTestId("lesson-source").textContent).toBe("house");

  fireEvent.change(screen.getByRole("combobox", { name: "Language" }), {
    target: { value: "sr-Latn" },
  });

  expect(screen.getByText("Pozdravi i upoznavanje")).toBeTruthy();
  expect(screen.getByTestId("lesson-source").textContent).toBe("house");
});

test("localizes an exercise action button", () => {
  renderWithLanguage(
    <MemoryRouter initialEntries={["/choosewrite/0"]}>
      <Routes>
        <Route path="/choosewrite/:userId" element={<Write data={lessonData} />} />
      </Routes>
    </MemoryRouter>,
    "sr-Latn"
  );

  expect(screen.getByRole("button", { name: "Dalje" })).toBeTruthy();
});

test("localizes the not-found screen", () => {
  renderWithLanguage(<NoMatch />, "sr-Latn");

  expect(screen.getByText("Stranica nije pronađena (404)")).toBeTruthy();
});

test("changing language does not change the current route", () => {
  const documentRoot = document.documentElement;

  renderWithLanguage(
    <MemoryRouter initialEntries={["/choosewrite/0"]}>
      <Nav />
      <RouteLanguageProbe />
    </MemoryRouter>,
    "en"
  );

  act(() => {
    fireEvent.change(screen.getByRole("combobox", { name: "Language" }), {
      target: { value: "sr-Latn" },
    });
  });

  expect(screen.getByTestId("current-path").textContent).toBe("/choosewrite/0");
  expect(document.documentElement).toBe(documentRoot);
});

test("uses browser detection after an invalid persisted language", () => {
  window.localStorage.setItem(LANGUAGE_STORAGE_KEY, "de");
  Object.defineProperty(window.navigator, "language", {
    configurable: true,
    value: "sr-RS",
  });

  render(
    <LanguageProvider>
      <MemoryRouter>
        <Nav />
      </MemoryRouter>
    </LanguageProvider>
  );

  expect(screen.getByRole("combobox", { name: "Jezik" }).value).toBe("sr-Latn");
});

test("renders Serbian A1 branding in English UI", () => {
  renderWithLanguage(<MemoryRouter><Home /></MemoryRouter>, "en");

  expect(screen.getByText("Serbian A1")).toBeTruthy();
  expect(screen.getByText("Learn practical Serbian step by step.")).toBeTruthy();
  expect(document.title).toBe("Serbian A1");
});

test("switches visible branding and document title with the UI language", () => {
  renderWithLanguage(
    <MemoryRouter>
      <Nav />
      <Home />
    </MemoryRouter>,
    "en"
  );

  fireEvent.change(screen.getByRole("combobox", { name: "Language" }), {
    target: { value: "sr-Latn" },
  });

  expect(screen.getByText("Srpski A1")).toBeTruthy();
  expect(screen.getByText("Uči srpski korak po korak.")).toBeTruthy();
  expect(document.title).toBe("Srpski A1");
});