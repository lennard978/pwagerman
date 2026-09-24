import { createContext, useContext, useEffect, useState } from "react";
import {
  loadProgress,
  loadProgressFromIndexedDb,
  progressWord,
  recordStudyDate,
  saveProgress,
  saveProgressToIndexedDb,
} from "../data/learningProgress";

const ProgressContext = createContext(null);

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

  const recordGrammarCompletion = ({ lessonId, route, title }) => {
    const at = new Date().toISOString();
    const activity = {
      type: "grammar",
      categoryId: lessonId,
      route,
      title,
      at,
    };
    persist((current) => ({
      ...current,
      lastActivity: activity,
      completedGrammarLessons: [
        ...new Set([...current.completedGrammarLessons, lessonId]),
      ],
      activityDates: recordStudyDate(current.activityDates),
    }));
  };

  const recordGrammarAnswer = ({ lessonId, exerciseId, correct }) => {
    const id = `${lessonId}:${exerciseId}`;
    persist((current) => {
      const existing = current.grammarMistakes.find((item) => item.id === id);
      const grammarMistakes = correct
        ? current.grammarMistakes.filter((item) => item.id !== id)
        : [
            ...current.grammarMistakes.filter((item) => item.id !== id),
            {
              id,
              lessonId,
              exerciseId,
              count: (existing?.count || 0) + 1,
              lastMissedAt: new Date().toISOString(),
              reviewEligible: true,
            },
          ].slice(-100);
      return {
        ...current,
        grammarMistakes,
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
      recordGrammarCompletion,
      recordGrammarAnswer,
      completeOnboarding,
    }}>
      {children}
    </ProgressContext.Provider>
  );
};

export const useProgress = () => useContext(ProgressContext);
