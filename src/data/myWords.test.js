import React from "react";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MyWordsProvider, useMyWords } from "../i18n/MyWordsProvider";
import { LanguageProvider } from "../i18n/LanguageProvider";
import { MyWords } from "../screen/myWords/MyWords";
import { loadMyWords, MY_WORDS_STORAGE_KEY } from "./myWords";

const mockSpeak = jest.fn();

jest.mock("react-speech-kit", () => ({
  useSpeechSynthesis: () => ({
    speak: mockSpeak,
    voices: [{ lang: "sr-RS", localService: true }],
  }),
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
        if (!stores.has(name)) stores.set(name, new Map());
        const recordStore = stores.get(name);
        const db = {
          objectStoreNames: { contains: (storeName) => storeName === "myWords" },
          createObjectStore: () => {},
          transaction: () => ({
            objectStore: () => ({
              clear: () => recordStore.clear(),
              put: (value) => recordStore.set(value.id, value),
              getAll: () => makeRequest(() => Array.from(recordStore.values())),
            }),
            set oncomplete(fn) {
              queueMicrotask(fn);
            },
            set onerror(fn) {},
          }),
        };
        request.result = db;
        request.onupgradeneeded && request.onupgradeneeded();
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

beforeEach(() => {
  localStorage.clear();
  mockSpeak.mockClear();
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

  expect(mockSpeak).toHaveBeenCalledWith(expect.objectContaining({
    text: "kuća",
  }));
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
  await waitFor(() => expect(screen.getByText("No saved words yet")).toBeTruthy());
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

