// Auto-capture screenshots of Edita's live sites into public/shots/<slug>.jpg
// Usage: npm run shots
import { chromium } from "playwright";
import { mkdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT = join(__dirname, "..", "public", "shots");
mkdirSync(OUT, { recursive: true });

// slug must match the `img` paths we set in PROJECTS
const TARGETS = [
  { slug: "ballenberg", url: "https://www.ballenberg.ch" },
  { slug: "erblin3", url: "https://erblin3.com" },
  { slug: "mrburger", url: "https://mrburgermenu.vercel.app" },
  { slug: "loyalito", url: "https://layoutynextjs.vercel.app" },
  { slug: "gazeta-demos", url: "https://gazetademos.com" },
  { slug: "ip3-crm", url: "https://crm-frontend-xi-three.vercel.app/login" },
  { slug: "bc", url: "https://www.by-bc.com" },
  { slug: "muha", url: "https://www.muha-investments.com" },
  { slug: "idon", url: "https://idon.si" },
  { slug: "dizajn-group", url: "https://dizajn-group.com" },
  { slug: "pizzaiolo", url: "https://pizzaiolo-sigma.vercel.app" },
  { slug: "orama", url: "https://oramatransport.com" },
];

// Best-effort: click common cookie/consent buttons so they don't cover the hero.
const CONSENT_SELECTORS = [
  // Cookiebot (Ballenberg)
  "#CybotCookiebotDialogBodyLevelButtonLevelOptinAllowAll",
  "#CybotCookiebotDialogBodyButtonAccept",
  // OneTrust
  "#onetrust-accept-btn-handler",
  "button#cookie-accept",
  "button[aria-label*='accept' i]",
  "button:has-text('Alle zulassen')",
  "button:has-text('Alle akzeptieren')",
  "button:has-text('Akzeptieren')",
  "button:has-text('Accept all')",
  "button:has-text('Accept All')",
  "button:has-text('Accept')",
  "button:has-text('Souhlasím')",
  "button:has-text('Přijmout vše')",
  "button:has-text('Přijmout')",
  "button:has-text('Pranoj')",
  "button:has-text('Got it')",
  "button:has-text('I agree')",
  "a:has-text('Alle zulassen')",
  ".cookie button",
  "[class*='cookie'] button",
  "[id*='cookie'] button",
];

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function dismissConsent(page) {
  for (const sel of CONSENT_SELECTORS) {
    try {
      const el = await page.$(sel);
      if (el && (await el.isVisible())) {
        await el.click({ timeout: 1500 }).catch(() => {});
        await sleep(400);
        return;
      }
    } catch {
      /* ignore */
    }
  }
}

// Optional: pass slugs as CLI args to re-capture only those (e.g. `node scripts/capture-shots.mjs ballenberg`)
const only = process.argv.slice(2);
const queue = only.length ? TARGETS.filter((t) => only.includes(t.slug)) : TARGETS;

const results = [];

const browser = await chromium.launch();
const ctx = await browser.newContext({
  viewport: { width: 1280, height: 800 },
  deviceScaleFactor: 2,
  userAgent:
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36",
});

for (const t of queue) {
  const page = await ctx.newPage();
  const file = join(OUT, `${t.slug}.jpg`);
  try {
    process.stdout.write(`→ ${t.slug.padEnd(14)} ${t.url} ... `);
    await page.goto(t.url, { waitUntil: "networkidle", timeout: 45000 });
    await dismissConsent(page);
    // settle: fonts, lazy images, hero animations
    await sleep(2500);
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.screenshot({ path: file, type: "jpeg", quality: 82, clip: { x: 0, y: 0, width: 1280, height: 800 } });
    console.log("OK");
    results.push({ slug: t.slug, ok: true });
  } catch (err) {
    console.log("FAILED:", err.message.split("\n")[0]);
    results.push({ slug: t.slug, ok: false, error: err.message.split("\n")[0] });
  } finally {
    await page.close();
  }
}

await browser.close();

const ok = results.filter((r) => r.ok);
const failed = results.filter((r) => !r.ok);
console.log(`\n✓ Captured ${ok.length}/${queue.length}`);
if (failed.length) {
  console.log("✗ Failed (will keep placeholder):");
  failed.forEach((f) => console.log(`   - ${f.slug}: ${f.error}`));
}
