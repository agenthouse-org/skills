import { createRequire } from "node:module";
import { pathToFileURL } from "node:url";
import path from "node:path";
import assert from "node:assert/strict";
const { chromium } = createRequire(path.resolve("package.json"))("playwright-core");
let browser;
for (const channel of ["chrome", "msedge", undefined]) {
  try { browser = await chromium.launch({ ...(channel ? { channel } : {}), args: ["--use-angle=swiftshader", "--enable-unsafe-swiftshader"] }); break; } catch { /* try another browser */ }
}
if (!browser) throw new Error("Chrome, Edge, or Playwright Chromium is required");
try {
  const url = pathToFileURL(path.resolve(process.argv[2])).href + "?present=1";
  const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } });
  await page.route(/^https?:/, route => route.abort());
  page.setDefaultTimeout(15000);
  const errors = [];
  page.on("pageerror", error => errors.push(error.message));
  await page.goto(url, { waitUntil: "load" });
  await page.evaluate(async () => { await window.ad.fitted; window.ad.pause(); });
  assert.equal(await page.locator("canvas[data-motion-three]").getAttribute("data-three-status"), "ready");
  const frame = async time => {
    await page.evaluate(t => window.ad.seek(t), time);
    return page.locator("canvas[data-motion-three]").screenshot();
  };
  const first = await frame(1);
  const later = await frame(4);
  assert.notDeepEqual(first, later, "3D frame changes with time");
  assert.deepEqual(first, await frame(1), "revisiting a time renders the same 3D frame");
  assert.deepEqual(errors, [], "no browser script errors");
  const reduced = await browser.newPage({ reducedMotion: "reduce" });
  await reduced.route(/^https?:/, route => route.abort());
  reduced.setDefaultTimeout(15000);
  await reduced.goto(url, { waitUntil: "domcontentloaded" });
  assert.ok(await reduced.evaluate(() => window.ad.getTime() > 14.9));
  await reduced.close();
  const fallback = await browser.newPage();
  await fallback.route(/^https?:/, route => route.abort());
  fallback.setDefaultTimeout(15000);
  await fallback.addInitScript(() => {
    const original = HTMLCanvasElement.prototype.getContext;
    HTMLCanvasElement.prototype.getContext = function(type, ...args) {
      return type.startsWith("webgl") ? null : original.call(this, type, ...args);
    };
  });
  await fallback.goto(url, { waitUntil: "domcontentloaded" });
  assert.equal(await fallback.locator("canvas[data-motion-three]").getAttribute("data-three-status"), "unavailable");
  assert.equal(await fallback.locator("canvas[data-motion-three]").isVisible(), false);
  assert.equal(await fallback.evaluate(() => typeof window.ad.seek), "function");
  await fallback.close();
  console.log("3D seek, reduced motion, and WebGL fallback passed");
} finally { await browser.close(); }
