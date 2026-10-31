const fs = require("fs");
const http = require("http");
const path = require("path");

const root = path.resolve(__dirname, "..", "build");
const port = Number(process.argv[2] || process.env.PORT || 4173);
const mime = {
  ".css": "text/css; charset=utf-8",
  ".html": "text/html; charset=utf-8",
  ".ico": "image/x-icon",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".mp3": "audio/mpeg",
  ".png": "image/png",
  ".svg": "image/svg+xml",
};

const safeFile = (urlPath) => {
  const relative = decodeURIComponent(urlPath.split("?")[0])
    .replace(/^\/pwagerman\/?/, "") || "index.html";
  const resolved = path.resolve(root, relative);
  return resolved.startsWith(`${root}${path.sep}`) || resolved === root ? resolved : null;
};

http.createServer((request, response) => {
  let file = safeFile(request.url || "/");
  let status = 200;
  if (!file || !fs.existsSync(file) || fs.statSync(file).isDirectory()) {
    file = path.join(root, "404.html");
    status = 404;
  }
  response.writeHead(status, {
    "Cache-Control": "no-store",
    "Content-Type": mime[path.extname(file)] || "application/octet-stream",
  });
  fs.createReadStream(file).pipe(response);
}).listen(port, "127.0.0.1", () => {
  process.stdout.write(`German B1 production build: http://127.0.0.1:${port}/pwagerman/\n`);
});
