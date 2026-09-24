import React from "react";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MyWordsProvider, useMyWords } from "../i18n/MyWordsProvider";
import { LanguageProvider } from "../i18n/LanguageProvider";
import { MyWords } from "../screen/myWords/MyWords";
import {
  loadMyWords,
  loadWordStatuses,
  MY_WORDS_STORAGE_KEY,
  WORD_STATUSES_STORAGE_KEY,
} from "./myWords";

const mockSpeak = jest.fn();
const mockProviderSpeak = jest.fn(({ browserSpeak, text }) => browserSpeak({ text }));

jest.mock("react-speech-kit", () => ({
  useSpeechSynthesis: () => ({
    speak: mockSpeak,
    voices: [{ lang: "sr-RS", localService: true }],
  }),
}));

jest.mock("../services/tts/ttsProvider", () => ({
  speak: (options) => mockProviderSpeak(options),
}));

// Minimal in-memory fake of the subset of IndexedDB used by the storage
// abstraction, so Safari/iOS persistence behavior can be exercised in Jest.
const createFakeIndexedDb = () => {
  const stores = new Map();

  const makeRequest = (getValue) => {
    const request = {};
    queueMicrotask(() => {
      try {
        request.result = getValue();
        request.onsuccess && request.onsuccess();
      } catch (error) {
        request.error = error;
        request.onerror && request.onerror();
      }
    });
    return request;
  };

  return {
    open(name) {
      const request = {};
      queueMicrotask(() => {
        const isNewDatabase = !stores.has(name);
        if (isNewDatabase) stores.set(name, new Map());
        const databaseStores = stores.get(name);
        const db = {
          objectStoreNames: { contains: (storeName) => databaseStores.has(storeName) },
          createObjectStore: (storeName) => databaseStores.set(storeName, new Map()),
          transaction: (storeName) => ({
            objectStore: () => ({
              clear: () => databaseStores.get(storeName).clear(),
              put: (value) => databaseStores.get(storeName).set(value.id, value),
              getAll: () => makeRequest(() => Array.from(databaseStores.get(storeName).values())),
            }),
            set oncomplete(fn) {
              queueMicrotask(fn);
            },
            set onerror(fn) {},
          }),
        };
        request.result = db;
        if (isNewDatabase) request.onupgradeneeded && request.onupgradeneeded();
        request.onsuccess && request.onsuccess();
      });
      return request;
    },
  };
};

const Probe = () => {
  const { words } = useMyWords();
  return <span data-testid="count">{words.length}</span>;
};

const VocabularyProbe = () => {
  const { allWords, toggleFavorite, toggleKnown } = useMyWords();
  const word = allWords.find((item) => item.id === "lesson-24-word-1");
  return (
    <>
      <span data-testid="new-word-status">{word.status}</span>
      <span data-testid="new-word-favorite">{String(word.favorite)}</span>
      <button onClick={() => toggleKnown(word)}>Toggle new Known</button>
      <button onClick={() => toggleFavorite(word)}>Toggle new Favorite</button>
    </>
  );
};

beforeEach(() => {
  localStorage.clear();
  mockSpeak.mockClear();
  mockProviderSpeak.mockClear();
  delete window.indexedDB;
});


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
  expect(loadMyWords()[0]).toEqual(expect.objectContaining({
    status: "learning",
    favorite: false,
  }));
});

test("legacy words migrate with learning and favorite defaults", () => {
  localStorage.setItem(MY_WORDS_STORAGE_KEY, JSON.stringify([
    { id: "legacy", source: "friend", target: "prijatelj", createdAt: "2025-01-01" },
    { id: "known", source: "water", target: "voda", createdAt: "2025-01-02", status: "known", favorite: true },
  ]));

  expect(loadMyWords()).toEqual([
    expect.objectContaining({ id: "legacy", status: "learning", favorite: false }),
    expect.objectContaining({ id: "known", status: "known", favorite: true }),
  ]);
});

test("malformed vocabulary statuses are filtered without losing valid records", () => {
  localStorage.setItem(WORD_STATUSES_STORAGE_KEY, JSON.stringify([
    { id: "lesson-1-word-1", status: "known", favorite: true },
    { id: "invalid", status: "mastered", favorite: "yes" },
  ]));

  expect(loadWordStatuses()).toEqual([
    { id: "lesson-1-word-1", status: "known", favorite: true },
  ]);
});

