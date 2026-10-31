import { clearReadingSession, loadReadingSession, saveReadingSession } from "./persistence";
import { STORAGE_CONFIG } from "../../config/course";

describe("Reading session persistence", () => {
  const storage = {
    values: {},
    getItem(key) { return this.values[key] || null; },
    setItem(key, value) { this.values[key] = value; },
    removeItem(key) { delete this.values[key]; },
  };

  beforeEach(() => { storage.values = {}; });

  test("round-trips and clears a reading session", () => {
    const session = { module: "reading", sessionId: "test", status: "active" };
    expect(saveReadingSession(session, storage)).toBe(true);
    expect(loadReadingSession(storage)).toEqual(session);
    expect(clearReadingSession(storage)).toBe(true);
    expect(loadReadingSession(storage)).toBeNull();
  });

  test("ignores malformed and unrelated storage values", () => {
    storage.values[STORAGE_CONFIG.readingSession] = "{";
    expect(loadReadingSession(storage)).toBeNull();
  });

  test("keeps part practice separate from an active simulation", () => {
    const simulation = { module: "reading", mode: "simulation", sessionId: "sim" };
    const practice = { module: "reading", mode: "practice", sessionId: "practice" };
    saveReadingSession(simulation, storage);
    saveReadingSession(practice, storage);
    expect(loadReadingSession(storage, "simulation")).toEqual(simulation);
    expect(loadReadingSession(storage, "practice")).toEqual(practice);
  });
});
