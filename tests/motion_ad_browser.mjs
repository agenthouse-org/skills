import { createRequire } from "node:module";
import { readFile } from "node:fs/promises";
import path from "node:path";
import assert from "node:assert/strict";

const require = createRequire(path.resolve("package.json"));
const { chromium } = require("playwright-core");
let browser;
for (const channel of ["chrome", "msedge", undefined]) {
  try { browser = await chromium.launch(channel ? { channel } : {}); break; } catch { /* try another installed browser */ }
}
if (!browser) throw new Error("Chrome, Edge, or Playwright Chromium is required");
try {
  const page = await browser.newPage({ viewport: { width: 800, height: 450 }, deviceScaleFactor: 1 });
  const shell = await readFile("assets/shell.css", "utf8");
  await page.setContent(`<style>${shell}
    body { display:block; background:white; color:black }
    .sample { position:absolute; left:80px; top:100px; width:650px; font: 120px/0.9 Georgia,serif }
    .effect { position:absolute; left:400px; top:300px; width:60px; height:60px; background:purple }
    .motion-burst { position:absolute; left:100px; top:300px }
    .motion-burst i { display:block; width:30px; height:30px; background:orange }
  </style><div class="sample"><span class="ln" style="--e:1"><span>gyp fj ffi Ägj</span></span></div>
    <div class="effect motion-morph" style="--e:0"></div>
    <div class="motion-burst" style="--e:0"><i style="--dx:120px;--dy:-60px"></i></div>`);
  await page.evaluate(() => document.fonts.ready);
  const line = page.locator(".ln");
  const normal = await page.screenshot();
  await line.evaluate(el => { el.style.clipPath = "none"; });
  const unmasked = await page.screenshot();
  assert.deepEqual(normal, unmasked, "settled glyphs should render identically with and without the mask");

  // Tight line boxes plus a clipping ancestor can still cut descenders even
  // when the .ln mask is fully open. Removing that ancestor clip restores ink.
  const sample = page.locator(".sample");
  await sample.evaluate(el => { el.style.lineHeight = "0.65"; el.style.overflow = "hidden"; });
  const clipped = await page.screenshot();
  await sample.evaluate(el => { el.style.overflow = "visible"; });
  const restored = await page.screenshot();
  assert.notDeepEqual(clipped, restored, "tight overflow-hidden text clips rendered glyphs");

  const state = async value => page.evaluate(v => {
    const morph = document.querySelector(".motion-morph");
    const particle = document.querySelector(".motion-burst i");
    morph.style.setProperty("--e", v);
    particle.parentElement.style.setProperty("--e", v);
    return [getComputedStyle(morph).borderRadius, getComputedStyle(morph).transform,
      getComputedStyle(particle).transform, getComputedStyle(particle).opacity];
  }, value);
  const start = await state("0");
  const middle = await state("0.5");
  const end = await state("1");
  assert.notDeepEqual(start, middle, "effects should move");
  assert.notDeepEqual(middle, end, "effects should continue moving");
  assert.deepEqual(await state("0.5"), middle, "seeking back should reproduce the same pose");
  if (process.argv[2]) await page.screenshot({ path: process.argv[2] });
  console.log("settled glyph pixels and deterministic morph/burst poses passed");
} finally { await browser.close(); }