test("new curriculum words use the existing Known and Favorite persistence", () => {
  render(
    <LanguageProvider><MyWordsProvider><VocabularyProbe /></MyWordsProvider></LanguageProvider>
  );

  fireEvent.click(screen.getByRole("button", { name: "Toggle new Known" }));
  fireEvent.click(screen.getByRole("button", { name: "Toggle new Favorite" }));

  expect(screen.getByTestId("new-word-status").textContent).toBe("known");
  expect(screen.getByTestId("new-word-favorite").textContent).toBe("true");
  expect(JSON.parse(localStorage.getItem(WORD_STATUSES_STORAGE_KEY))).toContainEqual({
    id: "lesson-24-word-1",
    status: "known",
    favorite: true,
  });
});

test("saved My Words pronounce the Serbian target without coupling Edit/Delete", () => {
  localStorage.setItem(MY_WORDS_STORAGE_KEY, JSON.stringify([
    { id: "1", source: "house", target: "kuća", createdAt: "2026-01-01" },
  ]));
  render(<LanguageProvider><MyWordsProvider><MyWords /></MyWordsProvider></LanguageProvider>);

  const pronunciation = screen.getByRole("button", {
    name: "Hear Serbian pronunciation: kuća",
  });
  expect(screen.getByRole("button", { name: "Edit" })).toBeTruthy();
  expect(screen.getByRole("button", { name: "Delete" })).toBeTruthy();

  fireEvent.click(pronunciation);

  expect(mockProviderSpeak).toHaveBeenCalledWith(expect.objectContaining({
    text: "kuća",
  }));
  expect(screen.getAllByText("Lesson").length).toBeGreaterThan(0);
});

test("migrates existing localStorage words into IndexedDB once, keeping every entry", async () => {
  localStorage.setItem(MY_WORDS_STORAGE_KEY, JSON.stringify([
    { id: "1", source: "house", target: "kuća", createdAt: "2026-01-01" },
    { id: "2", source: "dog", target: "pas", createdAt: "2026-01-02" },
  ]));
  window.indexedDB = createFakeIndexedDb();

  render(<LanguageProvider><MyWordsProvider><Probe /></MyWordsProvider></LanguageProvider>);

  expect(screen.getByTestId("count").textContent).toBe("2");
  await waitFor(() => expect(screen.getByTestId("count").textContent).toBe("2"));
  expect(localStorage.getItem(MY_WORDS_STORAGE_KEY)).not.toBeNull();
});

test("My Words persists across a simulated reload via IndexedDB", async () => {
  window.indexedDB = createFakeIndexedDb();

  const { unmount } = render(
    <LanguageProvider><MyWordsProvider><MyWords /></MyWordsProvider></LanguageProvider>
  );
  fireEvent.change(screen.getAllByLabelText("English")[0], { target: { value: "bread" } });
  fireEvent.change(screen.getAllByLabelText("Serbian")[0], { target: { value: "hleb" } });
  fireEvent.click(screen.getByRole("button", { name: "Save" }));
  await waitFor(() => expect(screen.getByText("bread")).toBeTruthy());

  unmount();

  render(<LanguageProvider><MyWordsProvider><Probe /></MyWordsProvider></LanguageProvider>);
  await waitFor(() => expect(screen.getByTestId("count").textContent).toBe("1"));
});

test("create, edit, and delete still work after migrating to IndexedDB", async () => {
  window.indexedDB = createFakeIndexedDb();

  render(<LanguageProvider><MyWordsProvider><MyWords /></MyWordsProvider></LanguageProvider>);

  fireEvent.change(screen.getAllByLabelText("English")[0], { target: { value: "cat" } });
  fireEvent.change(screen.getAllByLabelText("Serbian")[0], { target: { value: "mačka" } });
  fireEvent.click(screen.getByRole("button", { name: "Save" }));
  await waitFor(() => expect(screen.getByText("cat")).toBeTruthy());

  fireEvent.click(screen.getByRole("button", { name: "Edit" }));
  fireEvent.change(screen.getAllByLabelText("English")[0], { target: { value: "kitten" } });
  fireEvent.click(screen.getByRole("button", { name: "Save" }));
  await waitFor(() => expect(screen.getByText("kitten")).toBeTruthy());

  window.confirm = jest.fn(() => true);
  fireEvent.click(screen.getByRole("button", { name: "Delete" }));
  await waitFor(() => expect(screen.queryByText("kitten")).toBeNull());
});

test("malformed IndexedDB entries are filtered while localStorage stays usable", async () => {
  const fakeIdb = createFakeIndexedDb();
  window.indexedDB = fakeIdb;
  localStorage.setItem(
    MY_WORDS_STORAGE_KEY,
    JSON.stringify([{ id: "1", source: "house", target: "kuća", createdAt: "2026-01-01" }, { bogus: true }])
  );

  render(<LanguageProvider><MyWordsProvider><Probe /></MyWordsProvider></LanguageProvider>);
  await waitFor(() => expect(screen.getByTestId("count").textContent).toBe("1"));
});
