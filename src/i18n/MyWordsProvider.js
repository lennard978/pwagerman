import { createContext, useContext, useEffect, useState } from "react";
import {
  duplicateWord,
  loadMyWords,
  loadMyWordsFromIndexedDb,
  MY_WORDS_MAX_LENGTH,
  normalizeWord,
  saveMyWords,
  saveMyWordsToIndexedDb,
} from "../data/myWords";

const MyWordsContext = createContext(null);

export const MyWordsProvider = ({ children }) => {
  const [words, setWords] = useState(() => loadMyWords());

  // localStorage renders instantly; IndexedDB (when supported) is loaded in
  // the background and takes over as the source of truth once ready, so a
  // Safari/iOS storage weakness in one store doesn't lose saved words.
  useEffect(() => {
    let cancelled = false;
    loadMyWordsFromIndexedDb().then((idbWords) => {
      if (cancelled || idbWords === null) return;
      setWords(idbWords);
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
    const word = { id, source, target, createdAt: new Date().toISOString() };
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

  const value = { words, addWord, updateWord, deleteWord };

  return <MyWordsContext.Provider value={value}>{children}</MyWordsContext.Provider>;
};

export const useMyWords = () => useContext(MyWordsContext);
