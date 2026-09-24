// Minimal IndexedDB wrapper for My Words persistence, with a safe fallback contract.
const DB_NAME = "serbian-a1-store";
const DB_VERSION = 3;
const STORE_NAME = "myWords";
const STATUS_STORE_NAME = "wordStatuses";
const PROGRESS_STORE_NAME = "learningProgress";

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
      if (!db.objectStoreNames.contains(STATUS_STORE_NAME)) {
        db.createObjectStore(STATUS_STORE_NAME, { keyPath: "id" });
      }
      if (!db.objectStoreNames.contains(PROGRESS_STORE_NAME)) {
        db.createObjectStore(PROGRESS_STORE_NAME, { keyPath: "id" });
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });

export const idbGetAllWordStatuses = async (idbFactory = getIndexedDb()) => {
  const db = await openDb(idbFactory);
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STATUS_STORE_NAME, "readonly");
    const request = tx.objectStore(STATUS_STORE_NAME).getAll();
    request.onsuccess = () => resolve(request.result || []);
    request.onerror = () => reject(request.error);
  });
};

export const idbReplaceAllWordStatuses = async (statuses, idbFactory = getIndexedDb()) => {
  const db = await openDb(idbFactory);
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STATUS_STORE_NAME, "readwrite");
    const store = tx.objectStore(STATUS_STORE_NAME);
    store.clear();
    statuses.forEach((status) => store.put(status));
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
};

export const idbGetProgress = async (idbFactory = getIndexedDb()) => {
  const db = await openDb(idbFactory);
  return new Promise((resolve, reject) => {
    const request = db.transaction(PROGRESS_STORE_NAME, "readonly")
      .objectStore(PROGRESS_STORE_NAME)
      .get("current");
    request.onsuccess = () => resolve(request.result || null);
    request.onerror = () => reject(request.error);
  });
};

export const idbSaveProgress = async (progress, idbFactory = getIndexedDb()) => {
  const db = await openDb(idbFactory);
  return new Promise((resolve, reject) => {
    const tx = db.transaction(PROGRESS_STORE_NAME, "readwrite");
    tx.objectStore(PROGRESS_STORE_NAME).put({ ...progress, id: "current" });
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
};

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
