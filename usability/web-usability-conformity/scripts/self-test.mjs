#!/usr/bin/env node
/**
 * Self-test: pass fixture should be cleaner than fail fixture.
 */
import { spawn } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { readFile, mkdir } from "node:fs/promises";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const skillRoot = path.resolve(__dirname, "..");
const auditScript = path.join(skillRoot, "scripts", "audit.mjs");
const outDir = path.join(skillRoot, ".audit-self-test");

function run(fixture, outFile) {
  return new Promise((resolve, reject) => {
    const child = spawn(
      process.execPath,
      [auditScript, "--fixture", fixture, "--out", outFile],
      { cwd: skillRoot, stdio: ["ignore", "pipe", "pipe"] }
    );
    let stdout = "";
    let stderr = "";
    child.stdout.on("data", (d) => (stdout += d));
    child.stderr.on("data", (d) => (stderr += d));
    child.on("close", (code) => resolve({ code, stdout, stderr }));
    child.on("error", reject);
  });
}

await mkdir(outDir, { recursive: true });
const passOut = path.join(outDir, "pass.json");
const failOut = path.join(outDir, "fail.json");

const passRun = await run("fixtures/pass-basic.html", passOut);
const failRun = await run("fixtures/fail-basic.html", failOut);

const pass = JSON.parse(await readFile(passOut, "utf8"));
const fail = JSON.parse(await readFile(failOut, "utf8"));

const passScore = pass.summary.axeViolations + pass.summary.criticalOrSerious;
const failScore = fail.summary.axeViolations + fail.summary.criticalOrSerious;

console.log("pass fixture:", pass.summary);
console.log("fail fixture:", fail.summary);

if (failScore <= passScore) {
  console.error("Self-test failed: fail fixture should score worse than pass fixture");
  console.error({ passScore, failScore, passRun: passRun.code, failRun: failRun.code });
  process.exit(1);
}

if (fail.summary.axeViolations < 1 && fail.layers.technical.dom.issues.length < 1) {
  console.error("Self-test failed: fail fixture produced no technical issues");
  process.exit(1);
}

console.log("Self-test OK");
process.exit(0);
