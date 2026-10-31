const fs = require("fs");
const path = require("path");

const fixturePath = path.join(
  __dirname,
  "..",
  "build",
  "audio",
  "listening",
  "audio-v1",
  "development-fixture.wav",
);

fs.rmSync(fixturePath, { force: true });

if (fs.existsSync(fixturePath)) {
  throw new Error("Development Listening fixture remained in the production build.");
}

console.log("Production build fixture isolation: PASS");
