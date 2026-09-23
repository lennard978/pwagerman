import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { MyWordsProvider, useMyWords } from "../i18n/MyWordsProvider";
import { LanguageProvider } from "../i18n/LanguageProvider";
import { MyWords } from "../screen/myWords/MyWords";
import { loadMyWords, MY_WORDS_STORAGE_KEY } from "./myWords";

const Probe = () => {
  const { words } = useMyWords();
  return <span data-testid="count">{words.length}</span>;
};

beforeEach(() => localStorage.clear());

test("My Words saves and loads custom English-to-Serbian entries", () => {
  render(
    <LanguageProvider><MyWordsProvider><MyWords /></MyWordsProvider></LanguageProvider>
  );

  fireEvent.change(screen.getAllByLabelText("English")[0], { target: { value: "airport" } });
  fireEvent.change(screen.getAllByLabelText("Serbian")[0], { target: { value: "aerodrom" } });
  fireEvent.click(screen.getByRole("button", { name: "Save" }));

  expect(screen.getByText("airport")).toBeTruthy();
  expect(JSON.parse(localStorage.getItem(MY_WORDS_STORAGE_KEY))).toHaveLength(1);
});

test("My Words tolerates malformed storage and rejects exact duplicates", () => {
  localStorage.setItem(MY_WORDS_STORAGE_KEY, "not-json");
  expect(loadMyWords()).toEqual([]);

  render(
    <LanguageProvider><MyWordsProvider><MyWords /></MyWordsProvider></LanguageProvider>
  );
  fireEvent.change(screen.getAllByLabelText("English")[0], { target: { value: "house" } });
  fireEvent.change(screen.getAllByLabelText("Serbian")[0], { target: { value: "kuća" } });
  fireEvent.click(screen.getByRole("button", { name: "Save" }));
  fireEvent.change(screen.getAllByLabelText("English")[0], { target: { value: "house" } });
  fireEvent.change(screen.getAllByLabelText("Serbian")[0], { target: { value: "kuća" } });
  fireEvent.click(screen.getByRole("button", { name: "Save" }));

  expect(screen.getByRole("alert")).toBeTruthy();
});

test("My Words provider loads valid stored entries", () => {
  localStorage.setItem(MY_WORDS_STORAGE_KEY, JSON.stringify([
    { id: "1", source: "house", target: "kuća", createdAt: "2026-01-01" },
  ]));
  render(<LanguageProvider><MyWordsProvider><Probe /></MyWordsProvider></LanguageProvider>);
  expect(screen.getByTestId("count").textContent).toBe("1");
});
