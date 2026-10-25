const http = require("http");
const fs = require("fs");
const path = require("path");
const { spawn } = require("child_process");

const ROOT = path.resolve(__dirname, "..");
const PORT = Number(process.env.CONTROL_PANEL_PORT || 8090);
const PASSWORD = process.env.SELKIES_PASSWORD;

function send(res, status, body, type = "application/json; charset=utf-8") {
  res.writeHead(status, {
    "Content-Type": type,
    "Cache-Control": "no-store",
    "X-Content-Type-Options": "nosniff",
    "X-Frame-Options": "DENY",
    "Referrer-Policy": "no-referrer"
  });
  res.end(body);
}

function authorized(req) {
  if (!PASSWORD) return false;
  const header = req.headers.authorization || "";
  const supplied = header.startsWith("Bearer ") ? header.slice(7) : "";
  if (!supplied || supplied.length !== PASSWORD.length) return false;
  try {
    return require("crypto").timingSafeEqual(
      Buffer.from(supplied), Buffer.from(PASSWORD)
    );
  } catch (_) {
    return false;
  }
}

function runCompose(args, callback) {
  const child = spawn("docker", ["compose", ...args], {
    cwd: ROOT,
    env: process.env,
    stdio: ["ignore", "pipe", "pipe"]
  });
  let output = "";
  child.stdout.on("data", d => output += d.toString());
  child.stderr.on("data", d => output += d.toString());
  child.on("error", err => callback(500, `No se pudo ejecutar Docker: ${err.message}`));
  child.on("close", code => callback(code === 0 ? 200 : 500, output || `docker compose terminó con código ${code}`));
}

const server = http.createServer((req, res) => {
  const url = new URL(req.url, `http://${req.headers.host || "localhost"}`);

  if (req.method === "GET" && (url.pathname === "/" || url.pathname === "/index.html")) {
    const html = fs.readFileSync(path.join(__dirname, "index.html"));
    return send(res, 200, html, "text/html; charset=utf-8");
  }

  if (!url.pathname.startsWith("/api/")) {
    return send(res, 404, JSON.stringify({ error: "No encontrado" }));
  }

  // Require same-origin browser requests to reduce cross-site request risk.
  const origin = req.headers.origin;
  if (origin) {
    try {
      if (new URL(origin).host !== req.headers.host) {
        return send(res, 403, JSON.stringify({ error: "Origen no permitido" }));
      }
    } catch (_) {
      return send(res, 403, JSON.stringify({ error: "Origen no permitido" }));
    }
  }

  if (!authorized(req)) {
    return send(res, 401, JSON.stringify({ error: "Contraseña incorrecta o secreto no configurado." }));
  }

  if (req.method === "GET" && url.pathname === "/api/status") {
    return runCompose(["ps", "--format", "json"], (status, output) =>
      send(res, status, JSON.stringify({ ok: status === 200, output }))
    );
  }

  if (req.method === "POST" && url.pathname === "/api/start") {
    return runCompose(["up", "-d", "--pull", "missing"], (status, output) =>
      send(res, status, JSON.stringify({ ok: status === 200, output }))
    );
  }

  if (req.method === "POST" && url.pathname === "/api/stop") {
    return runCompose(["down"], (status, output) =>
      send(res, status, JSON.stringify({ ok: status === 200, output }))
    );
  }

  return send(res, 404, JSON.stringify({ error: "Ruta no encontrada" }));
});

server.listen(PORT, "0.0.0.0", () => {
  console.log(`Selkies control panel listening on port ${PORT}`);
});
