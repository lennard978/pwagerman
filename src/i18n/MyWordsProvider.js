import { createContext, useContext, useEffect, useMemo, useState } from "react";
import {
  duplicateWord,
  loadMyWords,
  loadMyWordsFromIndexedDb,
  loadWordStatuses,
  loadWordStatusesFromIndexedDb,
  MY_WORDS_MAX_LENGTH,
  normalizeWord,
  saveMyWords,
  saveMyWordsToIndexedDb,
  saveWordStatuses,
  saveWordStatusesToIndexedDb,
  normalizeCustomWord,
} from "../data/myWords";
import { GermanCurriculum } from "../data/vocabulary/curriculum";
import {
  createLexemeState,
  mergeLexemeState,
  recordLexemeAnswer as updateAnswerState,
} from "../data/lexemeState";

const MyWordsContext = createContext(null);

export const MyWordsProvider = ({ children }) => {
  const [words, setWords] = useState(() => loadMyWords());
  const [wordStatuses, setWordStatuses] = useState(() => loadWordStatuses());

  // localStorage renders instantly; IndexedDB (when supported) is loaded in
  // the background and takes over as the source of truth once ready, so a
  // Safari/iOS storage weakness in one store doesn't lose saved words.
  useEffect(() => {
    let cancelled = false;
    loadMyWordsFromIndexedDb().then((idbWords) => {
      if (cancelled || idbWords === null) return;
      setWords(idbWords);
    });
    loadWordStatusesFromIndexedDb().then((idbStatuses) => {
      if (cancelled || idbStatuses === null) return;
      if (idbStatuses.length > 0) setWordStatuses(idbStatuses);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const persist = (nextWords) => {
    setWords(nextWords);
    saveMyWords(nextWords);
    saveMyWordsToIndexedDb(nextWords);
  };

  const persistStatuses = (nextStatuses) => {
    setWordStatuses(nextStatuses);
    saveWordStatuses(nextStatuses);
    saveWordStatusesToIndexedDb(nextStatuses);
  };

  const addWord = (sourceValue, targetValue, metadata = {}) => {
    const source = normalizeWord(sourceValue);
    const target = normalizeWord(targetValue);
    if (!source || !target) return { error: "blank" };
    if (source.length > MY_WORDS_MAX_LENGTH || target.length > MY_WORDS_MAX_LENGTH) {
      return { error: "length" };
    }
    if (duplicateWord(words, source, target)) return { error: "duplicate" };
    const id = typeof crypto !== "undefined" && crypto.randomUUID
      ? crypto.randomUUID()
      : `${Date.now()}-${Math.random().toString(36).slice(2)}`;
    const word = normalizeCustomWord({
      id,
      source,
      target,
      article: metadata.article || null,
      plural: normalizeWord(metadata.plural) || null,
      note: normalizeWord(metadata.note) || null,
      createdAt: new Date().toISOString(),
      kind: "custom",
    });
    persist([...words, word]);
    return { word };
  };

  const updateWord = (id, sourceValue, targetValue, metadata = {}) => {
    const source = normalizeWord(sourceValue);
    const target = normalizeWord(targetValue);
    if (!source || !target) return { error: "blank" };
    if (source.length > MY_WORDS_MAX_LENGTH || target.length > MY_WORDS_MAX_LENGTH) {
      return { error: "length" };
    }
    if (duplicateWord(words, source, target, id)) return { error: "duplicate" };
    const changes = {
      source,
      target,
      article: metadata.article || null,
      plural: normalizeWord(metadata.plural) || null,
      note: normalizeWord(metadata.note) || null,
    };
    persist(words.map((word) => (word.id === id ? { ...word, ...changes } : word)));
    return { word: { id, ...changes } };
  };

  const deleteWord = (id) => {
    persist(words.filter((word) => word.id !== id));
    persistStatuses(wordStatuses.filter((entry) => entry.lexemeId !== id));
  };

  const stateByLexemeId = useMemo(
    () => new Map(wordStatuses.map((state) => [state.lexemeId, state])),
    [wordStatuses]
  );
  const curriculumWords = useMemo(() => GermanCurriculum.flatMap((lesson) =>
    lesson.items.map((word) => mergeLexemeState(word, stateByLexemeId))
  ), [stateByLexemeId]);

  const customWords = useMemo(
    () => words.map((word) => mergeLexemeState(word, stateByLexemeId)),
    [stateByLexemeId, words]
  );

  const updateVocabulary = (word, changes) => {
    const current = wordStatuses.find((entry) => entry.lexemeId === word.id) ||
      createLexemeState(word.id);
    const next = { ...current, ...changes };
    persistStatuses([
      ...wordStatuses.filter((entry) => entry.lexemeId !== word.id),
      next,
    ]);
  };

  const toggleFavorite = (word) =>
    updateVocabulary(word, { favorite: !word.favorite });

  const toggleKnown = (word) =>
    updateVocabulary(word, {
      status: word.status === "known" ? "learning" : "known",
    });

  const toggleLearning = (word) =>
    updateVocabulary(word, {
      status: word.status === "learning" ? "new" : "learning",
    });

  const recordVocabularyAnswer = (word, correct, now) => {
    const current = wordStatuses.find((entry) => entry.lexemeId === word.id) ||
      createLexemeState(word.id);
    const next = updateAnswerState(current, correct, now);
    persistStatuses([
      ...wordStatuses.filter((entry) => entry.lexemeId !== word.id),
      next,
    ]);
  };

  const value = {
    words,
    wordStatuses,
    curriculumWords,
    customWords,
    allWords: [...customWords, ...curriculumWords],
    addWord,
    updateWord,
    deleteWord,
    toggleFavorite,
    toggleLearning,
    toggleKnown,
    recordVocabularyAnswer,
  };

  return <MyWordsContext.Provider value={value}>{children}</MyWordsContext.Provider>;
};

export const useMyWords = () => useContext(MyWordsContext);
