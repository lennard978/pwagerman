import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { LanguageProvider } from "../../i18n/LanguageProvider";
import { MyWordsProvider } from "../../i18n/MyWordsProvider";
import { Pair } from "./Pair";

const mockTtsSpeak = jest.fn(() => Promise.resolve(true));

jest.mock("../../services/tts/ttsProvider", () => ({
  speak: (options) => mockTtsSpeak(options),
}));

jest.mock("react-speech-kit", () => ({
  useSpeechSynthesis: () => ({ speak: jest.fn(), voices: [] }),
}));

const items = [
  { id: "antrag", source: "application", target: "Antrag", article: "der", partOfSpeech: "noun" },
  { id: "bewerben", source: "to apply for", target: "sich bewerben um", partOfSpeech: "verb" },
  { id: "agree", source: "I agree with that.", target: "Ich bin damit einverstanden.", partOfSpeech: "phrase" },
];

const renderPair = () => render(
  <LanguageProvider>
    <MyWordsProvider>
      <MemoryRouter initialEntries={["/pair/learning"]}>
        <Routes><Route path="/pair/:lessonId" element={<Pair data={[{ id: "learning", items }]} />} /></Routes>
      </MemoryRouter>
    </MyWordsProvider>
  </LanguageProvider>
);

beforeEach(() => {
  localStorage.clear();
  delete window.indexedDB;
  mockTtsSpeak.mockClear();
  mockTtsSpeak.mockResolvedValue(true);
});

test("Pair pronunciation uses a distinct accessible button and full German speech text", () => {
  renderPair();
  const nounSpeaker = screen.getByRole("button", { name: "Pronounce der Antrag" });
  expect(nounSpeaker.tagName).toBe("BUTTON");
  expect(nounSpeaker.tabIndex).toBe(0);

  fireEvent.click(nounSpeaker);
  fireEvent.click(screen.getByRole("button", { name: "Pronounce sich bewerben um" }));
  fireEvent.click(screen.getByRole("button", { name: "Pronounce Ich bin damit einverstanden." }));

  expect(mockTtsSpeak).toHaveBeenNthCalledWith(1, expect.objectContaining({ text: "der Antrag", lang: "de-DE" }));
  expect(mockTtsSpeak).toHaveBeenNthCalledWith(2, expect.objectContaining({ text: "sich bewerben um", lang: "de-DE" }));
  expect(mockTtsSpeak).toHaveBeenNthCalledWith(3, expect.objectContaining({ text: "Ich bin damit einverstanden.", lang: "de-DE" }));
});

test("Pair speaker does not trigger matching and a failed playback remains safe", () => {
  mockTtsSpeak.mockResolvedValue(false);
  renderPair();
  fireEvent.click(screen.getByRole("button", { name: "application" }));
  fireEvent.click(screen.getByRole("button", { name: "Pronounce der Antrag" }));

  expect(screen.getByRole("button", { name: "der Antrag" }).getAttribute("aria-pressed")).toBe("false");
  expect(screen.queryByText("All pairs matched")).toBeNull();

  fireEvent.click(screen.getByRole("button", { name: "der Antrag" }));
  expect(screen.queryByRole("button", { name: "application" })).toBeNull();
});
