import { fetchCloudAudio } from "./cloudTtsProvider";
import {
  clearTtsCache,
  normalizeSpeechLanguage,
  speak,
} from "./ttsProvider";

const originalAudio = global.Audio;
const originalCreateObjectURL = global.URL.createObjectURL;
const originalRevokeObjectURL = global.URL.revokeObjectURL;
let audioInstances;

const installAudioMock = (configurePlay) => {
  audioInstances = [];
  global.Audio = jest.fn(() => {
    const listeners = {};
    const audio = {
      addEventListener: jest.fn((event, listener) => {
        listeners[event] = listener;
      }),
      load: jest.fn(),
      pause: jest.fn(),
      play: jest.fn(() => Promise.resolve()),
      listeners,
    };
    if (configurePlay) configurePlay(audio, audioInstances.length);
    audioInstances.push(audio);
    return audio;
  });
  global.URL.createObjectURL = jest.fn((blob) => `blob:audio-${blob.id}`);
  global.URL.revokeObjectURL = jest.fn();
};

const audioResponse = (blob) => ({
  ok: true,
  headers: { get: () => "audio/mpeg" },
  blob: () => Promise.resolve(blob),
});

beforeEach(() => {
  process.env.REACT_APP_TTS_ENDPOINT = "https://tts.example/api/tts";
  installAudioMock();
});

test("cloud request sends the normalized Serbian API locale", async () => {
  process.env.REACT_APP_TTS_ENDPOINT = "https://tts.example/api/tts";
  global.fetch = jest.fn(() => Promise.resolve({
    ok: false,
    headers: { get: () => "application/json" },
  }));

  await fetchCloudAudio({ text: "dobro jutro", lang: "sr-RS" });

  expect(global.fetch).toHaveBeenCalledWith(
    "https://tts.example/api/tts",
    expect.objectContaining({
      method: "POST",
      body: JSON.stringify({ text: "dobro jutro", lang: "sr-RS" }),
    })
  );
});

test("cloud provider failure returns no audio for browser fallback", async () => {
  global.fetch = jest.fn(() => Promise.reject(new Error("offline")));

  await expect(fetchCloudAudio({ text: "kuća", lang: "sr-RS" })).resolves.toBe(false);
});

test("provider normalizes sr before sending the cloud request", () => {
  global.fetch = jest.fn(() => Promise.resolve({
    ok: false,
    headers: { get: () => "application/json" },
  }));
  const browserSpeak = jest.fn();

  speak({ text: "kuća", lang: "sr", voices: [], browserSpeak });

  expect(global.fetch).toHaveBeenCalledWith(
    "https://tts.example/api/tts",
    expect.objectContaining({
      body: JSON.stringify({ text: "kuća", lang: "sr-RS" }),
    })
  );
});

test("prepares media during the user path before cloud completion", async () => {
  let resolveFetch;
  global.fetch = jest.fn(() => new Promise((resolve) => {
    resolveFetch = resolve;
  }));

  const result = speak({ text: "kuća", lang: "sr-RS", voices: [], browserSpeak: jest.fn() });

  expect(global.Audio).toHaveBeenCalledTimes(1);
  expect(audioInstances[0].play).toHaveBeenCalledTimes(1);
  expect(audioInstances[0].muted).toBe(true);
  expect(audioInstances[0].src).toMatch(/^data:audio\/wav/);
  expect(audioInstances[0].load).not.toHaveBeenCalled();

  resolveFetch(audioResponse({ id: "house" }));
  await result;
});

test("plays returned cloud audio through the prepared media element", async () => {
  const blob = { id: "house" };
  global.fetch = jest.fn(() => Promise.resolve(audioResponse(blob)));

  await speak({ text: "kuća", lang: "sr-RS", voices: [], browserSpeak: jest.fn() });

  expect(global.Audio).toHaveBeenCalledTimes(1);
  expect(global.URL.createObjectURL).toHaveBeenCalledWith(blob);
  expect(audioInstances[0].src).toBe("blob:audio-house");
  expect(audioInstances[0].muted).toBe(false);
  expect(audioInstances[0].load).toHaveBeenCalledTimes(1);
  expect(audioInstances[0].play).toHaveBeenCalledTimes(2);
});

test("cloud failure falls back safely", async () => {
  const browserSpeak = jest.fn();
  global.fetch = jest.fn(() => Promise.reject(new Error("offline")));

  await expect(speak({
    text: "kuća",
    lang: "sr-RS",
    voices: [],
    browserSpeak,
  })).resolves.toBe(false);

  expect(browserSpeak).toHaveBeenCalledTimes(1);
});

test("rejected prepared playback falls back without rejecting", async () => {
  installAudioMock((audio) => {
    audio.play
      .mockResolvedValueOnce(undefined)
      .mockRejectedValueOnce(new Error("NotAllowedError"));
  });
  const browserSpeak = jest.fn();
  global.fetch = jest.fn(() => Promise.resolve(audioResponse({ id: "house" })));

  await expect(speak({
    text: "kuća",
    lang: "sr-RS",
    voices: [],
    browserSpeak,
  })).resolves.toBe(false);

  expect(browserSpeak).toHaveBeenCalledTimes(1);
  expect(global.URL.revokeObjectURL).toHaveBeenCalledWith("blob:audio-house");
});

test("cached cloud data replays with a fresh prepared element and URL", async () => {
  const blob = { id: "cached" };
  global.fetch = jest.fn(() => Promise.resolve(audioResponse(blob)));
  const speech = { text: "kuća", lang: "sr-RS", voices: [], browserSpeak: jest.fn() };

  await speak(speech);
  await speak(speech);

  expect(global.fetch).toHaveBeenCalledTimes(1);
  expect(global.Audio).toHaveBeenCalledTimes(2);
  expect(audioInstances[1].play).toHaveBeenCalledTimes(2);
  expect(global.URL.createObjectURL).toHaveBeenCalledTimes(2);
  expect(global.URL.revokeObjectURL).toHaveBeenCalledWith("blob:audio-cached");
});

test("rapid taps prevent stale cloud responses from playing", async () => {
  const fetchResolvers = [];
  global.fetch = jest.fn(() => new Promise((resolve) => fetchResolvers.push(resolve)));

  const first = speak({ text: "kuća", lang: "sr-RS", voices: [], browserSpeak: jest.fn() });
  const second = speak({ text: "voda", lang: "sr-RS", voices: [], browserSpeak: jest.fn() });
  fetchResolvers[0](audioResponse({ id: "house" }));
  fetchResolvers[1](audioResponse({ id: "water" }));
  await Promise.all([first, second]);

  expect(audioInstances[0].play).toHaveBeenCalledTimes(1);
  expect(audioInstances[0].pause).toHaveBeenCalled();
  expect(audioInstances[1].play).toHaveBeenCalledTimes(2);
});

test.each([
  ["sr", "sr-RS"],
  ["sr-Latn", "sr-RS"],
  ["sr-RS", "sr-RS"],
])("normalizes %s to %s", (input, expected) => {
  expect(normalizeSpeechLanguage(input)).toBe(expected);
});

afterEach(() => {
  clearTtsCache();
  delete process.env.REACT_APP_TTS_ENDPOINT;
  global.Audio = originalAudio;
  global.URL.createObjectURL = originalCreateObjectURL;
  global.URL.revokeObjectURL = originalRevokeObjectURL;
  jest.restoreAllMocks();
});
