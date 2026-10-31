import {
  idbGetProgress,
  idbSaveProgress,
  isIndexedDbSupported,
} from "./storage/idbMyWordsStore";
import {
  MY_WORDS_MIGRATED_KEY,
  MY_WORDS_STORAGE_KEY,
  WORD_STATUSES_STORAGE_KEY,
} from "./myWords";
import { STORAGE_CONFIG } from "../config/course";
import { normalizeGrammarLessonStates } from "./grammar/state";

export const PROGRESS_STORAGE_KEY = STORAGE_CONFIG.learningProgress;
export const PROGRESS_VERSION = 10;

const localDate = (date = new Date()) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const existingUser = (storage) => {
  try {
    return Boolean(
      storage.getItem(MY_WORDS_STORAGE_KEY) ||
      storage.getItem(WORD_STATUSES_STORAGE_KEY) ||
      storage.getItem(MY_WORDS_MIGRATED_KEY)
    );
  } catch (error) {
    return false;
  }
};

export const createDefaultProgress = (storage = window.localStorage) => ({
  version: PROGRESS_VERSION,
  lastActivity: null,
  completedLessons: [],
  completedExercises: [],
  completedGrammarLessons: [],
  grammarLessonStates: [],
  grammarMistakes: [],
  completedExamReadingTasks: [],
  completedExamListeningTasks: [],
  completedExamPrepSessions: [],
  examPrepBestScores: {},
  completedMockExams: [],
  latestMockScore: null,
  bestMockScore: 0,
  bestMockSectionScores: {},
  readingProgress: {
    practicePartsCompleted: [],
    simulationsCompleted: 0,
    latestRawScore: null,
    latestResultScore: null,
    bestResultScore: 0,
    latestDate: null,
    skillPerformance: {},
    attemptHistory: [],
  },
  listeningProgress: {
    practicePartsCompleted: [],
    simulationsCompleted: 0,
    latestRawScore: null,
    latestResultScore: null,
    bestResultScore: 0,
    latestDate: null,
    skillPerformance: {},
    attemptHistory: [],
  },
  writingProgress: {
    taskPracticesCompleted: { 1: 0, 2: 0, 3: 0 },
    simulationsCompleted: 0,
    latestDate: null,
    recentWordCounts: [],
    rubricTrends: {},
    attemptHistory: [],
  },
  speakingProgress: {
    partPracticesCompleted: { 1: 0, 2: 0, 3: 0 },
    soloSimulationsCompleted: 0,
    pairSimulationsCompleted: 0,
    latestDate: null,
    recentSelfAssessment: null,
    rubricTrends: {},
    recentRecordingMetadata: [],
    attemptHistory: [],
  },
  mockProgress: {
    version: 1,
    mocksStarted: 0,
    mocksCompleted: 0,
    mocksAbandoned: 0,
    latestMock: null,
    recentHistory: [],
    objectiveThresholdsMet: { reading: 0, listening: 0 },
    selfAssessmentsCompleted: { writing: 0, speaking: 0 },
    readinessIndicators: {},
  },
  recentMistakes: [],
  activityDates: [],
  onboardingComplete: existingUser(storage),
});

