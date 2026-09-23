import handler, { MAX_TEXT_LENGTH, SUPPORTED_LANGUAGE } from "./tts";

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
