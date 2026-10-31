import React from "react";
import { render, screen, act } from "@testing-library/react";
import {
  LANGUAGE_STORAGE_KEY,
  LanguageProvider,
  useLanguage,
} from "./LanguageProvider";

const LanguageProbe = () => {
  const { language, setLanguage, t } = useLanguage();
  return (
    <>
      <span data-testid="language">{language}</span>
      <span data-testid="home">{t("navigation.home")}</span>
      <span data-testid="english-fallback">{t("navigation.settings")}</span>
      <span data-testid="missing-key">{t("missing.value")}</span>
      <button onClick={() => setLanguage("de")}>Unsupported language</button>
    </>
  );
};

const renderProvider = () =>
  render(
    <LanguageProvider>
      <LanguageProbe />
    </LanguageProvider>
  );

const setBrowserLanguage = (language) => {
  Object.defineProperty(window.navigator, "language", {
    configurable: true,
    value: language,
  });
};

beforeEach(() => {
  window.localStorage.clear();
  setBrowserLanguage("en-US");
  document.documentElement.lang = "en";
});

test("supports English and uses English for an English browser", () => {
  renderProvider();

  expect(screen.getByTestId("language").textContent).toBe("en");
  expect(screen.getByTestId("home").textContent).toBe("Home");
  expect(document.documentElement.lang).toBe("en");
  expect(document.title).toBe("German B1");
});

test.each([
  ["de-DE", "en"],
  ["fr-FR", "en"],
  ["en-GB", "en"],
  ["fr-FR", "en"],
])("maps browser locale %s to %s", (browserLanguage, expectedLanguage) => {
  setBrowserLanguage(browserLanguage);
  renderProvider();

  expect(screen.getByTestId("language").textContent).toBe(expectedLanguage);
});

test("unsupported manual selections remain English", () => {
  setBrowserLanguage("en-US");
  renderProvider();

  act(() => {
    screen.getByRole("button", { name: "Unsupported language" }).click();
  });

  expect(screen.getByTestId("language").textContent).toBe("en");
  expect(window.localStorage.getItem(LANGUAGE_STORAGE_KEY)).toBe("en");
  expect(document.documentElement.lang).toBe("en");
  expect(document.title).toBe("German B1");
  expect(screen.getByTestId("home").textContent).toBe("Home");
});

test("falls back to readable English for missing translations", () => {
  setBrowserLanguage("sr");
  renderProvider();

  expect(screen.getByTestId("english-fallback").textContent).toBe("Settings");
  expect(screen.getByTestId("missing-key").textContent).toBe("Value");
});

test("ignores an invalid persisted language", () => {
  window.localStorage.setItem(LANGUAGE_STORAGE_KEY, "de");
  setBrowserLanguage("sr");
  renderProvider();

  expect(screen.getByTestId("language").textContent).toBe("en");
});
