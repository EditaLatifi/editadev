// Inject server-rendered HTML into dist/index.html. No browser required, so it
// runs in the Vercel cloud build. Run AFTER `vite build` + the SSR build.
//   vite build && vite build --ssr src/entry-server.jsx --outDir dist-ssr && node scripts/prerender-ssr.mjs
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { fileURLToPath, pathToFileURL } from "node:url";
import { dirname, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");
const indexPath = join(root, "dist", "index.html");
const entryPath = join(root, "dist-ssr", "entry-server.js");

try {
  if (!existsSync(indexPath) || !existsSync(entryPath)) {
    console.warn("⚠ Prerender skipped: build outputs missing.");
    process.exit(0);
  }
  const { render } = await import(pathToFileURL(entryPath).href);
  const body = render();
  const tpl = readFileSync(indexPath, "utf-8");
  if (!tpl.includes('<div id="root"></div>')) {
    console.warn("⚠ Prerender skipped: <div id=\"root\"> not found.");
    process.exit(0);
  }
  writeFileSync(indexPath, tpl.replace('<div id="root"></div>', `<div id="root">${body}</div>`), "utf-8");
  const ok = body.includes("Full Stack Engineer") && body.includes("Case Study");
  console.log(`✓ Prerendered content injected (${(body.length / 1024).toFixed(0)} KB) — content embedded: ${ok ? "yes" : "NO (check!)"}`);
} catch (e) {
  // Best-effort: never fail the build, just leave the SPA shell.
  console.warn("⚠ Prerender skipped:", e.message);
  process.exit(0);
}
