import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { ProgressProvider, useProgress } from "../../i18n/ProgressProvider";
import { createSpeakingSession, submitSpeaking } from "../core/speakingState";
import { saveSpeakingSession } from "../core/speakingPersistence";
import { speakingForms } from "../data/speakingForms";
import { SpeakingRecorder } from "./SpeakingRecorder";
import { SpeakingResults } from "./SpeakingResults";
import { SpeakingSession } from "./SpeakingSession";
import { getRecording } from "../core/recordingStore";

jest.mock("../core/recordingStore", () => ({
  getRecording: jest.fn().mockResolvedValue({ blob: new Blob(["audio"], { type: "audio/webm" }) }),
  saveRecording: jest.fn(),
  deleteRecording: jest.fn().mockResolvedValue(true),
}));

const renderSession = (entry) => render(
  <ProgressProvider><MemoryRouter initialEntries={[entry]}><Routes>
    <Route path="/exam/speaking/practice/:partNumber" element={<SpeakingSession mode="practice" />} />
    <Route path="/exam/speaking/solo-simulation" element={<SpeakingSession mode="solo-simulation" />} />
  </Routes></MemoryRouter></ProgressProvider>
);

describe("Speaking module UI", () => {
  beforeEach(() => {
    localStorage.clear();
    window.scrollTo = jest.fn();
    URL.createObjectURL = jest.fn(() => "blob:local-speaking");
    URL.revokeObjectURL = jest.fn();
    HTMLMediaElement.prototype.play = jest.fn().mockResolvedValue();
    HTMLMediaElement.prototype.pause = jest.fn();
    getRecording.mockResolvedValue({ blob: new Blob(["audio"], { type: "audio/webm" }) });
  });

  test("focused Part 2 practice requires one of two topic choices", () => {
    renderSession("/exam/speaking/practice/2?new=1");
    expect(screen.getByRole("heading", { name: /Choose one of two topics/i })).toBeInTheDocument();
    expect(screen.getAllByRole("button", { name: /Topic [AB]/i })).toHaveLength(2);
    fireEvent.click(screen.getAllByRole("button", { name: /Topic [AB]/i })[0]);
    expect(screen.getByText(/Part 2 · about 3–4 minutes/i)).toBeInTheDocument();
    expect(screen.getByText(/Optional local recording/i)).toBeInTheDocument();
  });

  test("saved simulation preparation resumes notes and absolute timer", () => {
    const form = speakingForms[0];
    saveSpeakingSession({
      ...createSpeakingSession({ form, now: new Date(Date.now() + 600000) }),
      notes: { part1: "Gespeicherte Idee", part2: { 1: "Start", 2: "", 3: "", 4: "", 5: "" }, part2B: { 1: "", 2: "", 3: "", 4: "", 5: "" }, part3: "" },
    });
    renderSession("/exam/speaking/solo-simulation");
    expect(screen.getByLabelText("Part 1 planning notes")).toHaveValue("Gespeicherte Idee");
    expect(screen.getByLabelText(/Speaking preparation/i)).toBeInTheDocument();
  });

  test("no-recording mode remains fully usable after explicit choice", () => {
    const session = { ...createSpeakingSession({ form: speakingForms[0], mode: "practice" }), recordingMetadata: [] };
    render(<SpeakingRecorder session={session} part={1} onSaved={jest.fn()} onDeleted={jest.fn()} />);
    expect(screen.queryByText(/No-recording mode active/i)).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: /Continue without recording/i }));
    expect(screen.getByRole("status")).toHaveTextContent(/Timers, prompts, notes, and self-assessment remain available/i);
  });

  test("playback creates and revokes an object URL and offers explicit controls", async () => {
    const session = {
      ...createSpeakingSession({ form: speakingForms[0], mode: "practice" }),
      recordingMetadata: [{ recordingId: "local-1", part: 1, participant: "solo" }],
    };
    const view = render(<SpeakingRecorder session={session} part={1} onSaved={jest.fn()} onDeleted={jest.fn()} />);
    await waitFor(() => expect(screen.getByRole("button", { name: "Restart playback" })).toBeInTheDocument());
    expect(URL.createObjectURL).toHaveBeenCalled();
    fireEvent.click(screen.getByRole("button", { name: "Play" }));
    expect(HTMLMediaElement.prototype.play).toHaveBeenCalled();
    view.unmount();
    expect(URL.revokeObjectURL).toHaveBeenCalledWith("blob:local-speaking");
  });

  test("completion shows manual self-assessment without score or pass/fail", () => {
    const session = submitSpeaking(createSpeakingSession({ form: speakingForms[0], mode: "practice", partNumber: 1 }));
    render(<MemoryRouter><SpeakingResults session={session} onAssess={jest.fn()} onSave={jest.fn()} onReview={jest.fn()} onRestart={jest.fn()} /></MemoryRouter>);
    expect(screen.getByRole("heading", { name: /Speaking self-assessment/i })).toBeInTheDocument();
    expect(screen.getAllByRole("radio")).toHaveLength(24);
    expect(screen.queryByText(/^Passed$/i)).not.toBeInTheDocument();
    expect(screen.getByText(/No official score or pass\/fail result/i)).toBeInTheDocument();
  });
});

const ProgressProbe = () => {
  const { progress, recordSpeakingAttempt } = useProgress();
  const session = {
    ...submitSpeaking(createSpeakingSession({ form: speakingForms[0], mode: "solo-simulation" })),
    sessionId: "speaking-progress-1",
    assessmentCompletedAt: "2026-10-31T10:30:00.000Z",
    selfAssessment: { taskFulfilment: 3, interaction: 2, fluency: 2, vocabulary: 2, grammar: 1, pronunciation: 3 },
    recordingMetadata: [{ recordingId: "local-progress-1", part: 2, sizeBytes: 100 }],
  };
  return <><button onClick={() => recordSpeakingAttempt({ session })}>Record speaking</button><output>{JSON.stringify(progress.speakingProgress)}</output></>;
};

describe("Speaking progress integration", () => {
  beforeEach(() => localStorage.clear());

  test("tracks simulation, rubric trend, history, and local metadata without an official best score", () => {
    render(<ProgressProvider><ProgressProbe /></ProgressProvider>);
    fireEvent.click(screen.getByRole("button", { name: "Record speaking" }));
    fireEvent.click(screen.getByRole("button", { name: "Record speaking" }));
    const value = JSON.parse(screen.getByRole("status").textContent);
    expect(value.soloSimulationsCompleted).toBe(1);
    expect(value.attemptHistory).toHaveLength(1);
    expect(value.recentRecordingMetadata).toHaveLength(1);
    expect(value.rubricTrends.taskFulfilment).toEqual({ attempts: 1, average: 3 });
    expect(value).not.toHaveProperty("bestOfficialScore");
  });
});
