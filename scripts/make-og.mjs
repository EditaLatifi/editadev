// Generate a branded 1200x630 Open Graph image into public/og.png
// Usage: npm run og
import { chromium } from "playwright";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT = join(__dirname, "..", "public", "og.png");

// Inline the headshot so the template needs no network/file access.
let photo = "";
try {
  const b = readFileSync(join(__dirname, "..", "public", "edita-headshot.jpg"));
  photo = `data:image/jpeg;base64,${b.toString("base64")}`;
} catch {
  photo = "";
}

const html = `<!doctype html><html><head><meta charset="utf-8">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Mono:wght@400;500&display=swap" rel="stylesheet">
<style>
  * { margin:0; padding:0; box-sizing:border-box; }
  html,body { width:1200px; height:630px; }
  body { background:#030712; color:#f0f6ff; position:relative; overflow:hidden; font-family:'Syne',sans-serif; }
  .bar { position:absolute; top:0; left:0; right:0; height:8px; background:linear-gradient(90deg,#00d4ff,#00ff88,transparent); z-index:5; }
  .grid { position:absolute; inset:0; opacity:.5;
    background-image:linear-gradient(#0d1f2d55 1px,transparent 1px),linear-gradient(90deg,#0d1f2d55 1px,transparent 1px);
    background-size:46px 46px; mask-image:linear-gradient(to bottom,#000,transparent 80%); }
  .photo { position:absolute; top:0; right:0; width:430px; height:630px; object-fit:cover; object-position:center 12%; }
  .photo-fade { position:absolute; top:0; right:0; width:560px; height:630px;
    background:linear-gradient(90deg,#030712 0%, #030712 18%, transparent 60%); z-index:2; }
  .content { position:absolute; inset:0; z-index:4; padding:74px 80px; display:flex; flex-direction:column; justify-content:center; max-width:720px; }
  .kicker { font-family:'DM Mono',monospace; font-size:20px; letter-spacing:.2em; text-transform:uppercase; color:#00d4ff; margin-bottom:24px; }
  h1 { font-weight:800; font-size:110px; line-height:.9; letter-spacing:-.03em; }
  h1 .stroke { -webkit-text-stroke:3px #00d4ff; color:transparent; }
  h1 .surname { display:block; font-size:58px; }
  .role { font-family:'DM Mono',monospace; font-size:27px; color:#c8d8e8; letter-spacing:.03em; margin-top:32px; max-width:640px; }
  .stats { display:flex; gap:42px; margin-top:46px; }
  .stat .n { font-weight:800; font-size:44px; color:#00ff88; line-height:1; }
  .stat:nth-child(even) .n { color:#00d4ff; }
  .stat .l { font-family:'DM Mono',monospace; font-size:15px; color:#9fb1c4; letter-spacing:.13em; text-transform:uppercase; margin-top:9px; }
</style></head>
<body>
  <div class="bar"></div>
  <div class="grid"></div>
  ${photo ? `<img class="photo" src="${photo}" /><div class="photo-fade"></div>` : ""}
  <div class="content">
    <div class="kicker">Independent Full Stack Engineer &middot; IT Consulting</div>
    <h1>EDITA<span class="stroke surname">SHEQIRI (LATIFI)</span></h1>
    <div class="role">8+ years &middot; B2B clients across Kosovo &middot; Austria &middot; Switzerland &middot; Malta &middot; Africa</div>
    <div class="stats">
      <div class="stat"><div class="n">8+</div><div class="l">Years</div></div>
      <div class="stat"><div class="n">20+</div><div class="l">Apps Delivered</div></div>
      <div class="stat"><div class="n">9+</div><div class="l">Countries</div></div>
      <div class="stat"><div class="n">80+</div><div class="l">Devs Trained</div></div>
    </div>
  </div>
</body></html>`;

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1200, height: 630 }, deviceScaleFactor: 1 });
await page.setContent(html, { waitUntil: "networkidle" });
await page.waitForTimeout(1200);
await page.screenshot({ path: OUT, type: "png", clip: { x: 0, y: 0, width: 1200, height: 630 } });
await browser.close();
console.log("✓ Wrote", OUT);
