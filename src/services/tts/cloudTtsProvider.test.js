import { fetchCloudAudio } from "./cloudTtsProvider";
import { speak } from "./ttsProvider";

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
  process.env.REACT_APP_TTS_ENDPOINT = "https://tts.example/api/tts";
  global.fetch = jest.fn(() => Promise.reject(new Error("offline")));

  await expect(fetchCloudAudio({ text: "kuća", lang: "sr-RS" })).resolves.toBe(false);
});

test("provider normalizes sr before sending the cloud request", () => {
  process.env.REACT_APP_TTS_ENDPOINT = "https://tts.example/api/tts";
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

afterEach(() => {
  delete process.env.REACT_APP_TTS_ENDPOINT;
  jest.restoreAllMocks();
});
