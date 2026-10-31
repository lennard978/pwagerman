import { act, fireEvent, render, screen } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { ProgressProvider, useProgress } from "../../i18n/ProgressProvider";
import { readingForms } from "../data/readingForms";
import { createReadingSession, submitReadingSession } from "../core/examState";
import { clearReadingSession } from "../core/persistence";
import { ReadingPart } from "./ReadingPart";
import { ReadingReview } from "./ReadingReview";
import { ReadingSession } from "./ReadingSession";
import { ExamTimer } from "../core/ExamTimer";

describe("Reading module UI", () => {
  beforeEach(() => {
    window.localStorage.clear();
    clearReadingSession();
    clearReadingSession(undefined, "practice");
  });

  test("does not expose answers or explanations before part submission", () => {
    const part = readingForms[0].parts[0];
    render(<ReadingPart part={part} answers={{}} onAnswer={() => {}} />);
    expect(screen.getByText(part.items[0].prompt)).toBeInTheDocument();
    expect(screen.queryByText(part.items[0].explanation)).not.toBeInTheDocument();
    expect(screen.queryByText(/Evidence:/i)).not.toBeInTheDocument();
  });

  test("shows answers, correctness, explanations, and source context after submission", () => {
    const form = readingForms[0];
    const item = form.parts[0].items[0];
    const session = submitReadingSession({
      ...createReadingSession({ form, mode: "practice", partNumber: 1 }),
      answers: { [item.id]: item.correctAnswer },
    }, form);
    render(<ReadingReview form={form} session={session} onClose={() => {}} />);
    expect(screen.getByText(/Correct · Question 1/i)).toBeInTheDocument();
    expect(screen.getByText(item.explanation)).toBeInTheDocument();
    expect(screen.getAllByText(/Show source context/i)).toHaveLength(6);
  });

  test("requires confirmation before submitting unanswered practice", () => {
    render(
      <ProgressProvider>
        <MemoryRouter initialEntries={["/exam/reading/practice/1"]}>
          <Routes><Route path="/exam/reading/practice/:partNumber" element={<ReadingSession mode="practice" />} /></Routes>
        </MemoryRouter>
      </ProgressProvider>
    );
    fireEvent.click(screen.getByRole("button", { name: /Submit practice/i }));
    expect(screen.getByRole("dialog", { name: /Submit with unanswered questions/i })).toBeInTheDocument();
    expect(screen.getByText(/6 unanswered questions/i)).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: /Continue working/i }));
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  test("renders accessible answered and current question states", () => {
    render(
      <ProgressProvider>
        <MemoryRouter initialEntries={["/exam/reading/practice/1"]}>
          <Routes><Route path="/exam/reading/practice/:partNumber" element={<ReadingSession mode="practice" />} /></Routes>
        </MemoryRouter>
      </ProgressProvider>
    );
    const trueChoice = screen.getAllByRole("radio")[0];
    fireEvent.click(trueChoice);
    expect(screen.getByRole("button", { name: "Question 1, answered" })).toHaveAttribute("aria-current", "true");
  });

  test("automatically calls expiry from the absolute deadline", () => {
    jest.useFakeTimers();
    let current = new Date("2026-10-31T10:00:00.000Z");
    const session = createReadingSession({ form: readingForms[0], now: current, durationSeconds: 1 });
    const onExpire = jest.fn();
    render(<ExamTimer session={session} onExpire={onExpire} now={() => current} />);
    current = new Date("2026-10-31T10:00:01.000Z");
    act(() => { jest.advanceTimersByTime(1000); });
    expect(onExpire).toHaveBeenCalledTimes(1);
    jest.useRealTimers();
  });
});

const ProgressProbe = () => {
  const { progress, recordReadingAttempt } = useProgress();
  const submit = (id, rawScore, resultScore) => recordReadingAttempt({
    session: {
      sessionId: id,
      formId: readingForms[0].id,
      mode: "simulation",
      currentPart: 5,
      submittedAt: `2026-10-${id === "first" ? "30" : "31"}T10:00:00.000Z`,
      contentVersion: "reading-1",
      scoringVersion: "goethe-b1-reading-1",
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
  return <><button onClick={() => submit("first", 24, 80)}>First</button><button onClick={() => submit("second", 18, 60)}>Second</button><output>{JSON.stringify(progress.readingProgress)}</output></>;
};

describe("Reading progress integration", () => {
  beforeEach(() => window.localStorage.clear());

  test("records latest, best, versioned history, and skill performance", () => {
    render(<ProgressProvider><ProgressProbe /></ProgressProvider>);
    fireEvent.click(screen.getByRole("button", { name: "First" }));
    fireEvent.click(screen.getByRole("button", { name: "Second" }));
    const value = JSON.parse(screen.getByRole("status").textContent);
    expect(value.simulationsCompleted).toBe(2);
    expect(value.latestResultScore).toBe(60);
    expect(value.bestResultScore).toBe(80);
    expect(value.attemptHistory).toHaveLength(2);
    expect(value.attemptHistory[0]).toMatchObject({ contentVersion: "reading-1", scoringVersion: "goethe-b1-reading-1" });
    expect(value.skillPerformance.detail.total).toBe(60);
  });
});
