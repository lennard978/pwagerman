import { readingForms } from "../data/readingForms";
import {
  createReadingSession,
  getReadingRemainingSeconds,
  getReadingUnansweredCount,
  navigateReadingPart,
  selectReadingAnswer,
  shouldExpireReadingSession,
  submitReadingSession,
} from "./examState";

describe("Reading exam state", () => {
  const form = readingForms[0];
  const start = new Date("2026-10-31T10:00:00.000Z");

  test("uses an absolute persisted simulation deadline", () => {
    const session = createReadingSession({ form, now: start });
    expect(session.startedAt).toBe(start.toISOString());
    expect(session.deadlineAt).toBe("2026-10-31T11:05:00.000Z");
    expect(getReadingRemainingSeconds(session, new Date("2026-10-31T10:05:00.000Z"))).toBe(3600);
    expect(shouldExpireReadingSession(session, new Date(session.deadlineAt))).toBe(true);
  });

  test("releases a duplicate Part 3 advertisement assignment", () => {
    let session = createReadingSession({ form, now: start });
    const [first, second] = form.parts[2].items;
    session = selectReadingAnswer(session, form, first.id, "A");
    session = selectReadingAnswer(session, form, second.id, "A");
    expect(session.answers[first.id]).toBeUndefined();
    expect(session.answers[second.id]).toBe("A");
  });

  test("supports non-linear part navigation without losing answers", () => {
    let session = createReadingSession({ form, now: start });
    const item = form.parts[0].items[0];
    session = selectReadingAnswer(session, form, item.id, item.correctAnswer);
    session = navigateReadingPart(session, 5);
    session = navigateReadingPart(session, 2);
    expect(session.currentPart).toBe(2);
    expect(session.answers[item.id]).toBe(item.correctAnswer);
  });

  test("tracks unanswered items and submits once", () => {
    const session = createReadingSession({ form, mode: "practice", partNumber: 1, now: start });
    expect(getReadingUnansweredCount(session, form)).toBe(6);
    const submitted = submitReadingSession(session, form, new Date("2026-10-31T10:04:00.000Z"));
    expect(submitted.status).toBe("submitted");
    expect(submitted.score).toMatchObject({ rawScore: 0, total: 6 });
  });
});
