import { mockForms } from "../data/mockForms";
import { abandonMock, beginMock, createMockSession } from "./mockState";
import { archiveMockSession, clearMockSession, loadMockHistory, loadMockSession, saveMockSession } from "./mockPersistence";

const memory = () => { const values = new Map(); return { getItem: (key) => values.get(key) || null, setItem: (key, value) => values.set(key, value), removeItem: (key) => values.delete(key) }; };

describe("Full B1 mock persistence and resume", () => {
  test.each([
    ["instructions", (session) => session],
    ["Reading", beginMock],
    ["between Reading/Listening", (session) => ({ ...beginMock(session), currentModule: "listening", modules: { ...session.modules, reading: { ...session.modules.reading, status: "completed", sessionId: "r" } } })],
    ["Listening", (session) => ({ ...beginMock(session), currentModule: "listening", modules: { ...session.modules, listening: { ...session.modules.listening, status: "in-progress", sessionId: "l" } } })],
    ["Writing draft", (session) => ({ ...beginMock(session), currentModule: "writing", modules: { ...session.modules, writing: { ...session.modules.writing, status: "in-progress", sessionId: "w" } } })],
    ["Speaking preparation", (session) => ({ ...beginMock(session), currentModule: "speaking", modules: { ...session.modules, speaking: { ...session.modules.speaking, status: "in-progress", sessionId: "s" } } })],
    ["before summary", (session) => ({ ...beginMock(session), currentModule: "speaking" })],
  ])("restores %s state", (_label, update) => {
    const storage = memory();
    const value = update(createMockSession({ mock: mockForms[0], sessionId: `resume-${_label}` }));
    expect(saveMockSession(value, storage)).toBe(true);
    expect(loadMockSession(storage)).toEqual(value);
  });

  test("keeps bounded abandoned history and permits a new session", () => {
    const storage = memory();
    for (let index = 0; index < 23; index += 1) archiveMockSession(abandonMock(createMockSession({ mock: mockForms[index % 3], sessionId: `old-${index}` })), storage);
    expect(loadMockHistory(storage)).toHaveLength(20);
    const fresh = createMockSession({ mock: mockForms[0], sessionId: "fresh" });
    saveMockSession(fresh, storage);
    expect(loadMockSession(storage).sessionId).toBe("fresh");
    expect(loadMockHistory(storage).at(-1).sessionId).toBe("old-22");
    expect(clearMockSession(storage)).toBe(true);
    expect(loadMockSession(storage)).toBeNull();
  });
});
