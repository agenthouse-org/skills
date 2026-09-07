#!/usr/bin/env node
/**
 * Dual-layer web usability audit: technical (DOM/HTML/axe) + visual (Playwright).
 * Usage:
 *   node scripts/audit.mjs --url http://localhost:3000 --out audit-report.json
 *   node scripts/audit.mjs --fixture fixtures/pass-basic.html --out pass.json --screenshots
 */

import { createServer } from "node:http";
import { readFile, mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright";
import AxeBuilder from "@axe-core/playwright";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const skillRoot = path.resolve(__dirname, "..");

function parseArgs(argv) {
  const args = {
    url: null,
    fixture: null,
    out: "audit-report.json",
    screenshots: false,
    outDir: null,
    timeout: 30000,
  };
  for (let i = 2; i < argv.length; i++) {
    const a = argv[i];
    if (a === "--url") args.url = argv[++i];
    else if (a === "--fixture") args.fixture = argv[++i];
    else if (a === "--out") args.out = argv[++i];
    else if (a === "--out-dir") args.outDir = argv[++i];
    else if (a === "--screenshots") args.screenshots = true;
    else if (a === "--timeout") args.timeout = Number(argv[++i]);
    else if (a === "--help" || a === "-h") args.help = true;
  }
  return args;
}

function usage() {
  return `Usage:
  node scripts/audit.mjs --url <URL> [--out report.json] [--screenshots] [--out-dir dir]
  node scripts/audit.mjs --fixture <path.html> [--out report.json] [--screenshots]

Runs axe-core (WCAG 2.2 A+AA tags), DOM/HTML checks, and Playwright visual/interaction checks.
Install once: npm install && npx playwright install chromium`;
}

async function startFixtureServer(fixturePath) {
  const abs = path.resolve(skillRoot, fixturePath);
  const html = await readFile(abs, "utf8");
  const server = createServer((req, res) => {
    res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
    res.end(html);
  });
  await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
  const { port } = server.address();
  return {
    url: `http://127.0.0.1:${port}/`,
    close: () => new Promise((resolve, reject) => server.close((e) => (e ? reject(e) : resolve()))),
  };
}

async function runHtmlValidate(html) {
  try {
    const { HtmlValidate } = await import("html-validate");
    const htmlvalidate = new HtmlValidate({
      extends: ["html-validate:recommended"],
      rules: {
        "no-inline-style": "off",
        "require-sri": "off",
        "script-type": "off",
        // Playwright's page.content() serializes boolean attrs as attr=""; ignore style noise.
        "attribute-boolean-style": "off",
        "void-style": "off",
      },
    });
    const report = await htmlvalidate.validateString(html);
    return {
      available: true,
      valid: report.valid,
      errorCount: report.errorCount,
      warningCount: report.warningCount,
      messages: report.results.flatMap((r) =>
        r.messages.map((m) => ({
          ruleId: m.ruleId,
          severity: m.severity,
          message: m.message,
          line: m.line,
          column: m.column,
        }))
      ),
    };
  } catch (err) {
    return { available: false, error: String(err.message || err) };
  }
}

async function collectDomChecks(page) {
  return page.evaluate(() => {
    const issues = [];
    const html = document.documentElement;
    const lang = html.getAttribute("lang");
    if (!lang || !lang.trim()) {
      issues.push({ id: "doc-lang", sc: "3.1.1", severity: "critical", message: "Missing html lang attribute" });
    }

    const title = document.title?.trim() || "";
    if (!title) {
      issues.push({ id: "doc-title", sc: "2.4.2", severity: "critical", message: "Empty or missing document title" });
    }

    const ids = [...document.querySelectorAll("[id]")].map((el) => el.id).filter(Boolean);
    const seen = new Set();
    for (const id of ids) {
      if (seen.has(id)) {
        issues.push({ id: "duplicate-id", sc: "4.1.2", severity: "serious", message: `Duplicate id: ${id}` });
      }
      seen.add(id);
    }

    const skip = document.querySelector(
      'a[href="#main"], a[href="#content"], a[href="#main-content"], .skip, .skip-link, [class*="skip-link"]'
    );
    const landmarks = document.querySelectorAll('main, [role="main"], nav, [role="navigation"]');
    if (!skip && landmarks.length === 0) {
      issues.push({
        id: "bypass-blocks",
        sc: "2.4.1",
        severity: "moderate",
        message: "No skip link and no main/nav landmarks detected",
      });
    }

    const headings = [...document.querySelectorAll("h1,h2,h3,h4,h5,h6")].map((h) => ({
      level: Number(h.tagName.slice(1)),
      text: (h.textContent || "").trim().slice(0, 80),
    }));
    if (headings.length === 0) {
      issues.push({ id: "no-headings", sc: "1.3.1", severity: "moderate", message: "No heading elements found" });
    }

    for (const img of document.querySelectorAll("img")) {
      if (!img.hasAttribute("alt")) {
        issues.push({
          id: "img-alt",
          sc: "1.1.1",
          severity: "critical",
          message: "Image missing alt attribute",
          selector: img.outerHTML.slice(0, 120),
        });
      }
    }

    for (const iframe of document.querySelectorAll("iframe")) {
      const name = iframe.getAttribute("title") || iframe.getAttribute("aria-label");
      if (!name) {
        issues.push({
          id: "iframe-name",
          sc: "4.1.2",
          severity: "serious",
          message: "iframe missing accessible name (title/aria-label)",
        });
      }
    }

    const controls = document.querySelectorAll("input:not([type=hidden]):not([type=submit]):not([type=button]):not([type=image]), select, textarea");
    for (const el of controls) {
      const id = el.id;
      const hasLabel = id && document.querySelector(`label[for="${CSS.escape(id)}"]`);
      const wrapped = el.closest("label");
      const aria = el.getAttribute("aria-label") || el.getAttribute("aria-labelledby");
      if (!hasLabel && !wrapped && !aria) {
        issues.push({
          id: "control-label",
          sc: "3.3.2",
          severity: "critical",
          message: `Form control without label: ${el.tagName.toLowerCase()}[name="${el.getAttribute("name") || ""}"]`,
        });
      }
    }

    for (const el of document.querySelectorAll("[tabindex]")) {
      const v = Number(el.getAttribute("tabindex"));
      if (!Number.isNaN(v) && v > 0) {
        issues.push({
          id: "positive-tabindex",
          sc: "2.4.3",
          severity: "moderate",
          message: `Positive tabindex=${v} can disrupt focus order`,
          selector: el.tagName.toLowerCase(),
        });
      }
    }

    return {
      lang: lang || null,
      title,
      headingOutline: headings,
      landmarkCount: landmarks.length,
      hasSkipLink: Boolean(skip),
      issues,
    };
  });
}

async function collectTargetSizeIssues(page) {
  return page.evaluate(() => {
    const MIN = 24;
    const issues = [];
    const candidates = document.querySelectorAll(
      'a[href], button, input, select, textarea, [role="button"], [role="link"], [tabindex]:not([tabindex="-1"])'
    );
    for (const el of candidates) {
      const style = getComputedStyle(el);
      if (style.display === "none" || style.visibility === "hidden") continue;
      const r = el.getBoundingClientRect();
      if (r.width === 0 && r.height === 0) continue;
      if (r.width < MIN || r.height < MIN) {
        // Spacing exception is not fully computed here — flag for review
        issues.push({
          id: "target-size",
          sc: "2.5.8",
          severity: "moderate",
          message: `Target may be below 24×24 CSS px (${Math.round(r.width)}×${Math.round(r.height)})`,
          text: (el.textContent || el.getAttribute("aria-label") || "").trim().slice(0, 40),
        });
      }
    }
    return issues;
  });
}

async function collectFocusNotObscured(page) {
  const findings = [];
  const focusables = page.locator(
    'a[href], button, input, select, textarea, [tabindex]:not([tabindex="-1"])'
  );
  const count = await focusables.count();
  const limit = Math.min(count, 25);
  for (let i = 0; i < limit; i++) {
    const el = focusables.nth(i);
    try {
      await el.focus({ timeout: 1000 });
    } catch {
      continue;
    }
    const obscured = await page.evaluate(() => {
      const active = document.activeElement;
      if (!active || active === document.body) return null;
      const r = active.getBoundingClientRect();
      if (r.width === 0 || r.height === 0) return null;
      const cx = r.left + r.width / 2;
      const cy = r.top + r.height / 2;
      const topEl = document.elementFromPoint(cx, cy);
      if (!topEl) return null;
      if (active === topEl || active.contains(topEl) || topEl.contains(active)) return null;
      // Fully obscured if center is another author element
      return {
        focused: (active.tagName + (active.id ? `#${active.id}` : "")).slice(0, 60),
        obscurer: (topEl.tagName + (topEl.id ? `#${topEl.id}` : "")).slice(0, 60),
      };
    });
    if (obscured) {
      findings.push({
        id: "focus-obscured",
        sc: "2.4.11",
        severity: "serious",
        message: `Focused control may be obscured: ${obscured.focused} under ${obscured.obscurer}`,
      });
    }
  }
  return findings;
}

async function collectKeyboardBasics(page) {
  const issues = [];
  // Tab a few times and ensure something receives focus
  await page.keyboard.press("Tab");
  let active = await page.evaluate(() => {
    const el = document.activeElement;
    if (!el || el === document.body) return null;
    const style = getComputedStyle(el);
    return {
      tag: el.tagName,
      outline: style.outlineStyle,
      outlineWidth: style.outlineWidth,
      boxShadow: style.boxShadow,
    };
  });
  if (!active) {
    // try again from body
    await page.locator("body").click({ position: { x: 1, y: 1 } }).catch(() => {});
    await page.keyboard.press("Tab");
    active = await page.evaluate(() => {
      const el = document.activeElement;
      if (!el || el === document.body) return null;
      const style = getComputedStyle(el);
      return {
        tag: el.tagName,
        outline: style.outlineStyle,
        outlineWidth: style.outlineWidth,
        boxShadow: style.boxShadow,
      };
    });
  }
  if (!active) {
    issues.push({
      id: "keyboard-focus",
      sc: "2.1.1",
      severity: "serious",
      message: "Tab did not move focus to an interactive element",
    });
  } else {
    const hasVisible =
      (active.outline && active.outline !== "none" && active.outlineWidth !== "0px") ||
      (active.boxShadow && active.boxShadow !== "none");
    if (!hasVisible) {
      issues.push({
        id: "focus-visible",
        sc: "2.4.7",
        severity: "moderate",
        message: "Focused element may lack a visible focus indicator (outline/box-shadow)",
        tag: active.tag,
      });
    }
  }
  return { issues, firstFocused: active };
}

async function collectReflow(page) {
  const issues = [];
  await page.setViewportSize({ width: 320, height: 800 });
  const overflow = await page.evaluate(() => {
    const doc = document.documentElement;
    return {
      scrollWidth: doc.scrollWidth,
      clientWidth: doc.clientWidth,
      bodyScrollWidth: document.body?.scrollWidth || 0,
    };
  });
  if (overflow.scrollWidth > overflow.clientWidth + 8) {
    issues.push({
      id: "reflow",
      sc: "1.4.10",
      severity: "moderate",
      message: `Horizontal overflow at 320px CSS width (scrollWidth=${overflow.scrollWidth}, clientWidth=${overflow.clientWidth})`,
    });
  }
  return { issues, metrics: overflow };
}

async function collectDraggingHints(page) {
  return page.evaluate(() => {
    const issues = [];
    const draggables = document.querySelectorAll("[draggable='true'], [data-draggable], .sortable, [class*='drag']");
    if (draggables.length > 0) {
      issues.push({
        id: "dragging-present",
        sc: "2.5.7",
        severity: "moderate",
        message: `Possible dragging UI detected (${draggables.length} nodes). Confirm a single-pointer alternative exists.`,
        needsHumanConfirmation: true,
      });
    }
    return issues;
  });
}

async function runAxe(page) {
  const results = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22a", "wcag22aa"])
    .analyze();
  return {
    violations: results.violations.map((v) => ({
      id: v.id,
      impact: v.impact,
      description: v.description,
      helpUrl: v.helpUrl,
      tags: v.tags,
      nodes: v.nodes.slice(0, 10).map((n) => ({
        target: n.target,
        failureSummary: n.failureSummary,
        html: n.html?.slice(0, 200),
      })),
    })),
    passes: results.passes.length,
    incomplete: results.incomplete.map((v) => ({
      id: v.id,
      description: v.description,
      nodes: v.nodes.length,
    })),
    inapplicable: results.inapplicable.length,
  };
}

async function maybeScreenshot(page, outDir, name) {
  if (!outDir) return null;
  await mkdir(outDir, { recursive: true });
  const file = path.join(outDir, `${name}.png`);
  await page.screenshot({ path: file, fullPage: true });
  return file;
}

async function auditTarget(targetUrl, options) {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1280, height: 800 },
    reducedMotion: "reduce",
  });
  const page = await context.newPage();
  page.setDefaultTimeout(options.timeout);

  const report = {
    skill: "web-usability-conformity",
    version: "0.1.0",
    targetUrl,
    startedAt: new Date().toISOString(),
    norms: {
      primary: "WCAG 2.2 Level A+AA",
      iso: "ISO/IEC 40500:2025",
      en301549: "clause 9 (map SC ids; see references/norms-mapping.md)",
    },
    layers: {},
    screenshots: [],
    summary: {},
  };

  try {
    await page.goto(targetUrl, { waitUntil: "networkidle", timeout: options.timeout });
  } catch {
    await page.goto(targetUrl, { waitUntil: "domcontentloaded", timeout: options.timeout });
  }

  if (options.screenshots) {
    const shot = await maybeScreenshot(page, options.outDir, "01-initial");
    if (shot) report.screenshots.push(shot);
  }

  const html = await page.content();
  const htmlValidate = await runHtmlValidate(html);
  const dom = await collectDomChecks(page);
  const axe = await runAxe(page);

  report.layers.technical = {
    htmlValidate,
    dom,
    axe,
  };

  // Restore viewport for interaction checks
  await page.setViewportSize({ width: 1280, height: 800 });
  const keyboard = await collectKeyboardBasics(page);
  const focusObscured = await collectFocusNotObscured(page);
  const targets = await collectTargetSizeIssues(page);
  const dragging = await collectDraggingHints(page);
  const reflow = await collectReflow(page);

  if (options.screenshots) {
    const shot = await maybeScreenshot(page, options.outDir, "02-reflow-320");
    if (shot) report.screenshots.push(shot);
  }

  // Zoom-ish check: large text via CSS zoom when supported
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.evaluate(() => {
    document.documentElement.style.zoom = "2";
  });
  const zoomOverflow = await page.evaluate(() => ({
    scrollWidth: document.documentElement.scrollWidth,
    clientWidth: document.documentElement.clientWidth,
  }));
  await page.evaluate(() => {
    document.documentElement.style.zoom = "";
  });

  const visualIssues = [
    ...keyboard.issues,
    ...focusObscured,
    ...targets,
    ...dragging,
    ...reflow.issues,
  ];

  if (zoomOverflow.scrollWidth > zoomOverflow.clientWidth * 2 + 40) {
    visualIssues.push({
      id: "resize-text-overflow",
      sc: "1.4.4",
      severity: "moderate",
      message: "Possible content loss/overflow at ~200% zoom (CSS zoom approximation)",
    });
  }

  report.layers.visual = {
    keyboard,
    focusNotObscured: focusObscured,
    targetSize: targets,
    dragging,
    reflow,
    zoomApprox: zoomOverflow,
    issues: visualIssues,
  };

  await browser.close();

  const techIssues = [
    ...(dom.issues || []),
    ...(axe.violations || []).map((v) => ({
      id: `axe:${v.id}`,
      severity: v.impact || "serious",
      message: v.description,
      scHints: v.tags,
    })),
  ];
  if (htmlValidate.available && !htmlValidate.valid) {
    techIssues.push({
      id: "html-validate",
      severity: "moderate",
      message: `html-validate reported ${htmlValidate.errorCount} error(s) (engineering hygiene; WCAG 4.1.1 is obsolete in 2.2)`,
    });
  }

  report.summary = {
    technicalIssueCount: techIssues.length,
    visualIssueCount: visualIssues.length,
    axeViolations: axe.violations.length,
    axeIncomplete: axe.incomplete.length,
    criticalOrSerious:
      [...techIssues, ...visualIssues].filter((i) =>
        ["critical", "serious"].includes(String(i.severity || "").toLowerCase())
      ).length,
    note: "Harness findings are evidence only. Complete every applicable SC in references/sc-matrix.md before claiming conformity.",
  };

  report.finishedAt = new Date().toISOString();
  return report;
}

