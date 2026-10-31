const MAX_TEXT_LENGTH = 300;
const RATE_LIMIT_WINDOW_MS = 60 * 1000;
const RATE_LIMIT_MAX_REQUESTS = 30;
const RATE_LIMIT_MAX_CLIENTS = 1000;
const COURSE_CONFIG = require("../src/config/course.json");
const SUPPORTED_LANGUAGE = COURSE_CONFIG.targetLanguage;
const DEFAULT_VOICE_NAME = COURSE_CONFIG.tts.defaultVoice;
const requestBuckets = new Map();

const allowedOrigins = () =>
  (process.env.TTS_ALLOWED_ORIGINS ||
    "http://localhost:3000,https://lennard978.github.io")
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean);

const setCors = (request, response) => {
  const origin = request.headers.origin;
  if (origin && allowedOrigins().includes(origin)) {
    response.setHeader("Access-Control-Allow-Origin", origin);
    response.setHeader("Vary", "Origin");
  }
  response.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  response.setHeader("Access-Control-Allow-Headers", "Content-Type");
};

const readBody = (request) => {
  if (request.body && typeof request.body === "object") return request.body;
  try {
    return JSON.parse(request.body || "{}");
  } catch (error) {
    return null;
  }
};

const clientAddress = (request) => {
  const forwarded = request.headers["x-forwarded-for"];
  const forwardedValue = Array.isArray(forwarded) ? forwarded[0] : forwarded;
  return String(forwardedValue || request.headers["x-real-ip"] || request.socket?.remoteAddress || "unknown")
    .split(",")[0]
    .trim();
};

const pruneRequestBuckets = (now) => {
  for (const [key, bucket] of requestBuckets) {
    if (now - bucket.startedAt >= RATE_LIMIT_WINDOW_MS) requestBuckets.delete(key);
  }
  while (requestBuckets.size > RATE_LIMIT_MAX_CLIENTS) {
    requestBuckets.delete(requestBuckets.keys().next().value);
  }
};

const consumeRateLimit = (request, response, now = Date.now()) => {
  pruneRequestBuckets(now);
  const key = clientAddress(request);
  const previous = requestBuckets.get(key);
  const bucket = !previous || now - previous.startedAt >= RATE_LIMIT_WINDOW_MS
    ? { startedAt: now, count: 0 }
    : previous;
  bucket.count += 1;
  requestBuckets.set(key, bucket);
  response.setHeader("X-RateLimit-Limit", String(RATE_LIMIT_MAX_REQUESTS));
  response.setHeader("X-RateLimit-Remaining", String(Math.max(0, RATE_LIMIT_MAX_REQUESTS - bucket.count)));
  if (bucket.count <= RATE_LIMIT_MAX_REQUESTS) return true;
  response.setHeader("Retry-After", String(Math.ceil((RATE_LIMIT_WINDOW_MS - (now - bucket.startedAt)) / 1000)));
  return false;
};

const resetRateLimits = () => requestBuckets.clear();

const getClient = () => {
  // This dependency is installed in the separate Vercel API project only.
  // It is never imported into the GitHub Pages React bundle.
  // eslint-disable-next-line global-require, import/no-extraneous-dependencies
  const textToSpeech = require("@google-cloud/text-to-speech");
  const privateKey = (process.env.GOOGLE_CLOUD_PRIVATE_KEY || "").replace(/\\n/g, "\n");
  return new textToSpeech.TextToSpeechClient({
    projectId: process.env.GOOGLE_CLOUD_PROJECT_ID,
    credentials: {
      client_email: process.env.GOOGLE_CLOUD_CLIENT_EMAIL,
      private_key: privateKey,
    },
  });
};

module.exports = async (request, response) => {
  setCors(request, response);
  if (request.method === "OPTIONS") return response.status(204).end();
  if (request.method !== "POST") return response.status(405).json({ error: "Method not allowed" });
  if (!consumeRateLimit(request, response)) return response.status(429).json({ error: "Too many requests" });

  const body = readBody(request);
  const text = typeof body?.text === "string" ? body.text.trim() : "";
  const lang = body?.lang;
  if (!text) return response.status(400).json({ error: "Text is required" });
  if (text.length > MAX_TEXT_LENGTH) return response.status(413).json({ error: "Text is too long" });
  if (lang !== SUPPORTED_LANGUAGE) return response.status(400).json({ error: "Unsupported language" });

  if (!process.env.GOOGLE_CLOUD_PROJECT_ID || !process.env.GOOGLE_CLOUD_CLIENT_EMAIL || !process.env.GOOGLE_CLOUD_PRIVATE_KEY) {
    return response.status(503).json({ error: "Speech service is not configured" });
  }

  try {
    const client = getClient();
    const [result] = await client.synthesizeSpeech({
      input: { text },
      voice: {
        languageCode: SUPPORTED_LANGUAGE,
        name: process.env.GOOGLE_TTS_VOICE_NAME || DEFAULT_VOICE_NAME,
      },
      audioConfig: { audioEncoding: "MP3" },
    });
    response.setHeader("Content-Type", "audio/mpeg");
    response.setHeader("Cache-Control", "public, max-age=86400");
    return response.status(200).send(result.audioContent);
  } catch (error) {
    return response.status(502).json({ error: "Speech provider unavailable" });
  }
};

module.exports.MAX_TEXT_LENGTH = MAX_TEXT_LENGTH;
module.exports.SUPPORTED_LANGUAGE = SUPPORTED_LANGUAGE;
module.exports.DEFAULT_VOICE_NAME = DEFAULT_VOICE_NAME;
module.exports.RATE_LIMIT_MAX_REQUESTS = RATE_LIMIT_MAX_REQUESTS;
module.exports._private = { allowedOrigins, readBody, clientAddress, consumeRateLimit, resetRateLimits };
