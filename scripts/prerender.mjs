// Pre-render the built SPA into static HTML so crawlers & link-unfurlers see
// real content (not an empty <div id="root">). Run AFTER `vite build`.
// Usage: npm run prerender   (or: npm run build:seo)
import http from "node:http";
import { readFileSync, existsSync, writeFileSync, statSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join, extname } from "node:path";
import { chromium } from "playwright";

const __dirname = dirname(fileURLToPath(import.meta.url));
const DIST = join(__dirname, "..", "dist");

if (!existsSync(join(DIST, "index.html"))) {
  console.error("✗ dist/index.html not found — run `npm run build` first.");
  process.exit(1);
}

const TYPES = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".mjs": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".ico": "image/x-icon",
  ".xml": "application/xml",
  ".txt": "text/plain; charset=utf-8",
  ".woff2": "font/woff2",
};

const server = http.createServer((req, res) => {
  try {
    let p = decodeURIComponent((req.url || "/").split("?")[0]);
    if (p === "/" || p.endsWith("/")) p += "index.html";
    let file = join(DIST, p);
    if (!existsSync(file) || !statSync(file).isFile()) file = join(DIST, "index.html"); // SPA fallback
    const body = readFileSync(file);
    res.writeHead(200, { "Content-Type": TYPES[extname(file)] || "application/octet-stream" });
    res.end(body);
  } catch (e) {
    res.writeHead(500);
    res.end("err");
  }
});

await new Promise((r) => server.listen(0, r));
const port = server.address().port;

let browser;
try {
  browser = await chromium.launch();
} catch (e) {
  // No browser available (e.g. Vercel cloud build) — leave the vite-built HTML as-is.
  console.warn("⚠ Pre-render skipped, no browser available:", e.message.split("\n")[0]);
  server.close();
  process.exit(0);
}
try {
  const page = await browser.newPage();
  // Skip the intro overlay so the snapshot is the real content.
  await page.addInitScript(() => { try { localStorage.setItem("el_intro_seen", "1"); } catch {} });
  await page.goto(`http://localhost:${port}/`, { waitUntil: "networkidle", timeout: 30000 });
  await page.waitForSelector("#contact", { timeout: 15000 }); // last section is mounted
  await page.waitForTimeout(1200);

  const html = await page.content();
  writeFileSync(join(DIST, "index.html"), html, "utf8");

  const text = html.replace(/<[^>]+>/g, " ");
  const hasContent = text.includes("Full Stack Engineer") && text.includes("Case Study");
  console.log(`✓ Pre-rendered dist/index.html (${(html.length / 1024).toFixed(0)} KB) — content embedded: ${hasContent ? "yes" : "NO (check!)"}`);
} finally {
  await browser.close();
  server.close();
}