export const normalizeProgress = (value, storage = window.localStorage) => {
  const defaults = createDefaultProgress(storage);
  if (!value || typeof value !== "object") return defaults;
  return {
    ...defaults,
    ...value,
    version: PROGRESS_VERSION,
    completedLessons: Array.isArray(value.completedLessons) ? value.completedLessons : [],
    completedExercises: Array.isArray(value.completedExercises) ? value.completedExercises.slice(-200) : [],
    completedGrammarLessons: Array.isArray(value.completedGrammarLessons)
      ? [...new Set(value.completedGrammarLessons)]
      : [],
    grammarLessonStates: normalizeGrammarLessonStates(value.grammarLessonStates),
    grammarMistakes: Array.isArray(value.grammarMistakes) ? value.grammarMistakes.slice(-100) : [],
    completedExamReadingTasks: Array.isArray(value.completedExamReadingTasks)
      ? [...new Set(value.completedExamReadingTasks)]
      : [],
    completedExamListeningTasks: Array.isArray(value.completedExamListeningTasks)
      ? [...new Set(value.completedExamListeningTasks)]
      : [],
    completedExamPrepSessions: Array.isArray(value.completedExamPrepSessions)
      ? value.completedExamPrepSessions.slice(-100)
      : [],
    examPrepBestScores: value.examPrepBestScores &&
      typeof value.examPrepBestScores === "object" &&
      !Array.isArray(value.examPrepBestScores)
      ? value.examPrepBestScores
      : {},
    completedMockExams: Array.isArray(value.completedMockExams)
      ? value.completedMockExams.slice(-50)
      : [],
    latestMockScore: value.latestMockScore &&
      typeof value.latestMockScore === "object" &&
      !Array.isArray(value.latestMockScore)
      ? value.latestMockScore
      : null,
    bestMockScore: Number.isFinite(value.bestMockScore)
      ? value.bestMockScore
      : 0,
    bestMockSectionScores: value.bestMockSectionScores &&
      typeof value.bestMockSectionScores === "object" &&
      !Array.isArray(value.bestMockSectionScores)
      ? value.bestMockSectionScores
      : {},
    readingProgress: {
      ...defaults.readingProgress,
      ...(value.readingProgress && typeof value.readingProgress === "object" && !Array.isArray(value.readingProgress)
        ? value.readingProgress
        : {}),
      practicePartsCompleted: Array.isArray(value.readingProgress?.practicePartsCompleted)
        ? [...new Set(value.readingProgress.practicePartsCompleted)]
        : [],
      simulationsCompleted: Number.isFinite(value.readingProgress?.simulationsCompleted)
        ? value.readingProgress.simulationsCompleted
        : 0,
      bestResultScore: Number.isFinite(value.readingProgress?.bestResultScore)
        ? value.readingProgress.bestResultScore
        : 0,
      skillPerformance: value.readingProgress?.skillPerformance && typeof value.readingProgress.skillPerformance === "object"
        ? value.readingProgress.skillPerformance
        : {},
      attemptHistory: Array.isArray(value.readingProgress?.attemptHistory)
        ? value.readingProgress.attemptHistory.slice(-20)
        : [],
    },
    listeningProgress: {
      ...defaults.listeningProgress,
      ...(value.listeningProgress && typeof value.listeningProgress === "object" && !Array.isArray(value.listeningProgress)
        ? value.listeningProgress
        : {}),
      practicePartsCompleted: Array.isArray(value.listeningProgress?.practicePartsCompleted)
        ? [...new Set(value.listeningProgress.practicePartsCompleted)]
        : [],
      simulationsCompleted: Number.isFinite(value.listeningProgress?.simulationsCompleted)
        ? value.listeningProgress.simulationsCompleted
        : 0,
      bestResultScore: Number.isFinite(value.listeningProgress?.bestResultScore)
        ? value.listeningProgress.bestResultScore
        : 0,
      skillPerformance: value.listeningProgress?.skillPerformance && typeof value.listeningProgress.skillPerformance === "object"
        ? value.listeningProgress.skillPerformance
        : {},
      attemptHistory: Array.isArray(value.listeningProgress?.attemptHistory)
        ? value.listeningProgress.attemptHistory.slice(-20)
        : [],
    },
    writingProgress: {
      ...defaults.writingProgress,
      ...(value.writingProgress && typeof value.writingProgress === "object" && !Array.isArray(value.writingProgress)
        ? value.writingProgress
        : {}),
      taskPracticesCompleted: value.writingProgress?.taskPracticesCompleted && typeof value.writingProgress.taskPracticesCompleted === "object"
        ? { ...defaults.writingProgress.taskPracticesCompleted, ...value.writingProgress.taskPracticesCompleted }
        : defaults.writingProgress.taskPracticesCompleted,
      simulationsCompleted: Number.isFinite(value.writingProgress?.simulationsCompleted)
        ? value.writingProgress.simulationsCompleted
        : 0,
      recentWordCounts: Array.isArray(value.writingProgress?.recentWordCounts)
        ? value.writingProgress.recentWordCounts.slice(-20)
        : [],
      rubricTrends: value.writingProgress?.rubricTrends && typeof value.writingProgress.rubricTrends === "object"
        ? value.writingProgress.rubricTrends
        : {},
      attemptHistory: Array.isArray(value.writingProgress?.attemptHistory)
        ? value.writingProgress.attemptHistory.slice(-20)
        : [],
    },
    speakingProgress: {
      ...defaults.speakingProgress,
      ...(value.speakingProgress && typeof value.speakingProgress === "object" && !Array.isArray(value.speakingProgress)
        ? value.speakingProgress
        : {}),
      partPracticesCompleted: value.speakingProgress?.partPracticesCompleted && typeof value.speakingProgress.partPracticesCompleted === "object"
        ? { ...defaults.speakingProgress.partPracticesCompleted, ...value.speakingProgress.partPracticesCompleted }
        : defaults.speakingProgress.partPracticesCompleted,
      soloSimulationsCompleted: Number.isFinite(value.speakingProgress?.soloSimulationsCompleted)
        ? value.speakingProgress.soloSimulationsCompleted
        : 0,
      pairSimulationsCompleted: Number.isFinite(value.speakingProgress?.pairSimulationsCompleted)
        ? value.speakingProgress.pairSimulationsCompleted
        : 0,
      recentSelfAssessment: value.speakingProgress?.recentSelfAssessment && typeof value.speakingProgress.recentSelfAssessment === "object"
        ? value.speakingProgress.recentSelfAssessment
        : null,
      rubricTrends: value.speakingProgress?.rubricTrends && typeof value.speakingProgress.rubricTrends === "object"
        ? value.speakingProgress.rubricTrends
        : {},
      recentRecordingMetadata: Array.isArray(value.speakingProgress?.recentRecordingMetadata)
        ? value.speakingProgress.recentRecordingMetadata.slice(-20)
        : [],
      attemptHistory: Array.isArray(value.speakingProgress?.attemptHistory)
        ? value.speakingProgress.attemptHistory.slice(-20)
        : [],
    },
    mockProgress: {
      ...defaults.mockProgress,
      ...(value.mockProgress && typeof value.mockProgress === "object" && !Array.isArray(value.mockProgress)
        ? value.mockProgress
        : {}),
      version: 1,
      mocksStarted: Number.isFinite(value.mockProgress?.mocksStarted) ? value.mockProgress.mocksStarted : 0,
      mocksCompleted: Number.isFinite(value.mockProgress?.mocksCompleted) ? value.mockProgress.mocksCompleted : 0,
      mocksAbandoned: Number.isFinite(value.mockProgress?.mocksAbandoned) ? value.mockProgress.mocksAbandoned : 0,
      latestMock: value.mockProgress?.latestMock && typeof value.mockProgress.latestMock === "object" ? value.mockProgress.latestMock : null,
      recentHistory: Array.isArray(value.mockProgress?.recentHistory) ? value.mockProgress.recentHistory.slice(-20) : [],
      objectiveThresholdsMet: value.mockProgress?.objectiveThresholdsMet && typeof value.mockProgress.objectiveThresholdsMet === "object"
        ? { ...defaults.mockProgress.objectiveThresholdsMet, ...value.mockProgress.objectiveThresholdsMet }
        : defaults.mockProgress.objectiveThresholdsMet,
      selfAssessmentsCompleted: value.mockProgress?.selfAssessmentsCompleted && typeof value.mockProgress.selfAssessmentsCompleted === "object"
        ? { ...defaults.mockProgress.selfAssessmentsCompleted, ...value.mockProgress.selfAssessmentsCompleted }
        : defaults.mockProgress.selfAssessmentsCompleted,
      readinessIndicators: value.mockProgress?.readinessIndicators && typeof value.mockProgress.readinessIndicators === "object"
        ? value.mockProgress.readinessIndicators
        : {},
    },
    recentMistakes: Array.isArray(value.recentMistakes) ? value.recentMistakes.slice(-100) : [],
    activityDates: Array.isArray(value.activityDates) ? [...new Set(value.activityDates)].slice(-365) : [],
    onboardingComplete: typeof value.onboardingComplete === "boolean"
      ? value.onboardingComplete
      : defaults.onboardingComplete,
  };
};

