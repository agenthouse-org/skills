import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { pack } from "./pack.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const templates = path.join(root, "templates");

function arg(name, fallback) {
  const index = process.argv.indexOf(name);
  if (index === -1 || !process.argv[index + 1] || process.argv[index + 1].startsWith("--")) return fallback;
  return process.argv[index + 1];
}

function retime(html) {
  return html
    .replace('data-duration="15"', `data-duration="${duration}"`)
    .replace('data-w="1920"', `data-w="${width}"`)
    .replace('data-h="1080"', `data-h="${height}"`);
}

const dir = arg("--dir");
const out = arg("--out");
if (!dir && !out) {
  console.error("Usage: node scripts/new-ad.mjs --dir <scene-folder> [--duration 15] [--width 1920] [--height 1080] [--force]");
  console.error("       node scripts/new-ad.mjs --out <file.html> [--title T] [--lang en] [--duration 15] [--width 1920] [--height 1080]");
  process.exit(1);
}

const duration = arg("--duration", "15");
const width = arg("--width", "1920");
const height = arg("--height", "1080");
const lang = arg("--lang", "en");
const changed = duration !== "15" || width !== "1920" || height !== "1080";

if (dir) {
  const target = path.resolve(dir);
  if (fs.existsSync(path.join(target, "scene.html")) && !process.argv.includes("--force")) {
    console.error(`error: ${path.join(target, "scene.html")} exists. Pick a new folder or pass --force.`);
    process.exit(1);
  }
  fs.mkdirSync(target, { recursive: true });
  fs.writeFileSync(path.join(target, "scene.html"), retime(fs.readFileSync(path.join(templates, "scene.html"), "utf8")));
  fs.copyFileSync(path.join(templates, "scene.css"), path.join(target, "scene.css"));
  fs.copyFileSync(path.join(templates, "copy.en.json"), path.join(target, `copy.${lang}.json`));
  const destination = pack({ scene: target, lang, out: out || path.join(target, `index.${lang}.html`) });
  console.log(target);
  console.log(destination);
} else {
  const destination = pack({ scene: templates, out, title: arg("--title", "Motion ad"), lang: "en" });
  let html = fs.readFileSync(destination, "utf8").replace('<html lang="en"', `<html lang="${lang}"`);
  if (changed) html = retime(html);
  fs.writeFileSync(destination, html);
  console.log(destination);
}

if (duration !== "15") console.log("Scaffold beats are timed for 15s. Retime them to the new duration before delivery.");
console.log("Scaffold only. Replace the copy, match the brand, then run check-ad.mjs --strict.");
