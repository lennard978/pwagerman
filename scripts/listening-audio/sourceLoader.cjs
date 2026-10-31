const fs = require("node:fs");
const path = require("node:path");
const babel = require("@babel/core");
const transformModules = require("@babel/plugin-transform-modules-commonjs");

const loadListeningForms = (root) => {
  const sourceRoot = path.join(root, "src");
  const entry = path.join(sourceRoot, "exam", "data", "listeningForms.js");
  const originalLoader = require.extensions[".js"];
  const priorNodeEnv = process.env.NODE_ENV;
  const priorFixtureMode = process.env.REACT_APP_LISTENING_FIXTURE_MODE;

  process.env.NODE_ENV = "production";
  delete process.env.REACT_APP_LISTENING_FIXTURE_MODE;
  require.extensions[".js"] = (module, filename) => {
    if (!filename.startsWith(sourceRoot)) return originalLoader(module, filename);
    const source = fs.readFileSync(filename, "utf8");
    const transformed = babel.transformSync(source, {
      babelrc: false,
      configFile: false,
      filename,
      sourceType: "module",
      plugins: [transformModules],
    });
    module._compile(transformed.code, filename);
  };

  try {
    Object.keys(require.cache).filter((filename) => filename.startsWith(sourceRoot)).forEach((filename) => delete require.cache[filename]);
    return require(entry).listeningForms;
  } finally {
    require.extensions[".js"] = originalLoader;
    if (priorNodeEnv === undefined) delete process.env.NODE_ENV; else process.env.NODE_ENV = priorNodeEnv;
    if (priorFixtureMode === undefined) delete process.env.REACT_APP_LISTENING_FIXTURE_MODE; else process.env.REACT_APP_LISTENING_FIXTURE_MODE = priorFixtureMode;
  }
};

module.exports = { loadListeningForms };
