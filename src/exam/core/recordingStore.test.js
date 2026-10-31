import {
  deleteRecording,
  getRecording,
  listRecordings,
  MAX_RECORDING_BYTES,
  MAX_TOTAL_RECORDING_BYTES,
  saveRecording,
} from "./recordingStore";

const fakeIndexedDb = () => {
  const records = new Map();
  const request = (operation) => {
    const result = {};
    queueMicrotask(() => {
      try {
        result.result = operation();
        result.onsuccess?.();
      } catch (error) {
        result.error = error;
        result.onerror?.();
      }
    });
    return result;
  };
  const store = {
    getAll: () => request(() => [...records.values()]),
    get: (id) => request(() => records.get(id)),
    put: (value) => request(() => { records.set(value.recordingId, value); return value.recordingId; }),
    delete: (id) => request(() => records.delete(id)),
  };
  return {
    open() {
      const openRequest = {};
      queueMicrotask(() => {
        openRequest.result = {
          objectStoreNames: { contains: () => true },
          transaction: () => ({ objectStore: () => store }),
          close: jest.fn(),
        };
        openRequest.onsuccess?.();
      });
      return openRequest;
    },
  };
};

describe("bounded local speaking recording store", () => {
  test("saves metadata and blob together locally, then retrieves and deletes it", async () => {
    const factory = fakeIndexedDb();
    const blob = new Blob(["audio"], { type: "audio/webm" });
    const metadata = await saveRecording({
      recordingId: "recording-1",
      sessionId: "session-1",
      part: 1,
      createdAt: "2026-10-31T10:00:00Z",
      durationMs: 1200,
      blob,
    }, factory);
    expect(metadata).toEqual(expect.objectContaining({ recordingId: "recording-1", sizeBytes: blob.size, mimeType: "audio/webm" }));
    expect((await getRecording("recording-1", factory)).blob).toBe(blob);
    expect(await listRecordings(factory)).toHaveLength(1);
    await deleteRecording("recording-1", factory);
    expect(await listRecordings(factory)).toEqual([]);
  });

  test("rejects an individual recording above 15 MiB", async () => {
    const factory = fakeIndexedDb();
    await expect(saveRecording({
      recordingId: "too-large",
      blob: { size: MAX_RECORDING_BYTES + 1, type: "audio/webm" },
    }, factory)).rejects.toThrow("recording-size-limit");
  });

  test("rejects accumulation above the documented 50 MiB total", async () => {
    const factory = fakeIndexedDb();
    await saveRecording({ recordingId: "first", blob: { size: MAX_RECORDING_BYTES, type: "audio/webm" } }, factory);
    await saveRecording({ recordingId: "second", blob: { size: MAX_RECORDING_BYTES, type: "audio/webm" } }, factory);
    await saveRecording({ recordingId: "third", blob: { size: MAX_RECORDING_BYTES, type: "audio/webm" } }, factory);
    const remaining = MAX_TOTAL_RECORDING_BYTES - (MAX_RECORDING_BYTES * 3);
    await expect(saveRecording({ recordingId: "fourth", blob: { size: remaining + 1, type: "audio/webm" } }, factory)).rejects.toThrow("recording-storage-limit");
  });
});
