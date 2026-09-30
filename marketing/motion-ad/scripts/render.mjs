import fs from "node:fs";
import path from "node:path";
import { spawn } from "node:child_process";
import { once } from "node:events";
import { createRequire } from "node:module";
import { fileURLToPath, pathToFileURL } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const usage = `Usage:
  node scripts/render.mjs <ad.html> --webm <out.webm> [--fps 30] [--crf 32] [--force]
  node scripts/render.mjs <ad.html>... --stills [auto|t1,t2,...] [--dir <folder>]
  node scripts/render.mjs <ad.html>... --fit
Browser: [--channel chrome|msedge|chromium] [--browser <path-to-executable>]
Encoder: [--ffmpeg <path>] (default: ffmpeg on PATH or $FFMPEG)`;

const argv = process.argv.slice(2);
const valueFlags = new Set(["--webm", "--fps", "--crf", "--dir", "--channel", "--browser", "--ffmpeg"]);

function arg(name, fallback) {
  const index = argv.indexOf(name);
  if (index === -1 || !argv[index + 1] || argv[index + 1].startsWith("--")) return fallback;
  return argv[index + 1];
}

function inputs() {
  const files = [];
  for (let i = 0; i < argv.length; i += 1) {
    const token = argv[i];
    if (valueFlags.has(token)) {
      i += 1;
      continue;
    }
    if (token === "--stills") {
      if (argv[i + 1] && !argv[i + 1].startsWith("--") && !argv[i + 1].endsWith(".html")) i += 1;
      continue;
    }
    if (!token.startsWith("--")) files.push(token);
  }
  return files;
}

function loadPlaywright() {
  const require = createRequire(path.join(root, "package.json"));
  try {
    return require("playwright-core");
  } catch {
    try {
      return createRequire(path.join(process.cwd(), "package.json"))("playwright-core");
    } catch {
      console.error(`error: playwright-core is not installed. Run: npm install --prefix "${root}"`);
      process.exit(2);
    }
  }
}

async function launch() {
  const { chromium } = loadPlaywright();
  const executablePath = arg("--browser");
  if (executablePath) return chromium.launch({ executablePath });
  const wanted = arg("--channel");
  const channels = wanted ? [wanted] : ["chrome", "msedge", "chromium"];
  let lastError;
  for (const channel of channels) {
    try {
      return await chromium.launch(channel === "chromium" ? {} : { channel });
    } catch (error) {
      lastError = error;
    }
  }
  console.error("error: no browser found. Install Chrome or Edge, or pass --browser <path>.");
  console.error(String(lastError && lastError.message).split("\n")[0]);
  process.exit(2);
}

function stageSize(file) {
  const html = fs.readFileSync(file, "utf8");
  const width = Number((html.match(/id="stage"[^>]*data-w="(\d+)"/) || [])[1] || 1920);
  const height = Number((html.match(/id="stage"[^>]*data-h="(\d+)"/) || [])[1] || 1080);
  return { width, height };
}

async function open(browser, file) {
  const { width, height } = stageSize(file);
  const page = await browser.newPage({ viewport: { width, height }, deviceScaleFactor: 1 });
  const url = pathToFileURL(path.resolve(file)).href + "?present=1";
  await page.goto(url, { waitUntil: "networkidle" });
  await page.waitForFunction(() => window.ad && window.ad.ready);
  await page.evaluate(async () => {
    window.ad.pause();
    await window.ad.fitted;
  });
  const clip = await page.evaluate(() => {
    const box = document.getElementById("stage").getBoundingClientRect();
    return { x: Math.round(box.left), y: Math.round(box.top), width: Math.round(box.width), height: Math.round(box.height) };
  });
  const info = await page.evaluate(() => ({
    duration: window.ad.duration,
    beats: [...document.querySelectorAll("#stage .beat")].map((beat) => ({
      name: [...beat.classList].find((name) => name !== "beat" && name !== "on") || "beat",
      in: Number(beat.dataset.in),
      out: Number(beat.dataset.out),
      hold: beat.dataset.hold === "1",
    })),
  }));
  return { page, clip, ...info };
}

async function seek(page, time) {
  await page.evaluate(
    (t) =>
      new Promise((resolve) => {
        window.ad.seek(t);
        requestAnimationFrame(() => requestAnimationFrame(resolve));
      }),
    time,
  );
}

