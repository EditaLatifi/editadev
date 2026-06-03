// Generate a LinkedIn cover banner (1584x396) matching the edita.dev brand.
// Minimal, right-aligned so the profile photo (bottom-left) stays clear.
// Usage: npm run linkedin   ->   branding/linkedin-cover.png
import { chromium } from "playwright";
import { mkdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUTDIR = join(__dirname, "..", "branding");
mkdirSync(OUTDIR, { recursive: true });
const OUT = join(OUTDIR, "linkedin-cover.png");

const W = 1584, H = 396;

const html = `<!doctype html><html><head><meta charset="utf-8">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Mono:wght@400;500&display=swap" rel="stylesheet">
<style>
  * { margin:0; padding:0; box-sizing:border-box; }
  html,body { width:${W}px; height:${H}px; }
  body { background:#030712; color:#f0f6ff; position:relative; overflow:hidden;
    font-family:'Syne',sans-serif; display:flex; align-items:center; justify-content:flex-end;
    -webkit-font-smoothing:antialiased; text-rendering:geometricPrecision; }
  .bar { position:absolute; top:0; left:0; right:0; height:7px;
    background:linear-gradient(90deg,#00d4ff,#00ff88,transparent); z-index:5; }
  .glow { position:absolute; inset:0;
    background:radial-gradient(ellipse 50% 85% at 72% 42%, #00d4ff16 0%, transparent 60%); }
  .wrap { position:relative; z-index:4; text-align:right; padding-right:120px; max-width:66%; }
  h1 { font-weight:800; font-size:86px; line-height:1; letter-spacing:-.02em; }
  h1 .stroke { -webkit-text-stroke:3px #00d4ff; color:transparent; margin-left:.16em; }
  .role { font-family:'DM Mono',monospace; font-weight:500; font-size:23px; letter-spacing:.1em;
    color:#c8d8e8; margin-top:22px; }
  .domain { font-family:'DM Mono',monospace; font-weight:500; font-size:27px; letter-spacing:.05em;
    color:#00d4ff; margin-top:14px; }
</style></head>
<body>
  <div class="bar"></div><div class="glow"></div>
  <div class="wrap">
    <h1>EDITA <span class="stroke">LATIFI</span></h1>
    <div class="role">Full Stack Engineer &amp; Tech Team Lead</div>
    <div class="domain">www.edita.dev</div>
  </div>
</body></html>`;

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: W, height: H }, deviceScaleFactor: 4 });
await page.setContent(html, { waitUntil: "networkidle" });
await page.waitForTimeout(1200);
await page.screenshot({ path: OUT, type: "png", clip: { x: 0, y: 0, width: W, height: H } });
await browser.close();
console.log("✓ Wrote", OUT, `(${W}x${H} @2x)`);