async function main() {
  const args = parseArgs(process.argv);
  if (args.help || (!args.url && !args.fixture)) {
    console.log(usage());
    process.exit(args.help ? 0 : 1);
  }

  let closeServer = null;
  let targetUrl = args.url;
  try {
    if (args.fixture) {
      const server = await startFixtureServer(args.fixture);
      targetUrl = server.url;
      closeServer = server.close;
    }

    const outPath = path.resolve(process.cwd(), args.out);
    const outDir =
      args.outDir ||
      (args.screenshots ? path.join(path.dirname(outPath), path.basename(outPath, path.extname(outPath)) + "-shots") : null);

    const report = await auditTarget(targetUrl, {
      timeout: args.timeout,
      screenshots: args.screenshots,
      outDir,
    });
    if (args.fixture) report.fixture = args.fixture;

    await mkdir(path.dirname(outPath), { recursive: true });
    await writeFile(outPath, JSON.stringify(report, null, 2), "utf8");
    console.log(`Wrote ${outPath}`);
    console.log(
      `Summary: axeViolations=${report.summary.axeViolations} technicalIssues≈${report.summary.technicalIssueCount} visualIssues=${report.summary.visualIssueCount} criticalOrSerious=${report.summary.criticalOrSerious}`
    );
    process.exitCode = report.summary.criticalOrSerious > 0 ? 2 : 0;
  } finally {
    if (closeServer) await closeServer();
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
