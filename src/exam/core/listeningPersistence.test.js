import { clearListeningSession, loadListeningSession, saveListeningSession } from "./listeningPersistence";
import { createListeningSession } from "./listeningSession";
import { listeningForms } from "../data/listeningForms";

const memoryStorage = () => {
  const values = new Map();
  return {
    getItem: jest.fn((key) => values.get(key) || null),
    setItem: jest.fn((key, value) => values.set(key, value)),
    removeItem: jest.fn((key) => values.delete(key)),
  };
};

describe("Listening session persistence", () => {
  test("round-trips playback allowances and keeps practice separate", () => {
    const storage = memoryStorage();
    const session = createListeningSession({ form: listeningForms[0] });
    const audioId = listeningForms[0].parts[0].audio[0].id;
    session.playbackState[audioId].playCount = 2;
    expect(saveListeningSession(session, storage)).toBe(true);
    expect(loadListeningSession(storage)).toEqual(session);
    expect(loadListeningSession(storage, "practice")).toBeNull();
    expect(clearListeningSession(storage)).toBe(true);
    expect(loadListeningSession(storage)).toBeNull();
  });

  test("rejects malformed or cross-module records", () => {
    const storage = memoryStorage();
    storage.setItem("german-b1-listening-session", "not-json");
    expect(loadListeningSession(storage)).toBeNull();
  });
});
