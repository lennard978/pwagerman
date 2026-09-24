import handler, {
  DEFAULT_VOICE_NAME,
  MAX_TEXT_LENGTH,
  SUPPORTED_LANGUAGE,
} from "../../../api/tts";
import { TextToSpeechClient } from "@google-cloud/text-to-speech";

const mockSynthesizeSpeech = jest.fn();

jest.mock("@google-cloud/text-to-speech", () => ({
  TextToSpeechClient: jest.fn(),
}));

const call = async (method, body, headers = {}) => {
  const response = {
    statusCode: 200,
    headers: {},
    status(code) { this.statusCode = code; return this; },
    setHeader(name, value) { this.headers[name] = value; },
    json(value) { this.body = value; return this; },
    send(value) { this.body = value; return this; },
    end() { this.ended = true; return this; },
  };
  await handler({ method, body, headers }, response);
  return response;
};

const configuredEnvironment = {
  GOOGLE_CLOUD_PROJECT_ID: "test-project",
  GOOGLE_CLOUD_CLIENT_EMAIL: "tts@example.test",
  GOOGLE_CLOUD_PRIVATE_KEY: "test-key",
};

const originalEnvironment = {
  GOOGLE_CLOUD_PROJECT_ID: process.env.GOOGLE_CLOUD_PROJECT_ID,
  GOOGLE_CLOUD_CLIENT_EMAIL: process.env.GOOGLE_CLOUD_CLIENT_EMAIL,
  GOOGLE_CLOUD_PRIVATE_KEY: process.env.GOOGLE_CLOUD_PRIVATE_KEY,
  GOOGLE_TTS_VOICE_NAME: process.env.GOOGLE_TTS_VOICE_NAME,
};

const restoreEnvironmentValue = (name, value) => {
  if (value === undefined) delete process.env[name];
  else process.env[name] = value;
};

beforeEach(() => {
  TextToSpeechClient.mockImplementation(() => ({
    synthesizeSpeech: mockSynthesizeSpeech,
  }));
});

afterEach(() => {
  Object.entries(originalEnvironment).forEach(([name, value]) => {
    restoreEnvironmentValue(name, value);
  });
  mockSynthesizeSpeech.mockReset();
});

test("rejects non-POST requests", async () => {
  expect((await call("GET", {})).statusCode).toBe(405);
});

test("rejects invalid Serbian TTS payloads", async () => {
  expect((await call("POST", { text: "", lang: SUPPORTED_LANGUAGE })).statusCode).toBe(400);
  expect((await call("POST", { text: "hello", lang: "en-US" })).statusCode).toBe(400);
  expect((await call("POST", { text: "x".repeat(MAX_TEXT_LENGTH + 1), lang: SUPPORTED_LANGUAGE })).statusCode).toBe(413);
});

test("allows configured frontend origin and never exposes credentials", async () => {
  const response = await call("POST", { text: "dobro jutro", lang: SUPPORTED_LANGUAGE }, { origin: "https://lennard978.github.io" });
  expect(response.headers["Access-Control-Allow-Origin"]).toBe("https://lennard978.github.io");
  expect(JSON.stringify(response.body || "")).not.toContain("private_key");
});

test("passes the configured premium Serbian voice name to Google TTS", async () => {
  Object.assign(process.env, configuredEnvironment);
  process.env.GOOGLE_TTS_VOICE_NAME = "sr-RS-Configured-Voice";
  mockSynthesizeSpeech.mockResolvedValue([{ audioContent: Buffer.from("audio") }]);

  const response = await call("POST", {
    text: "dobro jutro",
    lang: SUPPORTED_LANGUAGE,
  });

  expect(response.statusCode).toBe(200);
  expect(mockSynthesizeSpeech).toHaveBeenCalledWith(expect.objectContaining({
    voice: {
      languageCode: "sr-RS",
      name: "sr-RS-Configured-Voice",
    },
  }));
});

test("uses the preferred Serbian voice when no override is configured", async () => {
  Object.assign(process.env, configuredEnvironment);
  delete process.env.GOOGLE_TTS_VOICE_NAME;
  mockSynthesizeSpeech.mockResolvedValue([{ audioContent: Buffer.from("audio") }]);

  const response = await call("POST", {
    text: "dobro jutro",
    lang: SUPPORTED_LANGUAGE,
  });

  expect(response.statusCode).toBe(200);
  expect(mockSynthesizeSpeech).toHaveBeenCalledWith(expect.objectContaining({
    voice: {
      languageCode: SUPPORTED_LANGUAGE,
      name: DEFAULT_VOICE_NAME,
    },
  }));
});
