// Minimal IndexedDB wrapper for My Words persistence, with a safe fallback contract.
const DB_NAME = "serbian-a1-store";
const DB_VERSION = 1;
const STORE_NAME = "myWords";

const getIndexedDb = () => {
  try {
    return typeof window !== "undefined" ? window.indexedDB : undefined;
  } catch (error) {
    return undefined;
  }
};

export const isIndexedDbSupported = (idbFactory = getIndexedDb()) => Boolean(idbFactory);

const openDb = (idbFactory = getIndexedDb()) =>
  new Promise((resolve, reject) => {
    if (!idbFactory) {
      reject(new Error("IndexedDB unavailable"));
      return;
    }
    const request = idbFactory.open(DB_NAME, DB_VERSION);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: "id" });
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });

export const idbGetAllWords = async (idbFactory = getIndexedDb()) => {
  const db = await openDb(idbFactory);
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, "readonly");
    const store = tx.objectStore(STORE_NAME);
    const request = store.getAll();
    request.onsuccess = () => resolve(request.result || []);
    request.onerror = () => reject(request.error);
  });
};

// Replaces the whole store contents to mirror the in-memory words array.
export const idbReplaceAllWords = async (words, idbFactory = getIndexedDb()) => {
  const db = await openDb(idbFactory);
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, "readwrite");
    const store = tx.objectStore(STORE_NAME);
    store.clear();
    words.forEach((word) => store.put(word));
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
};
