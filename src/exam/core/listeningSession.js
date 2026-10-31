import {
  LISTENING_AUDIO_VERSION,
  LISTENING_CONTENT_VERSION,
  LISTENING_SCORING_VERSION,
} from "../config/goetheB1Listening";
import { scoreListeningForm } from "../scoring/scoreListeningModule";
import { flattenObjectiveItems } from "../scoring/scoreObjectiveModule";
import { getObjectiveRemainingSeconds } from "./objectiveSession";

const initialAudioState = () => ({
  status: "idle",
  playCount: 0,
  inProgress: false,
  startedAt: null,
  completedAt: null,
  currentTime: 0,
  preparationEndsAt: null,
  lastError: null,
});

export const createListeningSession = ({ form, mode = "simulation", partNumber = 1, now = new Date(), durationSeconds = form.durationSeconds }) => ({
  sessionId: `${form.id}-${mode}-${now.getTime()}`,
  module: "listening",
  formId: form.id,
  mode,
  status: "active",
  startedAt: now.toISOString(),
  deadlineAt: mode === "simulation" ? new Date(now.getTime() + durationSeconds * 1000).toISOString() : null,
  currentPart: partNumber,
  unlockedPart: partNumber,
  answers: {},
  playbackState: Object.fromEntries(form.parts.flatMap(({ audio }) => audio.map(({ id }) => [id, initialAudioState()]))),
  submittedAt: null,
  score: null,
  contentVersion: LISTENING_CONTENT_VERSION,
  audioVersion: LISTENING_AUDIO_VERSION,
  scoringVersion: LISTENING_SCORING_VERSION,
  progressRecorded: false,
});

const updateAudio = (session, audioId, updater) => {
  const current = session.playbackState[audioId];
  if (!current) return session;
  return { ...session, playbackState: { ...session.playbackState, [audioId]: updater(current) } };
};

export const beginListeningPreparation = (session, audio, now = new Date()) => {
  const state = session.playbackState[audio.id];
  if (session.status !== "active" || !state || state.status === "playing" || (!state.inProgress && state.playCount >= audio.playbackLimit)) return session;
  return updateAudio(session, audio.id, (current) => ({
    ...current,
    status: "pre-reading",
    preparationEndsAt: new Date(now.getTime() + Math.max(0, audio.preparationSeconds || 0) * 1000).toISOString(),
    lastError: null,
  }));
};

export const markListeningAudioReady = (session, audioId) =>
  updateAudio(session, audioId, (current) => ({ ...current, status: "ready", preparationEndsAt: null }));

export const markListeningPlaybackStarted = (session, audio, now = new Date()) => {
  const state = session.playbackState[audio.id];
  if (!state || session.status !== "active" || (!state.inProgress && state.playCount >= audio.playbackLimit)) return session;
  return updateAudio(session, audio.id, (current) => ({
    ...current,
    status: "playing",
    playCount: current.inProgress ? current.playCount : current.playCount + 1,
    inProgress: true,
    startedAt: current.inProgress ? current.startedAt : now.toISOString(),
    lastError: null,
  }));
};

export const updateListeningPlaybackTime = (session, audioId, currentTime) =>
  updateAudio(session, audioId, (current) => ({ ...current, currentTime: Math.max(0, currentTime) }));

export const interruptListeningPlayback = (session, audioId, currentTime = 0) =>
  updateAudio(session, audioId, (current) => ({ ...current, status: "ready", inProgress: true, currentTime: Math.max(0, currentTime) }));

export const failListeningPlaybackStart = (session, audioId, reason = "playback-error") =>
  updateAudio(session, audioId, (current) => ({
    ...current,
    status: "ready",
    playCount: current.inProgress ? current.playCount : Math.max(0, current.playCount),
    lastError: reason,
  }));

export const finishListeningPlayback = (session, audio, now = new Date()) =>
  updateAudio(session, audio.id, (current) => ({
    ...current,
    status: current.playCount < audio.playbackLimit ? "pause-between" : "finished",
    inProgress: false,
    currentTime: 0,
    completedAt: current.playCount >= audio.playbackLimit ? now.toISOString() : current.completedAt,
  }));

export const canStartListeningAudio = (session, audio) => {
  const state = session.playbackState[audio.id];
  return Boolean(state && session.status === "active" && (state.inProgress || state.playCount < audio.playbackLimit));
};

export const selectListeningAnswer = (session, form, itemId, optionId) => {
  if (session.status !== "active") return session;
  const item = flattenObjectiveItems(form).find(({ id }) => id === itemId);
  if (!item || !item.options.some(({ id }) => id === optionId)) return session;
  return { ...session, answers: { ...session.answers, [itemId]: optionId } };
};

export const isListeningPartPlaybackComplete = (session, form, partNumber = session.currentPart) => {
  const part = form.parts.find(({ number }) => number === partNumber);
  return Boolean(part && part.audio.every((audio) => session.playbackState[audio.id]?.playCount >= audio.playbackLimit && !session.playbackState[audio.id]?.inProgress));
};

export const navigateListeningPart = (session, form, targetPart) => {
  if (targetPart < 1 || targetPart > 4 || targetPart > session.unlockedPart) return session;
  return { ...session, currentPart: targetPart };
};

export const advanceListeningPart = (session, form) => {
  if (!isListeningPartPlaybackComplete(session, form) || session.currentPart >= 4) return session;
  const nextPart = session.currentPart + 1;
  return { ...session, currentPart: nextPart, unlockedPart: Math.max(session.unlockedPart, nextPart) };
};

export const getListeningUnansweredCount = (session, form) => {
  const items = session.mode === "practice"
    ? form.parts.find(({ number }) => number === session.currentPart).items
    : flattenObjectiveItems(form);
  return items.filter(({ id }) => !session.answers[id]).length;
};

export const submitListeningSession = (session, form, now = new Date()) => ({
  ...session,
  status: "submitted",
  submittedAt: now.toISOString(),
  score: session.mode === "simulation"
    ? scoreListeningForm(form, session.answers)
    : scoreListeningForm({ ...form, parts: form.parts.filter(({ number }) => number === session.currentPart) }, session.answers),
});

export const shouldExpireListeningSession = (session, now = new Date()) =>
  session?.mode === "simulation" && session.status === "active" && getObjectiveRemainingSeconds(session, now) <= 0;
