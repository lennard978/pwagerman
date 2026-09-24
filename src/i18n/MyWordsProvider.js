import { createContext, useContext, useEffect, useState } from "react";
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
  withVocabularyDefaults,
} from "../data/myWords";
import { Curriculum } from "../data/data";

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

  const addWord = (sourceValue, targetValue) => {
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
    const word = withVocabularyDefaults({
      id,
      source,
      target,
      createdAt: new Date().toISOString(),
      kind: "custom",
    });
    persist([...words, word]);
    return { word };
  };

  const updateWord = (id, sourceValue, targetValue) => {
    const source = normalizeWord(sourceValue);
    const target = normalizeWord(targetValue);
    if (!source || !target) return { error: "blank" };
    if (source.length > MY_WORDS_MAX_LENGTH || target.length > MY_WORDS_MAX_LENGTH) {
      return { error: "length" };
    }
    if (duplicateWord(words, source, target, id)) return { error: "duplicate" };
    persist(words.map((word) => (word.id === id ? { ...word, source, target } : word)));
    return { word: { id, source, target } };
  };

  const deleteWord = (id) => persist(words.filter((word) => word.id !== id));

  const curriculumWords = Curriculum.flatMap((lesson) =>
    lesson.items.map((word) => {
      const saved = wordStatuses.find((entry) => entry.id === word.id);
      return saved ? { ...word, ...saved } : word;
    })
  );

  const updateVocabulary = (word, changes) => {
    if (word.kind === "custom" || words.some((item) => item.id === word.id)) {
      persist(words.map((item) =>
        item.id === word.id ? withVocabularyDefaults({ ...item, ...changes }) : item
      ));
      return;
    }
    const current = wordStatuses.find((entry) => entry.id === word.id) || {
      id: word.id,
      status: "learning",
      favorite: false,
    };
    const next = { ...current, ...changes };
    persistStatuses([
      ...wordStatuses.filter((entry) => entry.id !== word.id),
      next,
    ]);
  };

  const toggleFavorite = (word) =>
    updateVocabulary(word, { favorite: !word.favorite });

  const toggleKnown = (word) =>
    updateVocabulary(word, {
      status: word.status === "known" ? "learning" : "known",
    });

  const value = {
    words,
    curriculumWords,
    allWords: [...words, ...curriculumWords],
    addWord,
    updateWord,
    deleteWord,
    toggleFavorite,
    toggleKnown,
  };

  return <MyWordsContext.Provider value={value}>{children}</MyWordsContext.Provider>;
};

export const useMyWords = () => useContext(MyWordsContext);
