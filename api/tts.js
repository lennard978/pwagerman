const MAX_TEXT_LENGTH = 300;
const SUPPORTED_LANGUAGE = "sr-RS";
const DEFAULT_VOICE_NAME = "sr-RS-Chirp3-HD-Aoede";

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
module.exports._private = { allowedOrigins, readBody };
