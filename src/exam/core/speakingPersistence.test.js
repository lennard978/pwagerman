import { speakingForms } from "../data/speakingForms";
import { createSpeakingSession, updateSpeakingNote } from "./speakingState";
import { clearSpeakingSession, loadSpeakingSession, saveSpeakingSession } from "./speakingPersistence";

const storage = () => ({
  values: {},
  getItem(key) { return this.values[key] || null; },
  setItem(key, value) { this.values[key] = value; },
  removeItem(key) { delete this.values[key]; },
});

describe("Speaking session persistence", () => {
  test("restores preparation deadlines and notes after refresh", () => {
    const memory = storage();
    const session = updateSpeakingNote(createSpeakingSession({
      form: speakingForms[0],
      now: "2026-10-31T10:00:00Z",
    }), "part1", "Treffpunkt am Bahnhof");
    expect(saveSpeakingSession(session, memory)).toBe(true);
    expect(loadSpeakingSession(memory)).toEqual(expect.objectContaining({
      preparationDeadlineAt: "2026-10-31T10:15:00.000Z",
      notes: expect.objectContaining({ part1: "Treffpunkt am Bahnhof" }),
    }));
  });

  test("keeps focused practice separate from simulation and clears safely", () => {
    const memory = storage();
    const session = createSpeakingSession({ form: speakingForms[0], mode: "practice", partNumber: 2 });
    saveSpeakingSession(session, memory);
    expect(loadSpeakingSession(memory, "solo-simulation")).toBeNull();
    expect(loadSpeakingSession(memory, "practice").currentPart).toBe(2);
    expect(clearSpeakingSession(memory, "practice")).toBe(true);
    expect(loadSpeakingSession(memory, "practice")).toBeNull();
  });
});
