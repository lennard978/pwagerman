import fs from "fs";
import path from "path";

const publicPath = (...parts) => path.join(process.cwd(), "public", ...parts);

test("release manifest and deep-link recovery match the German B1 GitHub Pages app", () => {
  const manifest = JSON.parse(fs.readFileSync(publicPath("manifest.json"), "utf8"));
  expect(manifest).toEqual(expect.objectContaining({
    name: "German B1 Exam Preparation",
    short_name: "German B1",
    display: "standalone",
    start_url: ".",
    scope: ".",
  }));
  expect(manifest.icons).toEqual(expect.arrayContaining([
    expect.objectContaining({ src: "logo192.png", sizes: "192x192" }),
    expect.objectContaining({ src: "logo512.png", sizes: "512x512", purpose: "any maskable" }),
    expect.objectContaining({ src: "apple-touch-icon.png", sizes: "180x180" }),
  ]));
  manifest.icons.forEach((icon) => expect(fs.existsSync(publicPath(icon.src))).toBe(true));

  const fallback = fs.readFileSync(publicPath("404.html"), "utf8");
  const shell = fs.readFileSync(publicPath("index.html"), "utf8");
  expect(fallback).toContain('var base = "/pwagerman"');
  expect(fallback).toContain("encodeURIComponent");
  expect(shell).toContain('get("route")');
  expect(shell).toContain('window.history.replaceState(null, "", "/pwagerman" + route)');
});

test("production branding includes German assets and excludes retired Serbian wordmarks", () => {
  expect(fs.existsSync(publicPath("german-b1-wordmark.svg"))).toBe(true);
  expect(fs.existsSync(publicPath("german-b1-wordmark-compact.svg"))).toBe(true);
  expect(fs.existsSync(publicPath("german-b1-brand-source.png"))).toBe(false);
  expect(fs.existsSync(path.join(process.cwd(), "docs", "german-b1-brand-source.png"))).toBe(true);
  expect(fs.existsSync(publicPath("serbian-a1-wordmark.png"))).toBe(false);
  expect(fs.existsSync(publicPath("serbian-a1-wordmark-compact.png"))).toBe(false);
});

test("legacy Serbian entry points redirect into safe German hubs", () => {
  const app = fs.readFileSync(path.join(process.cwd(), "src", "components", "App.js"), "utf8");
  expect(app).toContain('path="grammar/*" element={<Navigate to="/learn/grammar" replace />}');
  expect(app).toContain('path="exam-prep/*" element={<Navigate to="/exam" replace />}');
  expect(app).toContain('path="my-words" element={<Navigate to="/learn/my-words" replace />}');
  expect(app).toContain('path="review" element={<Navigate to="/practice/review" replace />}');
});
