import { writingForms } from "../data/writingForms";
import { createWritingSession } from "./writingState";
import { clearWritingSession, loadWritingSession, saveWritingSession } from "./writingPersistence";

describe("Writing persistence", () => {
  beforeEach(() => localStorage.clear());

  test("separates simulation and practice sessions and restores drafts", () => {
    const simulation = createWritingSession({ form: writingForms[0], now: "2026-10-31T10:00:00Z" });
    const practice = createWritingSession({ form: writingForms[0], mode: "practice", taskNumber: 2, now: "2026-10-31T10:00:00Z" });
    expect(saveWritingSession(simulation)).toBe(true);
    expect(saveWritingSession(practice)).toBe(true);
    expect(loadWritingSession().sessionId).toBe(simulation.sessionId);
    expect(loadWritingSession(undefined, "practice").sessionId).toBe(practice.sessionId);
  });

  test("rejects malformed or unrelated stored data", () => {
    localStorage.setItem("asenda.german-b1.writingSession.v1", "{bad");
    expect(loadWritingSession()).toBeNull();
    localStorage.setItem("asenda.german-b1.writingSession.v1", JSON.stringify({ module: "reading", mode: "simulation" }));
    expect(loadWritingSession()).toBeNull();
  });

  test("clears only the requested session", () => {
    saveWritingSession(createWritingSession({ form: writingForms[0] }));
    expect(clearWritingSession()).toBe(true);
    expect(loadWritingSession()).toBeNull();
  });

  test("falls back safely when storage is unavailable", () => {
    const storage = { getItem: () => { throw new Error("unavailable"); }, setItem: () => { throw new Error("unavailable"); }, removeItem: () => { throw new Error("unavailable"); } };
    const session = createWritingSession({ form: writingForms[0] });
    expect(saveWritingSession(session, storage)).toBe(false);
    expect(loadWritingSession(storage)).toBeNull();
    expect(clearWritingSession(storage)).toBe(false);
  });
});
