import { WRITING_RUBRIC } from "../config/goetheB1Writing";
import { countWritingParagraphs, countWritingWords } from "./wordCount";

const iso = (value = new Date()) => new Date(value).toISOString();
const sessionId = (now) => `writing-${new Date(now).getTime()}-${Math.random().toString(36).slice(2, 8)}`;
const emptyRubric = () => Object.fromEntries(WRITING_RUBRIC.map(({ id }) => [id, null]));

const createDraft = (task) => ({
  text: "",
  wordCount: 0,
  paragraphCount: 0,
  lastSavedAt: null,
  checklistState: Object.fromEntries(task.checklist.map((_, index) => [index, false])),
});

export const createWritingSession = ({ form, mode = "simulation", taskNumber = 1, practiceTaskId = null, now = new Date() }) => {
  const startedAt = iso(now);
  return {
    sessionId: sessionId(now),
    module: "writing",
    formId: form.id,
    mode,
    status: "active",
    startedAt,
    deadlineAt: mode === "simulation" ? iso(new Date(new Date(now).getTime() + form.durationSeconds * 1000)) : null,
    currentTask: mode === "practice" ? taskNumber : 1,
    practiceTaskId: mode === "practice" ? practiceTaskId || form.tasks.find(({ part }) => part === taskNumber)?.id : null,
    drafts: Object.fromEntries(form.tasks.map((task) => [task.id, createDraft(task)])),
    submittedDrafts: null,
    submittedAt: null,
    selfAssessment: emptyRubric(),
    assessmentCompletedAt: null,
    revisionCopies: [],
    contentVersion: form.contentVersion,
    rubricVersion: form.rubricVersion,
  };
};

export const updateWritingDraft = (session, taskId, text, now = new Date()) => {
  if (session.status !== "active" || !session.drafts[taskId]) return session;
  return {
    ...session,
    drafts: {
      ...session.drafts,
      [taskId]: {
        ...session.drafts[taskId],
        text,
        wordCount: countWritingWords(text),
        paragraphCount: countWritingParagraphs(text),
        lastSavedAt: iso(now),
      },
    },
  };
};

export const toggleWritingChecklist = (session, taskId, index, checked, now = new Date()) => {
  if (session.status !== "active" || !session.drafts[taskId]) return session;
  return {
    ...session,
    drafts: {
      ...session.drafts,
      [taskId]: {
        ...session.drafts[taskId],
        lastSavedAt: iso(now),
        checklistState: { ...session.drafts[taskId].checklistState, [index]: checked },
      },
    },
  };
};

export const navigateWritingTask = (session, taskNumber) => session.status === "active"
  ? { ...session, currentTask: Math.max(1, Math.min(3, Number(taskNumber) || 1)) }
  : session;

export const submitWritingSession = (session, now = new Date()) => {
  if (session.status !== "active") return session;
  const submittedAt = iso(now);
  const submittedDrafts = JSON.parse(JSON.stringify(session.drafts));
  return { ...session, status: "submitted", submittedAt, submittedDrafts };
};

export const abandonWritingSession = (session, now = new Date()) => session.status === "active"
  ? { ...session, status: "abandoned", abandonedAt: iso(now) }
  : session;

export const setWritingAssessment = (session, dimension, value, now = new Date()) => {
  if (session.status !== "submitted" || !WRITING_RUBRIC.some(({ id }) => id === dimension) || ![0, 1, 2, 3].includes(Number(value))) return session;
  return { ...session, selfAssessment: { ...session.selfAssessment, [dimension]: Number(value) }, assessmentUpdatedAt: iso(now) };
};

export const completeWritingAssessment = (session, now = new Date()) => {
  const complete = WRITING_RUBRIC.every(({ id }) => [0, 1, 2, 3].includes(session.selfAssessment?.[id]));
  return session.status === "submitted" && complete ? { ...session, assessmentCompletedAt: iso(now) } : session;
};

export const createWritingRevision = (session, taskId, now = new Date()) => {
  if (session.status !== "submitted" || !session.submittedDrafts?.[taskId]) return session;
  const createdAt = iso(now);
  const source = session.submittedDrafts[taskId];
  const revision = {
    id: `${session.sessionId}:${taskId}:revision-${session.revisionCopies.length + 1}`,
    sourceSessionId: session.sessionId,
    sourceTaskId: taskId,
    text: source.text,
    wordCount: source.wordCount,
    createdAt,
    updatedAt: createdAt,
  };
  return { ...session, revisionCopies: [...session.revisionCopies, revision] };
};

export const updateWritingRevision = (session, revisionId, text, now = new Date()) => ({
  ...session,
  revisionCopies: session.revisionCopies.map((revision) => revision.id === revisionId
    ? { ...revision, text, wordCount: countWritingWords(text), updatedAt: iso(now) }
    : revision),
});

export const getWritingAutomatedChecks = (task, draft) => {
  const lower = draft.text.trim().toLocaleLowerCase("de-DE");
  const emailTask = task.taskType.includes("email");
  const greeting = /^(hallo|liebe[rn]?|guten tag|sehr geehrte[rn]?)/iu.test(lower);
  const closing = /(viele grüße|liebe grüße|freundliche grüße|mit freundlichen grüßen|bis bald)/iu.test(lower.slice(-140));
  return {
    hasText: draft.wordCount > 0,
    nearTarget: draft.wordCount >= Math.round(task.approximateWordTarget * 0.7) && draft.wordCount <= Math.round(task.approximateWordTarget * 1.35),
    hasParagraphs: draft.paragraphCount >= (task.part === 3 ? 1 : 2),
    greetingPresent: emailTask ? greeting : null,
    closingPresent: emailTask ? closing : null,
    checklistComplete: Object.values(draft.checklistState).every(Boolean),
  };
};

export const getWritingRemainingSeconds = (session, now = new Date()) => {
  if (!session?.deadlineAt) return null;
  return Math.max(0, Math.ceil((new Date(session.deadlineAt).getTime() - new Date(now).getTime()) / 1000));
};
