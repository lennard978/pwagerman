import { createContext, useContext, useEffect, useState } from "react";
import {
  loadProgress,
  loadProgressFromIndexedDb,
  progressWord,
  recordStudyDate,
  saveProgress,
  saveProgressToIndexedDb,
} from "../data/learningProgress";
import {
  completeGrammarLessonState,
  getGrammarState,
  openGrammarLessonState,
  recordGrammarStateAnswer,
} from "../data/grammar/state";
import { getGrammarCorrectAnswer } from "../data/grammar/exercises";

const ProgressContext = createContext(null);

const replaceGrammarState = (states, nextState) => [
  ...states.filter(({ grammarLessonId }) => grammarLessonId !== nextState.grammarLessonId),
  nextState,
];

const readableResponse = (response) => {
  if (Array.isArray(response)) return response.join(" · ");
  if (response && typeof response === "object") return Object.values(response).join(" · ");
  return String(response ?? "");
};

export const ProgressProvider = ({ children }) => {
  const [progress, setProgress] = useState(() => loadProgress());

  useEffect(() => {
    let cancelled = false;
    loadProgressFromIndexedDb().then((stored) => {
      if (!cancelled && stored) setProgress(stored);
    });
    return () => { cancelled = true; };
  }, []);

  const persist = (update) => {
    setProgress((current) => {
      const next = typeof update === "function" ? update(current) : update;
      saveProgress(next);
      saveProgressToIndexedDb(next);
      return next;
    });
  };

  const recordCompletion = ({ type, categoryId, route, titleKey }) => {
    const at = new Date().toISOString();
    const activity = { type, categoryId, route, titleKey, at };
    persist((current) => ({
      ...current,
      lastActivity: activity,
      completedLessons: type === "lesson"
        ? [...new Set([...current.completedLessons, categoryId])]
        : current.completedLessons,
      completedExercises: type === "lesson"
        ? current.completedExercises
        : [...current.completedExercises, activity].slice(-200),
      activityDates: recordStudyDate(current.activityDates),
    }));
  };

  const recordAnswer = (wordValue, correct) => {
    const word = progressWord(wordValue);
    if (!word) return;
    persist((current) => {
      const existing = current.recentMistakes.find((item) => item.word.id === word.id);
      const recentMistakes = correct
        ? current.recentMistakes.filter((item) => item.word.id !== word.id)
        : [
            ...current.recentMistakes.filter((item) => item.word.id !== word.id),
            {
              word,
              count: (existing?.count || 0) + 1,
              lastMissedAt: new Date().toISOString(),
            },
          ].slice(-100);
      return {
        ...current,
        recentMistakes,
        activityDates: recordStudyDate(current.activityDates),
      };
    });
  };

  const recordGrammarOpened = (grammarLessonId) => {
    const at = new Date();
    persist((current) => ({
      ...current,
      grammarLessonStates: replaceGrammarState(
        current.grammarLessonStates,
        openGrammarLessonState(getGrammarState(current.grammarLessonStates, grammarLessonId), at)
      ),
    }));
  };

  const recordGrammarCompletion = ({ lessonId, route, title, score = null, total = null, reviewed = false }) => {
    const at = new Date().toISOString();
    const activity = {
      type: "grammar",
      categoryId: lessonId,
      route,
      title,
      score,
      total,
      reviewed,
      at,
    };
    persist((current) => ({
      ...current,
      lastActivity: activity,
      completedGrammarLessons: [
        ...new Set([...current.completedGrammarLessons, lessonId]),
      ],
      grammarLessonStates: replaceGrammarState(
        current.grammarLessonStates,
        completeGrammarLessonState(getGrammarState(current.grammarLessonStates, lessonId), new Date(at))
      ),
      activityDates: recordStudyDate(current.activityDates),
    }));
  };

  const recordGrammarAnswer = ({ lessonId, exerciseId, exercise, learnerAnswer, correct }) => {
    const resolvedExerciseId = exercise?.id || exerciseId;
    const id = `${lessonId}:${resolvedExerciseId}`;
    persist((current) => {
      const existing = current.grammarMistakes.find((item) => item.id === id);
      const grammarMistakes = correct
        ? current.grammarMistakes.map((item) => item.id === id
          ? { ...item, resolvedAt: new Date().toISOString(), reviewEligible: false }
          : item)
        : [
            ...current.grammarMistakes.filter((item) => item.id !== id),
            {
              id,
              grammarLessonId: lessonId,
              lessonId,
              exerciseId: resolvedExerciseId,
              prompt: exercise?.prompt || existing?.prompt || "Grammar practice question",
              learnerAnswer: readableResponse(learnerAnswer),
              correctAnswer: exercise ? getGrammarCorrectAnswer(exercise) : existing?.correctAnswer || "",
              explanation: exercise?.explanation || existing?.explanation || "Review the lesson rule and try again.",
              count: (existing?.count || 0) + 1,
              createdAt: existing?.createdAt || new Date().toISOString(),
              lastMissedAt: new Date().toISOString(),
              resolvedAt: null,
              reviewEligible: true,
            },
          ].slice(-100);
      const currentState = getGrammarState(current.grammarLessonStates, lessonId);
      return {
        ...current,
        grammarMistakes,
        grammarLessonStates: replaceGrammarState(
          current.grammarLessonStates,
          recordGrammarStateAnswer(currentState, correct)
        ),
        activityDates: recordStudyDate(current.activityDates),
      };
    });
  };

  const resolveGrammarMistake = (mistakeId) => persist((current) => ({
    ...current,
    grammarMistakes: current.grammarMistakes.map((item) => item.id === mistakeId
      ? { ...item, resolvedAt: new Date().toISOString(), reviewEligible: false }
      : item),
  }));

  const recordExamPrepCompletion = ({ area, taskId, score, total, route, title }) => {
    const at = new Date().toISOString();
    const percentage = total > 0 ? Math.round((score / total) * 100) : 0;
    const activity = {
      type: "exam-prep",
      area,
      taskId,
      route,
      title,
      score,
      total,
      percentage,
      at,
    };
    persist((current) => ({
      ...current,
      lastActivity: activity,
      completedExamReadingTasks: area === "reading"
        ? [...new Set([...current.completedExamReadingTasks, taskId])]
        : current.completedExamReadingTasks,
      completedExamListeningTasks: area === "listening"
        ? [...new Set([...current.completedExamListeningTasks, taskId])]
        : current.completedExamListeningTasks,
      completedExamPrepSessions: [
        ...current.completedExamPrepSessions,
        activity,
      ].slice(-100),
      examPrepBestScores: {
        ...current.examPrepBestScores,
        [area]: Math.max(current.examPrepBestScores[area] || 0, percentage),
      },
      activityDates: recordStudyDate(current.activityDates),
    }));
  };

  const recordMockCompletion = ({
    mockId,
    seed,
    score,
    total,
    sectionScores,
    route,
  }) => {
    const at = new Date().toISOString();
    const percentage = total > 0 ? Math.round((score / total) * 100) : 0;
    const result = {
      mockId,
      seed,
      score,
      total,
      percentage,
      sectionScores,
      at,
    };
    const activity = {
      type: "exam-prep",
      area: "mock-a1",
      route,
      title: "Mock A1",
      ...result,
    };
    persist((current) => ({
      ...current,
      lastActivity: activity,
      completedMockExams: [...current.completedMockExams, result].slice(-50),
      latestMockScore: result,
      bestMockScore: Math.max(current.bestMockScore || 0, score),
      bestMockSectionScores: sectionScores.reduce(
        (best, section) => ({
          ...best,
          [section.id]: Math.max(best[section.id] || 0, section.score),
        }),
        current.bestMockSectionScores
      ),
      activityDates: recordStudyDate(current.activityDates),
    }));
  };

  const recordReadingAttempt = ({ session, score }) => {
    const at = session.submittedAt || new Date().toISOString();
    const attempt = {
      id: session.sessionId,
      formId: session.formId,
      mode: session.mode,
      partNumber: session.mode === "practice" ? session.currentPart : null,
      rawScore: score.rawScore,
      total: score.total,
      resultScore: score.resultScore,
      passed: score.passed,
      partBreakdown: score.partBreakdown,
      skillPerformance: score.skillPerformance,
      contentVersion: session.contentVersion,
      scoringVersion: session.scoringVersion,
      at,
    };
    persist((current) => {
      if (current.readingProgress.attemptHistory.some(({ id }) => id === attempt.id)) return current;
      const simulation = session.mode === "simulation";
      const practiceKey = `${session.formId}:part-${session.currentPart}`;
      const skillPerformance = Object.fromEntries(
        [...new Set([...Object.keys(current.readingProgress.skillPerformance), ...Object.keys(score.skillPerformance)])]
          .map((skill) => {
            const previous = current.readingProgress.skillPerformance[skill] || { correct: 0, total: 0 };
            const latest = score.skillPerformance[skill] || { correct: 0, total: 0 };
            const correct = previous.correct + latest.correct;
            const total = previous.total + latest.total;
            return [skill, { correct, total, percentage: total ? Math.round((correct / total) * 100) : 0 }];
          })
      );
      return {
        ...current,
        lastActivity: {
          type: "exam-reading",
          route: "/exam/reading",
          title: simulation ? "B1 Reading simulation" : `B1 Reading Part ${session.currentPart}`,
          at,
        },
        readingProgress: {
          ...current.readingProgress,
          practicePartsCompleted: simulation
            ? current.readingProgress.practicePartsCompleted
            : [...new Set([...current.readingProgress.practicePartsCompleted, practiceKey])],
          simulationsCompleted: current.readingProgress.simulationsCompleted + (simulation ? 1 : 0),
          latestRawScore: simulation ? score.rawScore : current.readingProgress.latestRawScore,
          latestResultScore: simulation ? score.resultScore : current.readingProgress.latestResultScore,
          bestResultScore: simulation
            ? Math.max(current.readingProgress.bestResultScore || 0, score.resultScore)
            : current.readingProgress.bestResultScore,
          latestDate: simulation ? at : current.readingProgress.latestDate,
          skillPerformance,
          attemptHistory: [...current.readingProgress.attemptHistory, attempt].slice(-20),
        },
        activityDates: recordStudyDate(current.activityDates),
      };
    });
  };

  const recordListeningAttempt = ({ session, score }) => {
    const at = session.submittedAt || new Date().toISOString();
    const attempt = {
      id: session.sessionId,
      formId: session.formId,
      mode: session.mode,
      partNumber: session.mode === "practice" ? session.currentPart : null,
      rawScore: score.rawScore,
      total: score.total,
      resultScore: score.resultScore,
      passed: score.passed,
      partBreakdown: score.partBreakdown,
      skillPerformance: score.skillPerformance,
      contentVersion: session.contentVersion,
      scoringVersion: session.scoringVersion,
      audioVersion: session.audioVersion,
      at,
    };
    persist((current) => {
      if (current.listeningProgress.attemptHistory.some(({ id }) => id === attempt.id)) return current;
      const simulation = session.mode === "simulation";
      const practiceKey = `${session.formId}:part-${session.currentPart}`;
      const skillPerformance = Object.fromEntries(
        [...new Set([...Object.keys(current.listeningProgress.skillPerformance), ...Object.keys(score.skillPerformance)])]
          .map((skill) => {
            const previous = current.listeningProgress.skillPerformance[skill] || { correct: 0, total: 0 };
            const latest = score.skillPerformance[skill] || { correct: 0, total: 0 };
            const correct = previous.correct + latest.correct;
            const total = previous.total + latest.total;
            return [skill, { correct, total, percentage: total ? Math.round((correct / total) * 100) : 0 }];
          })
      );
      return {
        ...current,
        lastActivity: {
          type: "exam-listening",
          route: "/exam/listening",
          title: simulation ? "B1 Listening simulation" : `B1 Listening Part ${session.currentPart}`,
          at,
        },
        listeningProgress: {
          ...current.listeningProgress,
          practicePartsCompleted: simulation
            ? current.listeningProgress.practicePartsCompleted
            : [...new Set([...current.listeningProgress.practicePartsCompleted, practiceKey])],
          simulationsCompleted: current.listeningProgress.simulationsCompleted + (simulation ? 1 : 0),
          latestRawScore: simulation ? score.rawScore : current.listeningProgress.latestRawScore,
          latestResultScore: simulation ? score.resultScore : current.listeningProgress.latestResultScore,
          bestResultScore: simulation
            ? Math.max(current.listeningProgress.bestResultScore || 0, score.resultScore)
            : current.listeningProgress.bestResultScore,
          latestDate: at,
          skillPerformance,
          attemptHistory: [...current.listeningProgress.attemptHistory, attempt].slice(-20),
        },
        activityDates: recordStudyDate(current.activityDates),
      };
    });
  };

  const completeOnboarding = () =>
    persist((current) => ({ ...current, onboardingComplete: true }));

  return (
    <ProgressContext.Provider value={{
      progress,
      recordCompletion,
      recordAnswer,
      recordGrammarOpened,
      recordGrammarCompletion,
      recordGrammarAnswer,
      resolveGrammarMistake,
      recordExamPrepCompletion,
      recordMockCompletion,
      recordReadingAttempt,
      recordListeningAttempt,
      completeOnboarding,
    }}>
      {children}
    </ProgressContext.Provider>
  );
};

export const useProgress = () => useContext(ProgressContext);
