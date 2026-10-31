import { createReadingSession } from "./examState";
import { createListeningSession } from "./listeningSession";
import { createWritingSession } from "./writingState";
import { createSpeakingSession } from "./speakingState";
import { loadReadingSession, saveReadingSession } from "./persistence";
import { loadListeningSession, saveListeningSession } from "./listeningPersistence";
import { loadWritingSession, saveWritingSession } from "./writingPersistence";
import { loadSpeakingSession, saveSpeakingSession } from "./speakingPersistence";
import { getReadingForm } from "../data/readingForms";
import { getListeningForm } from "../data/listeningForms";
import { getWritingForm } from "../data/writingForms";
import { getSpeakingForm } from "../data/speakingForms";

export const MOCK_MODULE_ROUTES = Object.freeze({
  reading: "/exam/reading/simulation",
  listening: "/exam/listening/simulation",
  writing: "/exam/writing/simulation",
  speaking: "/exam/speaking/pair-simulation",
});

const adapters = {
  reading: {
    load: () => loadReadingSession(undefined, "simulation"),
    create: (form, now) => createReadingSession({ form, mode: "simulation", now }),
    save: saveReadingSession,
    form: getReadingForm,
  },
  listening: {
    load: () => loadListeningSession(undefined, "simulation"),
    create: (form, now) => createListeningSession({ form, mode: "simulation", now }),
    save: saveListeningSession,
    form: getListeningForm,
  },
  writing: {
    load: () => loadWritingSession(undefined, "simulation"),
    create: (form, now) => createWritingSession({ form, mode: "simulation", now }),
    save: saveWritingSession,
    form: getWritingForm,
  },
  speaking: {
    load: () => loadSpeakingSession(undefined, "pair-simulation"),
    create: (form, now) => createSpeakingSession({ form, mode: "pair-simulation", now }),
    save: saveSpeakingSession,
    form: getSpeakingForm,
  },
};

export const loadLinkedModuleSessions = () => Object.fromEntries(
  Object.entries(adapters).map(([moduleId, adapter]) => [moduleId, adapter.load()])
);

export const getActiveModuleConflict = (moduleId, linkedSessionId = null) => {
  const existing = adapters[moduleId]?.load();
  return existing && ["active", "preparation"].includes(existing.status) && existing.sessionId !== linkedSessionId
    ? existing
    : null;
};

export const createLinkedModuleSession = (mock, moduleId, now = new Date()) => {
  const adapter = adapters[moduleId];
  const definition = mock.modules[moduleId];
  if (!adapter || !definition) return null;
  const session = adapter.create(adapter.form(definition.formId), now);
  adapter.save(session);
  return session;
};

export const isLinkedToActiveMock = (moduleId, moduleSessionId, mockSession) => Boolean(
  mockSession && ["active", "completed"].includes(mockSession.status) &&
  mockSession.modules?.[moduleId]?.sessionId === moduleSessionId
);
