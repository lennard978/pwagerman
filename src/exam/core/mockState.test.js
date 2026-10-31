import { mockForms } from "../data/mockForms";
import {
  abandonMock,
  beginMock,
  buildMockSummary,
  completeMockModule,
  createMockSession,
  getMockModuleResult,
  reconcileMockSession,
  startMockModule,
} from "./mockState";

const objective = (module, id, score) => ({ sessionId: id, module, status: "submitted", score: { rawScore: Math.round(score * .3), resultScore: score } });
const productive = (module, id, complete = true) => ({
  sessionId: id,
  module,
  status: "submitted",
  selfAssessment: complete ? { taskFulfilment: 2, grammar: 2 } : { taskFulfilment: null, grammar: null },
  submittedDrafts: module === "writing" ? { one: { wordCount: 80 }, two: { wordCount: 70 } } : undefined,
  recordingIds: [],
});

const advance = (session, moduleId, linked, now) => {
  const started = startMockModule(session, moduleId, linked.sessionId, now);
  return completeMockModule(started, moduleId, getMockModuleResult(moduleId, linked), now);
};

describe("Full B1 mock state", () => {
  test("runs the deterministic four-module flow without an aggregate score or passed flag", () => {
    let session = beginMock(createMockSession({ mock: mockForms[0], now: "2026-10-31T08:00:00Z", sessionId: "mock-1" }));
    session = advance(session, "reading", objective("reading", "r-1", 80), "2026-10-31T09:05:00Z");
    session = advance(session, "listening", objective("listening", "l-1", 63), "2026-10-31T09:50:00Z");
    session = advance(session, "writing", productive("writing", "w-1"), "2026-10-31T10:50:00Z");
    session = advance(session, "speaking", productive("speaking", "s-1"), "2026-10-31T11:20:00Z");
    expect(session).toEqual(expect.objectContaining({ status: "completed", completed: true, currentModule: null }));
    expect(session.modules.reading.result).toEqual(expect.objectContaining({ scoreStatus: "objective", resultScore: 80, passed: true }));
    expect(session.modules.listening.result.scoreStatus).toBe("objective");
    expect(session.modules.writing.result.scoreStatus).toBe("self-assessed");
    expect(session.modules.speaking.result.scoreStatus).toBe("self-assessed");
    expect(session).not.toHaveProperty("score");
    expect(session).not.toHaveProperty("passed");
    expect(buildMockSummary(session)).toEqual(expect.objectContaining({ objectiveThresholds: { met: 2, total: 2 }, productiveAssessmentsCompleted: 2 }));
  });

  test("productive completion remains valid when self-assessment is skipped", () => {
    const result = getMockModuleResult("writing", productive("writing", "w-2", false));
    expect(result).toEqual(expect.objectContaining({ completed: true, scoreStatus: "self-assessment-incomplete" }));
  });

  test("keeps completed modules immutable", () => {
    let session = beginMock(createMockSession({ mock: mockForms[0], sessionId: "mock-immutable" }));
    session = advance(session, "reading", objective("reading", "r-1", 60));
    const completed = session.modules.reading;
    expect(startMockModule(session, "reading", "replacement").modules.reading).toBe(completed);
    expect(completeMockModule(session, "reading", { scoreStatus: "objective", resultScore: 100 })).toBe(session);
  });

  test("reconciles linked submitted sessions and preserves IDs across resume boundaries", () => {
    let session = beginMock(createMockSession({ mock: mockForms[0], sessionId: "mock-resume" }));
    session = startMockModule(session, "reading", "reading-linked");
    const reconciled = reconcileMockSession(session, { reading: objective("reading", "reading-linked", 67) });
    expect(reconciled.modules.reading).toEqual(expect.objectContaining({ status: "completed", sessionId: "reading-linked" }));
    expect(reconciled.currentModule).toBe("listening");
  });

  test("abandons without deleting completed module data", () => {
    let session = beginMock(createMockSession({ mock: mockForms[0], sessionId: "mock-abandon" }));
    session = advance(session, "reading", objective("reading", "r-done", 73));
    const abandoned = abandonMock(session, "2026-10-31T12:00:00Z");
    expect(abandoned.status).toBe("abandoned");
    expect(abandoned.modules.reading).toEqual(session.modules.reading);
  });
});