export const loadProgress = (storage = window.localStorage) => {
  try {
    return normalizeProgress(
      JSON.parse(storage.getItem(PROGRESS_STORAGE_KEY) || "null"),
      storage
    );
  } catch (error) {
    return createDefaultProgress(storage);
  }
};

export const saveProgress = (progress, storage = window.localStorage) => {
  try {
    storage.setItem(PROGRESS_STORAGE_KEY, JSON.stringify(progress));
    return true;
  } catch (error) {
    return false;
  }
};

export const loadProgressFromIndexedDb = async ({
  storage = window.localStorage,
  idbFactory,
} = {}) => {
  if (!isIndexedDbSupported(idbFactory)) return null;
  try {
    const stored = await idbGetProgress(idbFactory);
    if (stored) return normalizeProgress(stored, storage);
    const fallback = loadProgress(storage);
    await idbSaveProgress(fallback, idbFactory);
    return fallback;
  } catch (error) {
    return null;
  }
};

export const saveProgressToIndexedDb = async (progress, idbFactory) => {
  if (!isIndexedDbSupported(idbFactory)) return false;
  try {
    await idbSaveProgress(progress, idbFactory);
    return true;
  } catch (error) {
    return false;
  }
};

export const progressWord = (word) => {
  if (!word) return null;
  const source = word.source || word.prompt || "";
  const target = word.target || word.correctAnswer || word.answer || "";
  if (!source || !target) return null;
  return {
    id: word.id || word.wordId || `${source}|${target}`,
    source,
    target,
    kind: word.kind || "built-in",
    lemma: word.lemma || target,
    article: word.article || null,
    plural: word.plural || null,
    partOfSpeech: word.partOfSpeech || null,
    separablePrefix: word.separablePrefix || null,
    auxiliary: word.auxiliary || null,
    pastParticiple: word.pastParticiple || null,
    caseGovernment: word.caseGovernment || null,
    prepositions: Array.isArray(word.prepositions) ? word.prepositions : [],
    example: word.example || null,
    exampleTranslation: word.exampleTranslation || null,
  };
};

export const recordStudyDate = (dates, date = new Date()) =>
  [...new Set([...dates, localDate(date)])].slice(-365);

export const getCurrentStreak = (dates, now = new Date()) => {
  const active = new Set(dates);
  let cursor = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  let streak = 0;
  while (active.has(localDate(cursor))) {
    streak += 1;
    cursor.setDate(cursor.getDate() - 1);
  }
  return streak;
};
