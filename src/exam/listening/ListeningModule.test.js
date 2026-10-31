import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { ProgressProvider, useProgress } from "../../i18n/ProgressProvider";
import { createListeningSession, submitListeningSession } from "../core/listeningSession";
import { loadListeningSession, saveListeningSession } from "../core/listeningPersistence";
import { listeningForms } from "../data/listeningForms";
import { ListeningPart } from "./ListeningPart";
import { ListeningReview } from "./ListeningReview";
import { ListeningSession } from "./ListeningSession";

describe("Listening module UI", () => {
  beforeEach(() => window.localStorage.clear());

  test("does not create a timed session when audio preflight fails", async () => {
    const preflightAudio = jest.fn().mockResolvedValue({ ready: false, errors: [{ audioId: "audio-1", reason: "asset-pending" }] });
    render(<ProgressProvider><MemoryRouter initialEntries={["/exam/listening/simulation"]}><Routes><Route path="/exam/listening/simulation" element={<ListeningSession mode="simulation" preflightAudio={preflightAudio} />} /></Routes></MemoryRouter></ProgressProvider>);
    expect(screen.getByText(/timer has not started/i)).toBeInTheDocument();
    expect(loadListeningSession()).toBeNull();
    expect(await screen.findByRole("alert")).toHaveTextContent(/could not be prepared/i);
    expect(loadListeningSession()).toBeNull();
  });

  test("starts the session only after successful media preflight", async () => {
    const preflightAudio = jest.fn().mockResolvedValue({ ready: true, errors: [] });
    render(<ProgressProvider><MemoryRouter initialEntries={["/exam/listening/practice/1"]}><Routes><Route path="/exam/listening/practice/:partNumber" element={<ListeningSession mode="practice" preflightAudio={preflightAudio} />} /></Routes></MemoryRouter></ProgressProvider>);
    await waitFor(() => expect(loadListeningSession(undefined, "practice")).not.toBeNull());
    expect(screen.getByText(/Ordered audio sequence/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Start 10-second preparation/i })).toBeInTheDocument();
  });

  test("keeps transcripts, explanations, and evidence hidden during a scored attempt", () => {
    const form = listeningForms[0];
    const part = form.parts[0];
    const session = createListeningSession({ form, mode: "practice" });
    render(<ListeningPart part={part} session={session} updateSession={() => {}} onAnswer={() => {}} />);
    expect(screen.getByText(part.items[0].prompt)).toBeInTheDocument();
    expect(screen.queryByText(part.audio[0].segments[0].text)).not.toBeInTheDocument();
    expect(screen.queryByText(part.items[0].explanation)).not.toBeInTheDocument();
    expect(screen.getByText(/Transcript, subtitles, translation/i)).toBeInTheDocument();
  });

  test("distinguishes completed recordings from upcoming locked recordings", () => {
    const form = listeningForms[0];
    const part = form.parts[0];
    const session = createListeningSession({ form, mode: "practice" });
    const first = part.audio[0];
    const second = part.audio[1];
    session.playbackState[first.id] = {
      ...session.playbackState[first.id],
      status: "finished",
      playCount: first.playbackLimit,
    };

    render(<ListeningPart part={part} session={session} updateSession={() => {}} onAnswer={() => {}} />);

    expect(screen.getByText(first.title).parentElement).toHaveTextContent(/Playback completed/i);
    expect(screen.getByText(second.title).closest("section")).toHaveTextContent(/allowed plays used/i);
    expect(screen.getAllByText(/Available after the previous recording is completed/i)).toHaveLength(part.audio.length - 2);
  });

  test("reveals speaker-labelled transcript and item evidence only after submission", () => {
    const form = listeningForms[0];
    const session = submitListeningSession(createListeningSession({ form, mode: "practice" }), form);
    const playCountBefore = session.playbackState[form.parts[0].audio[0].id].playCount;
    render(<ListeningReview form={form} session={session} onClose={() => {}} />);
    expect(screen.getAllByText("Transcript").length).toBeGreaterThan(0);
    expect(screen.getByText(form.parts[0].audio[0].segments[0].text, { exact: false })).toBeInTheDocument();
    expect(screen.getAllByText(/Evidence:/i).length).toBeGreaterThan(0);
    fireEvent.play(screen.getAllByLabelText(/Study replay/i)[0]);
    expect(session.playbackState[form.parts[0].audio[0].id].playCount).toBe(playCountBefore);
  });

  test("restores submitted results without requiring exam audio again", async () => {
    const form = listeningForms[0];
    const submitted = { ...submitListeningSession(createListeningSession({ form }), form), progressRecorded: true };
    saveListeningSession(submitted);
    const preflightAudio = jest.fn();
    render(<ProgressProvider><MemoryRouter initialEntries={["/exam/listening/simulation"]}><Routes><Route path="/exam/listening/simulation" element={<ListeningSession mode="simulation" preflightAudio={preflightAudio} />} /></Routes></MemoryRouter></ProgressProvider>);
    expect(await screen.findByText(/Listening Practice Simulation result/i)).toBeInTheDocument();
    expect(preflightAudio).not.toHaveBeenCalled();
  });
});

const ProgressProbe = () => {
  const { progress, recordListeningAttempt } = useProgress();
  const submit = (sessionId, rawScore, resultScore, date) => recordListeningAttempt({
    session: {
      sessionId,
      formId: listeningForms[0].id,
      mode: "simulation",
      currentPart: 4,
      submittedAt: date,
      contentVersion: "listening-v1",
      scoringVersion: "goethe-b1-listening-1",
      audioVersion: "audio-v1",
    },
    score: {
      rawScore,
      total: 30,
      resultScore,
      passed: resultScore >= 60,
      partBreakdown: [],
      skillPerformance: { detail: { correct: rawScore, total: 30, percentage: resultScore } },
    },
  });
  return <><button onClick={() => submit("first", 24, 80, "2026-10-30T10:00:00.000Z")}>First</button><button onClick={() => submit("second", 18, 60, "2026-10-31T10:00:00.000Z")}>Second</button><output>{JSON.stringify(progress.listeningProgress)}</output></>;
};

describe("Listening progress integration", () => {
  beforeEach(() => window.localStorage.clear());

  test("records latest, best, bounded versioned history, and skills", () => {
    render(<ProgressProvider><ProgressProbe /></ProgressProvider>);
    fireEvent.click(screen.getByRole("button", { name: "First" }));
    fireEvent.click(screen.getByRole("button", { name: "Second" }));
    const value = JSON.parse(screen.getByRole("status").textContent);
    expect(value).toMatchObject({ simulationsCompleted: 2, latestRawScore: 18, latestResultScore: 60, bestResultScore: 80, latestDate: "2026-10-31T10:00:00.000Z" });
    expect(value.attemptHistory).toHaveLength(2);
    expect(value.attemptHistory[0]).toMatchObject({ contentVersion: "listening-v1", scoringVersion: "goethe-b1-listening-1", audioVersion: "audio-v1" });
    expect(value.skillPerformance.detail.total).toBe(60);
  });
});
