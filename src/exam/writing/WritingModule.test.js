import { act, fireEvent, render, screen } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { ProgressProvider, useProgress } from "../../i18n/ProgressProvider";
import { createWritingSession, submitWritingSession, updateWritingDraft } from "../core/writingState";
import { loadWritingSession, saveWritingSession } from "../core/writingPersistence";
import { writingForms } from "../data/writingForms";
import { WritingResults } from "./WritingResults";
import { WritingSession } from "./WritingSession";

const renderSession = (entry = "/exam/writing/simulation") => render(
  <ProgressProvider><MemoryRouter initialEntries={[entry]}><Routes>
    <Route path="/exam/writing/simulation" element={<WritingSession mode="simulation" />} />
    <Route path="/exam/writing/practice/:taskNumber" element={<WritingSession mode="practice" />} />
  </Routes></MemoryRouter></ProgressProvider>
);

describe("Writing module UI", () => {
  beforeEach(() => { localStorage.clear(); window.scrollTo = jest.fn(); jest.useFakeTimers(); });
  afterEach(() => { act(() => jest.runOnlyPendingTimers()); jest.useRealTimers(); });

  test("renders the full simulation editor without hints and autosaves after a debounce", () => {
    renderSession();
    expect(screen.getByLabelText("Your response")).toBeInTheDocument();
    expect(screen.getByLabelText(/Writing time remaining 60:00/i)).toBeInTheDocument();
    expect(screen.getByText(/Hints, phrase banks, and model guidance remain hidden/i)).toBeInTheDocument();
    fireEvent.change(screen.getByLabelText("Your response"), { target: { value: "Hallo Mara! Dieser Text wird automatisch gespeichert." } });
    expect(screen.getByRole("status")).toHaveTextContent(/Saving/i);
    act(() => jest.advanceTimersByTime(600));
    expect(loadWritingSession().drafts[writingForms[0].tasks[0].id].text).toMatch(/automatisch gespeichert/i);
    expect(screen.getByRole("status")).toHaveTextContent(/Saved/i);
  });

  test("saves on task navigation and restores the active draft after remount", () => {
    const first = renderSession();
    fireEvent.change(screen.getByLabelText("Your response"), { target: { value: "Mein Entwurf für Aufgabe eins." } });
    fireEvent.click(screen.getByRole("button", { name: /Task 2/i }));
    expect(loadWritingSession().currentTask).toBe(1);
    act(() => jest.advanceTimersByTime(600));
    expect(loadWritingSession().currentTask).toBe(2);
    first.unmount();
    renderSession();
    expect(screen.getByRole("button", { name: /Task 2/i })).toHaveAttribute("aria-current", "step");
    fireEvent.click(screen.getByRole("button", { name: /Task 1/i }));
    expect(screen.getByLabelText("Your response")).toHaveValue("Mein Entwurf für Aufgabe eins.");
  });

  test("submission shows completion and self-assessment without pass, fail, or official score", () => {
    const form = writingForms[0];
    let session = createWritingSession({ form });
    session = updateWritingDraft(session, form.tasks[0].id, "Hallo Mara. Das ist mein Text. Liebe Grüße");
    session = submitWritingSession(session);
    render(<MemoryRouter><WritingResults form={form} session={session} onAssess={() => {}} onCompleteAssessment={() => {}} onReview={() => {}} onRestart={() => {}} onNewPrompt={() => {}} /></MemoryRouter>);
    expect(screen.getByText(/Writing Practice Simulation completed/i)).toBeInTheDocument();
    expect(screen.getByText(/not official Goethe grading/i)).toBeInTheDocument();
    expect(screen.queryByText(/^Passed$/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/Official Goethe score/i)).not.toBeInTheDocument();
    expect(screen.getAllByRole("radio")).toHaveLength(16);
  });

  test("practice exposes a manual checklist and no mandatory module timer", () => {
    renderSession("/exam/writing/practice/3");
    expect(screen.getByText(/Task checklist/i)).toBeInTheDocument();
    expect(screen.getAllByRole("checkbox").length).toBeGreaterThan(1);
    expect(screen.queryByLabelText(/Writing time remaining/i)).not.toBeInTheDocument();
    fireEvent.click(screen.getAllByRole("checkbox")[0]);
    act(() => jest.advanceTimersByTime(600));
    expect(Object.values(loadWritingSession(undefined, "practice").drafts).some((draft) => Object.values(draft.checklistState).some(Boolean))).toBe(true);
  });

  test("a saved expired session auto-submits without losing its final draft", () => {
    const form = writingForms[0];
    const taskId = form.tasks[0].id;
    const expired = { ...updateWritingDraft(createWritingSession({ form, now: "2026-10-31T09:00:00Z" }), taskId, "Finaler gespeicherter Entwurf."), deadlineAt: "2026-10-31T09:00:01.000Z" };
    saveWritingSession(expired);
    renderSession();
    act(() => jest.advanceTimersByTime(1000));
    const restored = loadWritingSession();
    expect(restored.status).toBe("submitted");
    expect(restored.submittedDrafts[taskId].text).toBe("Finaler gespeicherter Entwurf.");
  });
});

const ProgressProbe = () => {
  const { progress, recordWritingAttempt } = useProgress();
  const base = {
    formId: writingForms[0].id,
    mode: "simulation",
    currentTask: 3,
    submittedAt: "2026-10-31T11:00:00.000Z",
    contentVersion: "writing-v1",
    rubricVersion: "b1-writing-v1",
    submittedDrafts: {
      one: { wordCount: 80 }, two: { wordCount: 76 }, three: { wordCount: 42 },
    },
  };
  return <><button onClick={() => recordWritingAttempt({ session: { ...base, sessionId: "writing-1", selfAssessment: { taskFulfilment: 2, coherence: 2, vocabulary: 1, grammar: 2 } } })}>Record</button><button onClick={() => recordWritingAttempt({ session: { ...base, sessionId: "writing-1", selfAssessment: { taskFulfilment: 3, coherence: 2, vocabulary: 2, grammar: 2 } } })}>Update</button><output>{JSON.stringify(progress.writingProgress)}</output></>;
};

describe("Writing progress integration", () => {
  beforeEach(() => localStorage.clear());
  test("tracks completion, word counts, bounded versioned history, and rubric trends without a best official score", () => {
    render(<ProgressProvider><ProgressProbe /></ProgressProvider>);
    fireEvent.click(screen.getByRole("button", { name: "Record" }));
    fireEvent.click(screen.getByRole("button", { name: "Update" }));
    const value = JSON.parse(screen.getByRole("status").textContent);
    expect(value.simulationsCompleted).toBe(1);
    expect(value.attemptHistory).toHaveLength(1);
    expect(value.attemptHistory[0]).toEqual(expect.objectContaining({ contentVersion: "writing-v1", rubricVersion: "b1-writing-v1" }));
    expect(value.rubricTrends.taskFulfilment).toEqual({ attempts: 1, average: 3 });
    expect(value).not.toHaveProperty("bestOfficialScore");
  });
});
