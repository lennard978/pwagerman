import { READING_CONTENT_VERSION, READING_SCORING_VERSION } from "../config/goetheB1";
import { flattenReadingItems, scoreReadingForm } from "../scoring/scoreObjectiveModule";
import { getObjectiveRemainingSeconds } from "./objectiveSession";

export const createReadingSession = ({ form, mode = "simulation", partNumber = 1, now = new Date(), durationSeconds = form.durationSeconds }) => {
  const startedAt = now.toISOString();
  return {
    sessionId: `${form.id}-${mode}-${now.getTime()}`,
    module: "reading",
    formId: form.id,
    mode,
    status: "active",
    startedAt,
    deadlineAt: mode === "simulation" ? new Date(now.getTime() + durationSeconds * 1000).toISOString() : null,
    currentPart: partNumber,
    answers: {},
    submittedAt: null,
    score: null,
    contentVersion: READING_CONTENT_VERSION,
    scoringVersion: READING_SCORING_VERSION,
    progressRecorded: false,
  };
};

export const getReadingRemainingSeconds = getObjectiveRemainingSeconds;

export const navigateReadingPart = (session, partNumber) => ({ ...session, currentPart: Math.max(1, Math.min(5, partNumber)) });

export const selectReadingAnswer = (session, form, itemId, optionId) => {
  if (session.status !== "active") return session;
  const item = flattenReadingItems(form).find(({ id }) => id === itemId);
  if (!item || !item.options.some(({ id }) => id === optionId)) return session;
  const answers = { ...session.answers };
  if (item.type === "matching" && optionId !== "0") {
    form.parts.find(({ number }) => number === 3).items.forEach((matchingItem) => {
      if (matchingItem.id !== itemId && answers[matchingItem.id] === optionId) delete answers[matchingItem.id];
    });
  }
  answers[itemId] = optionId;
  return { ...session, answers };
};

export const getReadingUnansweredCount = (session, form) => {
  const items = session.mode === "practice"
    ? form.parts.find(({ number }) => number === session.currentPart).items
    : flattenReadingItems(form);
  return items.filter(({ id }) => !session.answers[id]).length;
};

export const submitReadingSession = (session, form, now = new Date()) => ({
  ...session,
  status: "submitted",
  submittedAt: now.toISOString(),
  score: session.mode === "simulation"
    ? scoreReadingForm(form, session.answers)
    : scoreReadingForm({ ...form, parts: form.parts.filter(({ number }) => number === session.currentPart) }, session.answers),
});

export const shouldExpireReadingSession = (session, now = new Date()) =>
  session?.mode === "simulation" && session.status === "active" && getReadingRemainingSeconds(session, now) <= 0;
