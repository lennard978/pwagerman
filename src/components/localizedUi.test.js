import React from "react";
import { render, screen, act, fireEvent } from "@testing-library/react";
import { MemoryRouter, Route, Routes, useLocation, useNavigate } from "react-router-dom";
import Nav from "./nav/Nav";
import { NoMatch } from "./nav/NoMatch";
import { ChooseLesson } from "../screen/lesson/ChooseLesson";
import { Home } from "../screen/home/Home";
import { Write } from "../screen/write/Write";
import { Layout } from "./nav/Layout";
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

const LanguageStateProbe = () => {
  const { language, setLanguage } = useLanguage();
  return (
    <>
      <span data-testid="language-state">{language}</span>
      <button onClick={() => setLanguage("sr-Latn")}>Change language</button>
    </>
  );
};

const RouteSwitchProbe = () => {
  const navigate = useNavigate();
  const [count, setCount] = React.useState(0);

  return (
    <>
      <button onClick={() => setCount((value) => value + 1)}>Rerender {count}</button>
      <button onClick={() => navigate("/choosetest/2")}>Open test</button>
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

test("keeps seven navigation links without a visible language selector", () => {
  renderWithLanguage(
    <MemoryRouter>
      <Nav />
    </MemoryRouter>,
    "en"
  );

  expect(screen.queryByRole("combobox", { name: "Language" })).toBeNull();
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

test("internal language state can still switch without a visible selector", () => {
  renderWithLanguage(
    <MemoryRouter>
      <Nav />
      <LanguageStateProbe />
    </MemoryRouter>,
    "en"
  );

  fireEvent.click(screen.getByRole("button", { name: "Change language" }));
  expect(screen.getByTestId("language-state").textContent).toBe("sr-Latn");
  expect(window.localStorage.getItem(LANGUAGE_STORAGE_KEY)).toBe("sr-Latn");
});

test("localizes lesson metadata without changing vocabulary", () => {
  renderWithLanguage(
    <MemoryRouter>
      <Nav />
      <ChooseLesson data={lessonData} />
      <LanguageStateProbe />
      <span data-testid="lesson-source">{lessonData[0].items[0].source}</span>
    </MemoryRouter>,
    "en"
  );

  expect(screen.getByText("Greetings & Introductions")).toBeTruthy();
  expect(screen.getByTestId("lesson-source").textContent).toBe("house");

  fireEvent.click(screen.getByRole("button", { name: "Change language" }));

  expect(screen.getByText("Pozdravi i upoznavanje")).toBeTruthy();
  expect(screen.getByTestId("lesson-source").textContent).toBe("house");
});

test("localizes an exercise completion action", () => {
  renderWithLanguage(
    <MemoryRouter initialEntries={["/choosewrite/0"]}>
      <Routes>
        <Route path="/choosewrite/:userId" element={<Write data={lessonData} />} />
      </Routes>
    </MemoryRouter>,
    "sr-Latn"
  );

  expect(screen.getByRole("link", { name: "Nazad na pisanje" })).toBeTruthy();
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
    screen.getByRole("button", { name: "Change language" }).click();
  });

  expect(screen.getByTestId("current-path").textContent).toBe("/choosewrite/0");
  expect(document.documentElement).toBe(documentRoot);
});

test("scrolls to the top on route changes but not same-page rerenders", () => {
  const scrollTo = jest.fn();
  Object.defineProperty(window, "scrollTo", {
    configurable: true,
    value: scrollTo,
  });

  renderWithLanguage(
    <MemoryRouter initialEntries={["/choosetest"]}>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/choosetest" element={<RouteSwitchProbe />} />
          <Route path="/choosetest/2" element={<span>Test exercise</span>} />
        </Route>
      </Routes>
    </MemoryRouter>,
    "en"
  );

  expect(scrollTo).toHaveBeenCalledTimes(1);
  fireEvent.click(screen.getByRole("button", { name: "Rerender 0" }));
  expect(scrollTo).toHaveBeenCalledTimes(1);
  fireEvent.click(screen.getByRole("button", { name: "Open test" }));
  expect(scrollTo).toHaveBeenCalledTimes(2);
  expect(scrollTo).toHaveBeenLastCalledWith(0, 0);
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
        <LanguageStateProbe />
      </MemoryRouter>
    </LanguageProvider>
  );

  expect(screen.getByTestId("language-state").textContent).toBe("sr-Latn");
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
      <LanguageStateProbe />
    </MemoryRouter>,
    "en"
  );

  fireEvent.click(screen.getByRole("button", { name: "Change language" }));

  expect(screen.getByText("Srpski A1")).toBeTruthy();
  expect(screen.getByText("Uči srpski korak po korak.")).toBeTruthy();
  expect(document.title).toBe("Srpski A1");
});