function sampleTimes(ad, spec) {
  if (spec && spec !== "auto") {
    return spec.split(",").map((value) => {
      const time = Number(value);
      if (!Number.isFinite(time) || time < 0 || time > ad.duration) throw new Error(`bad still time: ${value}`);
      return { time, name: "t" };
    });
  }
  return ad.beats.map((beat) => ({
    time: beat.hold ? Math.max(0, ad.duration - 0.05) : beat.in + (beat.out - beat.in) * 0.7,
    name: beat.name,
  }));
}

async function stills(browser, file) {
  const ad = await open(browser, file);
  const base = path.basename(file, ".html");
  const dir = path.resolve(arg("--dir", path.join(path.dirname(file), "renders", `${base}-stills`)));
  fs.mkdirSync(dir, { recursive: true });
  const times = sampleTimes(ad, arg("--stills"));
  for (const [index, sample] of times.entries()) {
    await seek(ad.page, sample.time);
    const name = `${String(index + 1).padStart(2, "0")}-${sample.name}-${sample.time.toFixed(2)}s.png`;
    await ad.page.screenshot({ path: path.join(dir, name), clip: ad.clip });
    console.log(path.join(dir, name));
  }
  await ad.page.close();
}

function inspectFrame() {
  const stage = document.getElementById("stage");
  const found = [];
  const transparent = (value) => value === "transparent" || value === "rgba(0, 0, 0, 0)";

  function shown(el) {
    let opacity = 1;
    for (let node = el; node && node !== document.body; node = node.parentElement) {
      const style = getComputedStyle(node);
      if (style.display === "none" || style.visibility === "hidden") return 0;
      opacity *= Number(style.opacity);
    }
    return opacity;
  }

  function boxed(el) {
    for (let node = el.parentElement; node && node !== stage; node = node.parentElement) {
      if (node.classList.contains("ln")) continue;
      const style = getComputedStyle(node);
      if (!transparent(style.backgroundColor) || style.backgroundImage !== "none") return node;
      if (parseFloat(style.borderTopWidth) > 0 && parseFloat(style.borderLeftWidth) > 0) return node;
    }
    return stage;
  }

  function clipped(el, rect) {
    let box = { left: rect.left, top: rect.top, right: rect.right, bottom: rect.bottom };
    let cut = null;
    for (let node = el; node && node !== document.body; node = node.parentElement) {
      const style = getComputedStyle(node);
      if (style.overflowX === "visible" && style.overflowY === "visible") continue;
      const edge = node.getBoundingClientRect();
      const next = {
        left: Math.max(box.left, edge.left),
        top: Math.max(box.top, edge.top),
        right: Math.min(box.right, edge.right),
        bottom: Math.min(box.bottom, edge.bottom),
      };
      if (next.right - next.left < 1 || next.bottom - next.top < 1) return { hidden: true };
      // Horizontal only. Masked lines use clip-path on the Y axis while they rise;
      // glyph ink also often pokes a few pixels past a tight line-box.
      const partial = next.left > box.left + 2 || next.right < box.right - 2;
      if (partial && !cut) cut = node;
      box = next;
    }
    return { box, cut };
  }

  const walker = document.createTreeWalker(stage, NodeFilter.SHOW_TEXT);
  const items = [];
  for (let node = walker.nextNode(); node; node = walker.nextNode()) {
    const text = node.textContent.trim();
    const el = node.parentElement;
    if (!text || !el || el.closest("[data-bleed]") || el.closest("svg")) continue;
    if (shown(el) < 0.05) continue;
    const range = document.createRange();
    range.selectNodeContents(node);
    const container = boxed(el);
    const limit = container.getBoundingClientRect();
    for (const rect of range.getClientRects()) {
      if (rect.width < 1 || rect.height < 1) continue;
      const result = clipped(el, rect);
      if (result.hidden) continue;
      const label = text.length > 40 ? text.slice(0, 40) + "…" : text;
      if (result.cut) {
        found.push(`"${label}" is cut off by its box`);
        continue;
      }
      const box = result.box;
      if (box.left < limit.left - 3 || box.right > limit.right + 3 || box.top < limit.top - 3 || box.bottom > limit.bottom + 3) {
        found.push(`"${label}" spills out of its ${container === stage ? "stage" : "container"}`);
        continue;
      }
      items.push({ el, container, label, box });
    }
  }

  for (let i = 0; i < items.length; i += 1) {
    for (let j = i + 1; j < items.length; j += 1) {
      const a = items[i];
      const b = items[j];
      if (a.el === b.el || a.container !== b.container || a.el.contains(b.el) || b.el.contains(a.el)) continue;
      const shrink = (box) => {
        const trim = (box.bottom - box.top) * 0.22;
        return { left: box.left + 2, right: box.right - 2, top: box.top + trim, bottom: box.bottom - trim };
      };
      const p = shrink(a.box);
      const q = shrink(b.box);
      if (Math.min(p.right, q.right) - Math.max(p.left, q.left) > 2 && Math.min(p.bottom, q.bottom) - Math.max(p.top, q.top) > 2) {
        found.push(`"${a.label}" overlaps "${b.label}"`);
      }
    }
  }

  for (const el of stage.querySelectorAll("[data-fit-overflow]")) {
    found.push(`"${el.textContent.trim().replace(/\s+/g, " ").slice(0, 40)}" is still too wide at the smallest data-fit size`);
  }
  return [...new Set(found)];
}

