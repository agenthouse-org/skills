import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const KEY = /\{\{\s*([\w.-]+)\s*\}\}/g;

export function languages(scene) {
  const sceneDir = resolveScene(scene);
  return fs
    .readdirSync(sceneDir)
    .map((name) => name.match(/^copy\.([a-z]{2,3}(?:-[A-Za-z0-9]+)?)\.json$/))
    .filter(Boolean)
    .map((match) => match[1])
    .sort();
}

export function readCopy(scene, lang) {
  const file = path.join(resolveScene(scene), `copy.${lang}.json`);
  if (!fs.existsSync(file)) return null;
  const copy = JSON.parse(fs.readFileSync(file, "utf8").replace(/^\uFEFF/, ""));
  for (const [key, value] of Object.entries(copy)) {
    if (typeof value !== "string") throw new Error(`copy.${lang}.json: "${key}" must be a string`);
  }
  return copy;
}

function escapeHtml(value) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function fill(source, copy, lang) {
  const used = new Set();
  const missing = new Set();
  const html = source.replace(KEY, (whole, key) => {
    if (!(key in copy)) {
      missing.add(key);
      return whole;
    }
    used.add(key);
    return escapeHtml(copy[key]);
  });
  if (missing.size) throw new Error(`copy.${lang}.json is missing: ${[...missing].join(", ")}`);
  const unused = Object.keys(copy).filter((key) => !used.has(key) && key !== "title");
  return { html, unused };
}

export function pack({ scene, out, title, lang, three = false }) {
  const sceneDir = resolveScene(scene);
  let sceneHtml = fs.readFileSync(path.join(sceneDir, "scene.html"), "utf8").replace(/^\uFEFF/, "").trim();
  const sceneCss = fs.readFileSync(path.join(sceneDir, "scene.css"), "utf8").replace(/^\uFEFF/, "");
  const available = languages(sceneDir);
  const code = lang || (available.includes("en") ? "en" : available[0]) || "en";
  const copy = readCopy(sceneDir, code);
  if (available.length && !copy) throw new Error(`No copy.${code}.json in ${sceneDir}`);
  let unused = [];
  if (copy) {
    ({ html: sceneHtml, unused } = fill(sceneHtml, copy, code));
  }
  const pageTitle = title || (copy && copy.title) || "Motion ad";
  const page = fs.readFileSync(path.join(root, "templates", "page.html"), "utf8");
  let threeScript = "";
  if (three || /<canvas\b[^>]*\bdata-motion-three(?:\s|=|>)/i.test(sceneHtml)) {
    let buildSync;
    try { ({ buildSync } = awaitEsbuild()); }
    catch { throw new Error('3D scenes need dependencies: run npm install in the motion-ad skill directory'); }
    const scene3d = path.join(sceneDir, "scene-3d.js");
    const entry = fs.existsSync(scene3d) ? scene3d : path.join(root, "assets", "three-scene.js");
    const bundled = buildSync({ entryPoints: [entry], nodePaths: [path.join(root, "node_modules")], bundle: true, minify: true, write: false, format: "iife", platform: "browser", legalComments: "inline" }).outputFiles[0].text;
    const license = fs.readFileSync(path.join(root, "node_modules", "three", "LICENSE"), "utf8");
    threeScript = '<script data-motion-three-bundle>\n/*\n' + license.replaceAll('*/', '* /') + '\n*/\n' + bundled.replace(/<\/script/gi, '<\\/script') + '\n</script>\n';
  }
  const html = page
    .replaceAll("__LANG__", code)
    .replaceAll("__TITLE__", escapeHtml(pageTitle))
    .replaceAll("__SHELL__", fs.readFileSync(path.join(root, "assets", "shell.css"), "utf8"))
    .replaceAll("__SCENE_CSS__", sceneCss)
    .replaceAll("__SCENE__", sceneHtml)
    .replaceAll("__RUNTIME__", fs.readFileSync(path.join(root, "assets", "runtime.js"), "utf8"))
    .replace('<script>\n/* Seekable stage clock.', () => threeScript + '<script>\n/* Seekable stage clock.');
  const destination = path.resolve(out);
  fs.mkdirSync(path.dirname(destination), { recursive: true });
  fs.writeFileSync(destination, html);
  for (const key of unused) console.warn(`warning: copy.${code}.json key "${key}" is not used`);
  return destination;
}

function awaitEsbuild() {
  return createRequire(import.meta.url)("esbuild");
}

export function packAll({ scene, outDir }) {
  const sceneDir = resolveScene(scene);
  const codes = languages(sceneDir);
  if (!codes.length) throw new Error(`No copy.<lang>.json files in ${sceneDir}`);
  const reference = Object.keys(readCopy(sceneDir, codes.includes("en") ? "en" : codes[0])).sort();
  for (const code of codes) {
    const keys = Object.keys(readCopy(sceneDir, code)).sort();
    const absent = reference.filter((key) => !keys.includes(key));
    if (absent.length) throw new Error(`copy.${code}.json is missing: ${absent.join(", ")}`);
  }
  return codes.map((code) => pack({ scene: sceneDir, lang: code, out: path.join(outDir || sceneDir, `index.${code}.html`) }));
}

function resolveScene(scene) {
  const candidates = [path.resolve(scene), path.resolve(root, scene)];
  for (const candidate of candidates) {
    if (fs.existsSync(path.join(candidate, "scene.html"))) return candidate;
  }
  throw new Error("No scene.html in " + scene);
}

function arg(name, fallback) {
  const index = process.argv.indexOf(name);
  if (index === -1 || !process.argv[index + 1] || process.argv[index + 1].startsWith("--")) return fallback;
  return process.argv[index + 1];
}

function invokedDirectly() {
  const entry = process.argv[1];
  if (!entry) return false;
  return path.resolve(entry) === path.resolve(fileURLToPath(import.meta.url));
}

if (invokedDirectly()) {
  const scene = arg("--scene");
  const out = arg("--out");
  const all = process.argv.includes("--all");
  if (!scene || (!out && !all)) {
    console.error("Usage: node scripts/pack.mjs --scene <dir> --out <file.html> [--lang en] [--title T]");
    console.error("       node scripts/pack.mjs --scene <dir> --all [--out-dir <dir>]");
    process.exit(1);
  }
  try {
    const written = all
      ? packAll({ scene, outDir: arg("--out-dir") })
      : [pack({ scene, out, title: arg("--title"), lang: arg("--lang") })];
    for (const file of written) console.log(file);
  } catch (error) {
    console.error("error: " + error.message);
    process.exit(1);
  }
}
