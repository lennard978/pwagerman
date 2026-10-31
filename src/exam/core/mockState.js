import { MOCK_MODULE_ORDER } from "../config/goetheB1Mock";

const iso = (value = new Date()) => new Date(value).toISOString();
const makeId = (now) => `mock-b1-${new Date(now).getTime()}-${Math.random().toString(36).slice(2, 8)}`;
const moduleEntries = (mock) => Object.fromEntries(MOCK_MODULE_ORDER.map((moduleId) => [moduleId, {
  status: "not-started",
  sessionId: null,
  formId: mock.modules[moduleId].formId,
  result: null,
  startedAt: null,
  completedAt: null,
}])) ;

export const createMockSession = ({ mock, now = new Date(), sessionId = null }) => ({
  sessionId: sessionId || makeId(now),
  mockId: mock.id,
  status: "instructions",
  completed: false,
  startedAt: iso(now),
  completedAt: null,
  abandonedAt: null,
  currentModule: null,
  modules: moduleEntries(mock),
  contentVersion: mock.contentVersion,
  scoringVersion: mock.scoringVersion,
  historyRecorded: false,
});

export const beginMock = (session) => session.status === "instructions"
  ? { ...session, status: "active", currentModule: MOCK_MODULE_ORDER[0] }
  : session;

export const startMockModule = (session, moduleId, linkedSessionId, now = new Date()) => {
  if (session.status !== "active" || session.currentModule !== moduleId || !linkedSessionId) return session;
  const entry = session.modules[moduleId];
  if (!entry || entry.status === "completed") return session;
  return {
    ...session,
    modules: {
      ...session.modules,
      [moduleId]: { ...entry, status: "in-progress", sessionId: linkedSessionId, startedAt: entry.startedAt || iso(now) },
    },
  };
};

export const objectiveModuleResult = (moduleSession) => ({
  scoreStatus: "objective",
  rawScore: moduleSession.score.rawScore,
  resultScore: moduleSession.score.resultScore,
  passThreshold: 60,
  passed: moduleSession.score.resultScore >= 60,
});

const assessmentComplete = (assessment) => {
  const values = Object.values(assessment || {});
  return values.length > 0 && values.every(Number.isInteger);
};

export const productiveModuleResult = (moduleId, moduleSession) => {
  const complete = assessmentComplete(moduleSession.selfAssessment);
  const base = {
    scoreStatus: complete ? "self-assessed" : "self-assessment-incomplete",
    completed: true,
    rubric: moduleSession.selfAssessment || {},
  };
  if (moduleId === "writing") {
    const drafts = moduleSession.submittedDrafts || moduleSession.drafts || {};
    return { ...base, wordCounts: Object.fromEntries(Object.entries(drafts).map(([id, draft]) => [id, draft.wordCount || 0])) };
  }
  return { ...base, recordingCount: moduleSession.recordingIds?.length || 0 };
};

export const getMockModuleResult = (moduleId, moduleSession) => {
  if (!moduleSession || moduleSession.status !== "submitted") return null;
  return moduleId === "reading" || moduleId === "listening"
    ? objectiveModuleResult(moduleSession)
    : productiveModuleResult(moduleId, moduleSession);
};

export const completeMockModule = (session, moduleId, result, now = new Date()) => {
  if (session.status !== "active" || session.currentModule !== moduleId || !result) return session;
  const entry = session.modules[moduleId];
  if (!entry || entry.status === "completed") return session;
  const modules = {
    ...session.modules,
    [moduleId]: { ...entry, status: "completed", result, completedAt: iso(now) },
  };
  const next = MOCK_MODULE_ORDER[MOCK_MODULE_ORDER.indexOf(moduleId) + 1] || null;
  const completed = !next;
  return {
    ...session,
    modules,
    currentModule: next,
    status: completed ? "completed" : "active",
    completed,
    completedAt: completed ? iso(now) : null,
  };
};

export const markMockModuleAbandoned = (session, moduleId) => {
  const entry = session.modules[moduleId];
  if (!entry || entry.status !== "in-progress") return session;
  return { ...session, modules: { ...session.modules, [moduleId]: { ...entry, status: "abandoned" } } };
};

export const reconcileMockSession = (session, linkedSessions = {}, now = new Date()) => {
  if (!session || !["active", "completed"].includes(session.status)) return session;
  let next = session;
  MOCK_MODULE_ORDER.forEach((moduleId) => {
    const linked = linkedSessions[moduleId];
    const entry = next.modules[moduleId];
    if (!linked || linked.sessionId !== entry.sessionId || entry.status === "completed") return;
    if (linked.status === "submitted") next = completeMockModule(next, moduleId, getMockModuleResult(moduleId, linked), now);
    else if (linked.status === "abandoned") next = markMockModuleAbandoned(next, moduleId);
  });
  return next;
};

export const abandonMock = (session, now = new Date()) => ["completed", "abandoned"].includes(session.status)
  ? session
  : { ...session, status: "abandoned", abandonedAt: iso(now), currentModule: null };

export const buildMockSummary = (session) => ({
  modules: session.modules,
  objectiveThresholds: {
    met: ["reading", "listening"].filter((id) => session.modules[id].result?.passed).length,
    total: 2,
  },
  productiveAssessmentsCompleted: ["writing", "speaking"].filter((id) => session.modules[id].result?.scoreStatus === "self-assessed").length,
});

export const getMockRecommendations = (session, progress = {}) => {
  const recommendations = [];
  const reading = session.modules.reading.result;
  const listening = session.modules.listening.result;
  const writing = session.modules.writing.result;
  const speaking = session.modules.speaking.result;
  if (reading?.resultScore < 60) recommendations.push({ module: "Reading", text: "Practise weak Reading parts and review related grammar and vocabulary.", route: "/exam/reading" });
  if (listening?.resultScore < 60) recommendations.push({ module: "Listening", text: "Repeat Listening part practice and review low-performing listening skill tags.", route: "/exam/listening" });
  const average = (rubric) => { const values = Object.values(rubric || {}).filter(Number.isInteger); return values.length ? values.reduce((a, b) => a + b, 0) / values.length : null; };
  if (writing && (writing.scoreStatus !== "self-assessed" || average(writing.rubric) < 2)) recommendations.push({ module: "Writing", text: "Practise Writing tasks, connectors, register, and the phrase bank.", route: "/exam/writing" });
  if (speaking && (speaking.scoreStatus !== "self-assessed" || average(speaking.rubric) < 2)) recommendations.push({ module: "Speaking", text: "Practise interaction, presentation structure, connectors, and the Speaking phrase bank.", route: "/exam/speaking" });
  if (!recommendations.length && session.status === "completed") recommendations.push({ module: "Next step", text: "Review each submitted module and continue varied practice; this is not an official pass result.", route: "/exam/readiness" });
  return recommendations;
};