async function fit(browser, file) {
  const ad = await open(browser, file);
  let problems = 0;
  for (const sample of sampleTimes(ad, "auto")) {
    await seek(ad.page, sample.time);
    const found = await ad.page.evaluate(inspectFrame);
    for (const message of found) {
      problems += 1;
      console.log(`  ${sample.time.toFixed(2)}s ${sample.name}: ${message}`);
    }
  }
  await ad.page.close();
  console.log(problems ? `fit: ${problems} problem(s) in ${file}` : `fit ok: ${file}`);
  return problems;
}

async function webm(browser, file) {
  const out = path.resolve(arg("--webm"));
  if (fs.existsSync(out) && !argv.includes("--force")) {
    console.error(`error: ${out} exists. Pick a new name or pass --force.`);
    process.exit(1);
  }
  const fps = Number(arg("--fps", "30"));
  const crf = Number(arg("--crf", "32"));
  if (!Number.isFinite(fps) || fps <= 0 || !Number.isFinite(crf)) throw new Error("--fps and --crf must be numbers");
  fs.mkdirSync(path.dirname(out), { recursive: true });

  const ad = await open(browser, file);
  const ffmpegPath = arg("--ffmpeg", process.env.FFMPEG || "ffmpeg");
  const encoder = spawn(
    ffmpegPath,
    [
      "-y", "-loglevel", "error",
      "-f", "image2pipe", "-framerate", String(fps), "-c:v", "png", "-i", "-",
      "-c:v", "libvpx-vp9", "-pix_fmt", "yuv420p", "-b:v", "0", "-crf", String(crf),
      "-row-mt", "1", "-deadline", "good", "-cpu-used", "4",
      out,
    ],
    { stdio: ["pipe", "inherit", "inherit"] },
  );
  let failure = null;
  encoder.on("error", (error) => {
    failure = error.code === "ENOENT" ? new Error(`ffmpeg not found (${ffmpegPath}). Install ffmpeg or pass --ffmpeg <path>.`) : error;
  });
  const finished = once(encoder, "close");

  const frames = Math.round(ad.duration * fps);
  const started = Date.now();
  for (let frame = 0; frame < frames; frame += 1) {
    if (failure) break;
    await seek(ad.page, Math.min(frame / fps, ad.duration));
    const image = await ad.page.screenshot({ clip: ad.clip, type: "png" });
    if (!encoder.stdin.write(image)) await Promise.race([once(encoder.stdin, "drain"), finished]);
    if (frame % fps === 0) process.stdout.write(`\r  frame ${frame + 1}/${frames}`);
  }
  if (!failure) encoder.stdin.end();
  const [code] = await finished;
  await ad.page.close();
  process.stdout.write("\n");
  if (failure) throw failure;
  if (code !== 0) throw new Error(`ffmpeg exited with code ${code}`);
  const size = (fs.statSync(out).size / 1024 / 1024).toFixed(2);
  console.log(`${out} (${frames} frames at ${fps} fps, ${size} MB, ${((Date.now() - started) / 1000).toFixed(0)}s)`);
}

const files = inputs();
const modes = ["--webm", "--stills", "--fit"].filter((flag) => argv.includes(flag));
if (!files.length || !modes.length) {
  console.error(usage);
  process.exit(1);
}
for (const file of files) {
  if (!fs.existsSync(file)) {
    console.error(`error: ${file} not found`);
    process.exit(1);
  }
}
if (argv.includes("--webm") && files.length > 1) {
  console.error("error: --webm takes one ad at a time");
  process.exit(1);
}

const browser = await launch();
let status = 0;
try {
  for (const file of files) {
    if (argv.includes("--fit") && (await fit(browser, file))) status = 1;
    if (argv.includes("--stills")) await stills(browser, file);
    if (argv.includes("--webm")) await webm(browser, file);
  }
} catch (error) {
  console.error("error: " + error.message);
  status = 1;
} finally {
  await browser.close();
}
process.exit(status);
