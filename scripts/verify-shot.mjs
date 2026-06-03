// Dev-only visual QA: desktop sections + Freelance tab + mobile.
import { chromium } from "playwright";
import { mkdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT = join(__dirname, "..", ".verify");
mkdirSync(OUT, { recursive: true });
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const URL = "http://localhost:5173/";

const browser = await chromium.launch();

// ---- Desktop ----
const page = await browser.newPage({ viewport: { width: 1280, height: 860 }, deviceScaleFactor: 1 });
await page.addInitScript(() => { try { localStorage.setItem("el_intro_seen", "1"); } catch {} });
await page.goto(URL, { waitUntil: "networkidle", timeout: 30000 });
await sleep(1200);
await page.screenshot({ path: join(OUT, "d-hero.jpg"), type: "jpeg", quality: 78 });
for (const id of ["about", "stack", "experience", "projects", "testimonials", "contact"]) {
  await page.evaluate((i) => document.getElementById(i)?.scrollIntoView(), id);
  await sleep(900);
  await page.screenshot({ path: join(OUT, `d-${id}.jpg`), type: "jpeg", quality: 78 });
}
// Freelance tab — verify dedup + grid
await page.evaluate(() => document.getElementById("projects")?.scrollIntoView());
await sleep(600);
const freelanceBtn = page.getByRole("button", { name: "Freelance", exact: true });
await freelanceBtn.click().catch(() => {});
await sleep(900);
await page.evaluate(() => window.scrollBy(0, 700));
await sleep(600);
await page.screenshot({ path: join(OUT, "d-freelance.jpg"), type: "jpeg", quality: 78 });

// ---- Mobile (iPhone-ish) ----
const m = await browser.newPage({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 });
await m.addInitScript(() => { try { localStorage.setItem("el_intro_seen", "1"); } catch {} });
await m.goto(URL, { waitUntil: "networkidle", timeout: 30000 });
await sleep(1200);
await m.screenshot({ path: join(OUT, "m-hero.jpg"), type: "jpeg", quality: 75 });
for (const id of ["about", "projects", "contact"]) {
  await m.evaluate((i) => document.getElementById(i)?.scrollIntoView(), id);
  await sleep(900);
  await m.screenshot({ path: join(OUT, `m-${id}.jpg`), type: "jpeg", quality: 75 });
}

await browser.close();
console.log("✓ QA screenshots written to .verify/");
