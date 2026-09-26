import fs from "node:fs";

const file = process.argv[2];
const strict = process.argv.includes("--strict");
if (!file || file.startsWith("--")) {
  console.error("Usage: node scripts/check-ad.mjs <file.html> [--strict]");
  process.exit(1);
}

const html = fs.readFileSync(file, "utf8");
const errors = [];
const warnings = [];

function fail(message) {
  (strict ? errors : warnings).push(message);
}

if (/<video\b/i.test(html)) errors.push("contains a video element");
if (/<audio\b/i.test(html)) errors.push("contains an audio element");
if (/<iframe\b/i.test(html)) errors.push("contains an iframe");
if (/\.(mp4|webm|mov|m4v|ogv)\b/i.test(html)) errors.push("references a video file");
if (/<script\b[^>]*\bsrc\s*=/i.test(html)) errors.push("loads an external script; keep the runtime inline");
if (!/id="stage"/.test(html)) errors.push('missing id="stage"');
if (!/prefers-reduced-motion/.test(html)) errors.push("missing reduced-motion handling");
if (!/function seek\(/.test(html)) errors.push("missing seek()");
if (!/window\.ad\s*=/.test(html)) errors.push("missing window.ad");
if (/@keyframes/.test(html)) errors.push("uses @keyframes; drive story motion from the clock so scrubbing stays honest");
if (/transition\s*:/.test(html)) errors.push("uses CSS transition; drive story motion from the clock");
const css = [...html.matchAll(/<style\b[^>]*>([\s\S]*?)<\/style>/gi)].map((match) => match[1]).join("\n")
  + [...html.matchAll(/\bstyle="([^"]*)"/gi)].map((match) => match[1]).join("\n");
if (/clamp\([^;{}]*?,\s*0\s*,\s*1\s*\)/.test(css)) {
  errors.push("clamp(value, 0, 1) does not cap at 1; CSS order is clamp(0, value, 1)");
}

const durationMatch = html.match(/data-duration="([\d.]+)"/);
const duration = durationMatch ? Number(durationMatch[1]) : NaN;
if (!durationMatch || !Number.isFinite(duration) || duration <= 0) {
  errors.push("missing a numeric data-duration");
}

const beats = [];
for (const tag of html.match(/<[a-z0-9]+\b[^>]*>/gi) || []) {
  const className = tag.match(/\bclass="([^"]*)"/);
  if (!className || !className[1].split(/\s+/).includes("beat")) continue;
  const read = (name) => {
    const found = tag.match(new RegExp("\\b" + name + '="([^"]*)"'));
    return found ? found[1] : "";
  };
  const start = Number(read("data-in"));
  const end = Number(read("data-out"));
  const classes = className[1].split(/\s+/).filter((name) => name !== "beat");
  beats.push({ start, end, hold: read("data-hold") === "1", name: classes[0] || "beat" });
}

if (!Number.isFinite(duration)) {
  // already reported
} else if (beats.length < 3) {
  errors.push("needs at least 3 beats");
} else {
  beats.forEach((beat, index) => {
    if (!Number.isFinite(beat.start) || !Number.isFinite(beat.end)) {
      errors.push(`beat ${index + 1} is missing data-in or data-out`);
      return;
    }
    if (beat.end <= beat.start) errors.push(`${beat.name} ends before it starts`);
    if (beat.start < -0.001 || beat.end > duration + 0.001) {
      errors.push(`${beat.name} sits outside 0–${duration}s`);
    }
  });
  const ordered = [...beats].sort((a, b) => a.start - b.start);
  for (let index = 1; index < ordered.length; index += 1) {
    if (ordered[index].start > ordered[index - 1].end + 0.05) {
      warnings.push(`dead air before ${ordered[index].name}`);
    }
  }
  const last = ordered[ordered.length - 1];
  if (!last.hold && last.end < duration - 0.001) errors.push("last beat must hold through the end (data-hold=\"1\")");
  if (last.end < duration - 0.05) errors.push("timeline stops short of data-duration");
  if (duration === 15 && (beats.length < 4 || beats.length > 5)) {
    warnings.push("a 15s piece usually wants 4 or 5 beats");
  }
}

if (/data-scaffold="1"/.test(html)) fail("scaffold copy is still in place");
if (/\{\{/.test(html) || /REPLACE_ME/.test(html)) fail("unfilled placeholder");

const label = strict ? "strict" : "check";
if (errors.length) {
  console.error(`error ${label}: ${file}`);
  for (const error of errors) console.error("  " + error);
  for (const warning of warnings) console.error("  warning: " + warning);
  process.exit(1);
}

console.log(`ok ${label}: ${file}`);
if (Number.isFinite(duration)) console.log(`duration ${duration}s, ${beats.length} beats`);
for (const beat of beats) {
  console.log(`  ${beat.start.toFixed(2)}–${beat.end.toFixed(2)}  ${beat.name}${beat.hold ? "  hold" : ""}`);
}
for (const warning of warnings) console.log("  warning: " + warning);
