import { createRequire } from "node:module";
import { pathToFileURL } from "node:url";
import path from "node:path";
import assert from "node:assert/strict";
const { chromium } = createRequire(path.resolve("package.json"))("playwright-core");
let browser;
for (const channel of ["chrome", "msedge", undefined]) {
  try { browser = await chromium.launch(channel ? { channel } : {}); break; } catch { /* try another browser */ }
}
if (!browser) throw new Error("Chrome, Edge, or Playwright Chromium is required");
try {
  const page = await browser.newPage();
  await page.route(/^https?:/, route => route.abort());
  await page.goto(pathToFileURL(path.resolve(process.argv[2])).href, { waitUntil: "domcontentloaded" });
  await page.waitForFunction(() => window.ad?.ready);
  await page.evaluate(() => window.ad.seek(2));
  assert.equal(await page.locator("html").getAttribute("data-custom-scene"), "yes", "the scene-specific renderer runs on seek");
} finally { await browser.close(); }
