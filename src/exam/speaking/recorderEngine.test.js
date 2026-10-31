import { createRecorderController, detectRecordingMime } from "./recorderEngine";

class MockMediaRecorder {
  static isTypeSupported(type) { return type.startsWith("audio/webm"); }
  constructor(stream, options = {}) { this.stream = stream; this.mimeType = options.mimeType; this.state = "inactive"; }
  start() { this.state = "recording"; this.onstart(); }
  pause() { this.state = "paused"; }
  resume() { this.state = "recording"; }
  stop() {
    this.ondataavailable({ data: new Blob(["local audio"], { type: this.mimeType }) });
    this.state = "inactive";
    this.onstop();
  }
}

describe("local MediaRecorder controller", () => {
  test("detects a supported runtime MIME type", () => {
    expect(detectRecordingMime(MockMediaRecorder)).toBe("audio/webm;codecs=opus");
    expect(detectRecordingMime({ isTypeSupported: () => false })).toBe("");
  });

  test("requests permission only when start is called and stops all tracks", async () => {
    const stopTrack = jest.fn();
    const getUserMedia = jest.fn().mockResolvedValue({ getTracks: () => [{ stop: stopTrack }] });
    const states = [];
    const controller = createRecorderController({
      mediaDevices: { getUserMedia },
      MediaRecorderCtor: MockMediaRecorder,
      onState: (state) => states.push(state),
    });
    expect(getUserMedia).not.toHaveBeenCalled();
    await controller.start();
    expect(getUserMedia).toHaveBeenCalledWith({ audio: true });
    controller.pause();
    controller.resume();
    const result = await controller.stop();
    expect(result.blob).toBeInstanceOf(Blob);
    expect(states).toEqual(expect.arrayContaining(["requesting-permission", "ready", "recording", "paused", "stopped"]));
    expect(stopTrack).toHaveBeenCalled();
  });

  test("permission denial and unsupported browsers fail without blocking practice", async () => {
    const denied = createRecorderController({
      mediaDevices: { getUserMedia: jest.fn().mockRejectedValue(new Error("denied")) },
      MediaRecorderCtor: MockMediaRecorder,
    });
    await expect(denied.start()).rejects.toThrow("denied");
    const unsupported = createRecorderController({ mediaDevices: null, MediaRecorderCtor: null });
    await expect(unsupported.start()).rejects.toThrow("recording-unsupported");
  });

  test("pauses safely at the five-minute-equivalent limit until the learner saves", async () => {
    jest.useFakeTimers();
    const states = [];
    const onLimit = jest.fn();
    const controller = createRecorderController({
      mediaDevices: { getUserMedia: jest.fn().mockResolvedValue({ getTracks: () => [] }) },
      MediaRecorderCtor: MockMediaRecorder,
      maxDurationMs: 1000,
      onState: (state) => states.push(state),
      onLimit,
    });
    await controller.start();
    jest.advanceTimersByTime(1250);
    expect(states.at(-1)).toBe("paused");
    expect(onLimit).toHaveBeenCalledTimes(1);
    await controller.stop();
    jest.useRealTimers();
  });

  test("contains no upload or network operation", () => {
    const source = createRecorderController.toString();
    expect(source).not.toMatch(/fetch\(|XMLHttpRequest|axios|upload/i);
  });
});
