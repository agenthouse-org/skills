#!/usr/bin/env node
import fs from "node:fs";
import process from "node:process";
import sharp from "sharp";

function parseArgs(argv) {
  const [input, output, ...rest] = argv;
  if (!input || !output) throw new Error("Usage: apply-disclosure.mjs <input> <output> --icon <file>");
  const options = { input, output, icon: null, corner: "bottom-right", relativeWidth: 0.15, margin: 0.02, overwrite: false };
  for (let i = 0; i < rest.length; i += 1) {
    const arg = rest[i];
    if (arg === "--icon") options.icon = rest[++i];
    else if (arg === "--corner") options.corner = rest[++i];
    else if (arg === "--relative-width") options.relativeWidth = Number(rest[++i]);
    else if (arg === "--margin") options.margin = Number(rest[++i]);
    else if (arg === "--overwrite") options.overwrite = true;
    else throw new Error(`Unknown argument: ${arg}`);
  }
  if (!options.icon) throw new Error("--icon is required");
  if (!["top-left", "top-right", "bottom-left", "bottom-right"].includes(options.corner)) throw new Error("Invalid --corner");
  if (!(options.relativeWidth >= 0.03 && options.relativeWidth <= 0.5)) throw new Error("--relative-width must be between 0.03 and 0.5");
  if (!(options.margin >= 0 && options.margin <= 0.2)) throw new Error("--margin must be between 0 and 0.2");
  return options;
}

const options = parseArgs(process.argv.slice(2));
if (fs.existsSync(options.output) && !options.overwrite) throw new Error(`Output exists: ${options.output}. Use --overwrite to replace it.`);

const base = sharp(options.input, { failOn: "error" }).rotate();
const metadata = await base.metadata();
if (!metadata.width || !metadata.height) throw new Error("Could not determine image dimensions");

const iconWidth = Math.max(1, Math.round(metadata.width * options.relativeWidth));
const margin = Math.round(metadata.width * options.margin);
const iconBuffer = await sharp(options.icon).resize({ width: iconWidth, withoutEnlargement: true }).png().toBuffer();
const iconMeta = await sharp(iconBuffer).metadata();
const iw = iconMeta.width ?? 0;
const ih = iconMeta.height ?? 0;

const left = options.corner.endsWith("right") ? metadata.width - iw - margin : margin;
const top = options.corner.startsWith("bottom") ? metadata.height - ih - margin : margin;
if (left < 0 || top < 0) throw new Error("Icon and margin do not fit within the image");

await base.composite([{ input: iconBuffer, left, top }]).toFile(options.output);
