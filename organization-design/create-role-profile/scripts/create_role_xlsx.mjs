#!/usr/bin/env node
import fs from "node:fs/promises";
import path from "node:path";
import { SpreadsheetFile, Workbook } from "@oai/artifact-tool";

const [inputPath, outputPath] = process.argv.slice(2);
if (!inputPath || !outputPath) {
  throw new Error("Usage: node create_role_xlsx.mjs INPUT.json OUTPUT.xlsx");
}

const data = JSON.parse(await fs.readFile(inputPath, "utf8"));
if (!data.role_name || !data.purpose || !Array.isArray(data.responsibilities) || data.responsibilities.length === 0) {
  throw new Error("role_name, purpose, and at least one responsibility are required");
}

const lang = data.language === "de" ? "de" : "en";
const labels = lang === "de" ? {
  profile: "Rollenprofil", role: "Rolle", purpose: "Zweck", domains: "Domänen",
  requirements: "Anforderungsprofil", required: "Erforderlich", preferred: "Wünschenswert",
  interfaces: "Schnittstellen", exclusions: "Abgrenzungen", assumptions: "Zu validierende Annahmen",
  matrix: "Verantwortung, Befugnisse und Pflichten", responsibility: "Verantwortungsbereich",
  info: "Information", decision: "Entscheidung", direction: "Fachl. Weisung", policy: "Richtlinie",
  control: "Kontrolle", participation: "Mitwirkung", authorityNotes: "Befugnisnotizen",
  quality: "Qualität", reporting: "Bericht", approval: "Freigabe", obligationNotes: "Pflichtnotizen",
  holder: "Rolleninhaber", approvedBy: "Genehmigt durch", approvalDate: "Genehmigungsdatum",
  reviewDate: "Prüfdatum", yes: "X", definitions: "Definitionen"
} : {
  profile: "Role Profile", role: "Role", purpose: "Purpose", domains: "Domains",
  requirements: "Requirements", required: "Required", preferred: "Preferred",
  interfaces: "Interfaces", exclusions: "Boundaries and exclusions", assumptions: "Assumptions to validate",
  matrix: "Responsibilities, authority, and obligations", responsibility: "Responsibility",
  info: "Information", decision: "Decision", direction: "Functional direction", policy: "Policy",
  control: "Control", participation: "Participation", authorityNotes: "Authority notes",
  quality: "Quality control", reporting: "Reporting", approval: "Approval", obligationNotes: "Obligation notes",
  holder: "Role holder", approvedBy: "Approved by", approvalDate: "Approval date",
  reviewDate: "Review date", yes: "X", definitions: "Definitions"
};

const blue = "#17365D";
const teal = "#1F6D72";
const light = "#EAF1F5";
const pale = "#F4F7F9";
const amber = "#FFF2CC";

const workbook = Workbook.create();
const overview = workbook.worksheets.add("Role Overview");
const matrix = workbook.worksheets.add("Responsibility Matrix");
const definitions = workbook.worksheets.add("Definitions");

for (const sheet of [overview, matrix, definitions]) sheet.showGridLines = false;

overview.getRange("A1:F1").merge();
overview.getRange("A1").values = [[labels.profile.toUpperCase()]];
overview.getRange("A1:F1").format = { fill: teal, font: { bold: true, color: "#FFFFFF", size: 11 }, rowHeight: 24 };
overview.getRange("A2:F2").merge();
overview.getRange("A2").values = [[data.role_name]];
overview.getRange("A2:F2").format = { font: { bold: true, color: blue, size: 22 }, rowHeight: 34 };

const overviewRows = [
  [labels.purpose, data.purpose],
  [labels.domains, (data.domains || []).join("\n")],
  [labels.required, (data.requirements?.required || []).join("\n")],
  [labels.preferred, (data.requirements?.preferred || []).join("\n")],
  [labels.interfaces, (data.interfaces || []).join("\n")],
  [labels.exclusions, (data.exclusions || []).join("\n")],
  [labels.assumptions, (data.assumptions || []).join("\n")],
  [labels.holder, data.holder || ""],
  [labels.approvedBy, data.approved_by || ""],
  [labels.approvalDate, data.approval_date || ""],
  [labels.reviewDate, data.review_date || ""]
];
overview.getRange(`A4:F${3 + overviewRows.length}`).values = overviewRows.map(([a, b]) => [a, b, null, null, null, null]);
for (let row = 4; row <= 3 + overviewRows.length; row++) {
  overview.getRange(`B${row}:F${row}`).merge();
  overview.getRange(`A${row}`).format = { fill: blue, font: { bold: true, color: "#FFFFFF" }, verticalAlignment: "top", wrapText: true };
  overview.getRange(`B${row}:F${row}`).format = { fill: row % 2 ? "#FFFFFF" : pale, verticalAlignment: "top", wrapText: true };
  overview.getRange(`A${row}:F${row}`).format.borders = { preset: "outside", style: "thin", color: "#C7D1D9" };
}
overview.getRange(`B10:F10`).format.fill = amber;
overview.getRange("A:A").format.columnWidth = 23;
overview.getRange("B:F").format.columnWidth = 18;
overview.getRange(`A4:F${3 + overviewRows.length}`).format.autofitRows();
overview.freezePanes.freezeRows(2);

const headers = [labels.responsibility, labels.info, labels.decision, labels.direction, labels.policy,
  labels.control, labels.participation, labels.authorityNotes, labels.quality, labels.reporting,
  labels.approval, labels.obligationNotes];
matrix.getRange("A1:L1").merge();
matrix.getRange("A1").values = [[labels.matrix]];
matrix.getRange("A1:L1").format = { fill: teal, font: { bold: true, color: "#FFFFFF", size: 14 }, rowHeight: 28 };
matrix.getRange("A3:L3").values = [headers];
matrix.getRange("A3:L3").format = { fill: blue, font: { bold: true, color: "#FFFFFF" }, wrapText: true, rowHeight: 35, verticalAlignment: "center" };

const authorityKeys = ["information", "decision", "functional_direction", "policy", "control", "participation"];
const obligationKeys = ["quality_control", "reporting", "approval"];
const rows = data.responsibilities.map((item) => [
  item.responsibility || "",
  ...authorityKeys.map((key) => item.authorities?.[key] ? labels.yes : ""),
  item.authority_notes || "",
  ...obligationKeys.map((key) => item.obligations?.[key] ? labels.yes : ""),
  item.obligation_notes || ""
]);
matrix.getRange(`A4:L${3 + rows.length}`).values = rows;
matrix.getRange(`A4:L${3 + rows.length}`).format = { wrapText: true, verticalAlignment: "top" };
matrix.getRange(`B4:G${3 + rows.length}`).format.horizontalAlignment = "center";
matrix.getRange(`I4:K${3 + rows.length}`).format.horizontalAlignment = "center";
for (let row = 4; row <= 3 + rows.length; row++) {
  if (row % 2 === 1) matrix.getRange(`A${row}:L${row}`).format.fill = pale;
}
matrix.getRange(`A3:L${3 + rows.length}`).format.borders = { preset: "all", style: "thin", color: "#C7D1D9" };
matrix.getRange("A:A").format.columnWidth = 38;
matrix.getRange("B:G").format.columnWidth = 12;
matrix.getRange("H:H").format.columnWidth = 30;
matrix.getRange("I:K").format.columnWidth = 12;
matrix.getRange("L:L").format.columnWidth = 30;
matrix.getRange(`A4:L${3 + rows.length}`).format.autofitRows();
matrix.getRange(`A4:L${3 + rows.length}`).format.rowHeight = 48;
matrix.freezePanes.freezeRows(3);

const definitionRows = lang === "de" ? [
  ["Informationsbefugnis", "Informationen zur Tätigkeit anfragen und erhalten."],
  ["Entscheidungsbefugnis", "Im definierten Rahmen entscheiden und genehmigen."],
  ["Fachliche Weisungsbefugnis", "Genannten Rollen fachliche oder prozessuale Anordnungen erteilen."],
  ["Richtlinienbefugnis", "Regeln und Standards im Geltungsbereich erstellen und ändern."],
  ["Kontrollbefugnis", "Qualität oder Regelkonformität prüfen und bewerten."],
  ["Mitwirkungsbefugnis", "Eine andere entscheidende Rolle beraten und unterstützen."],
  ["Kontrollpflicht", "Definierte Qualität oder Regelkonformität sicherstellen."],
  ["Berichtspflicht", "Status oder Bericht an einen definierten Empfänger liefern."],
  ["Freigabepflicht", "Vor dem Handeln die Freigabe einer anderen Rolle einholen."]
] : [
  ["Information authority", "Request and receive information relevant to the responsibility."],
  ["Decision authority", "Make decisions and grant approvals within the stated boundary."],
  ["Functional-direction authority", "Direct named roles on professional or process matters."],
  ["Policy authority", "Create, maintain, or change rules and standards in scope."],
  ["Control authority", "Inspect and evaluate quality or compliance."],
  ["Participation authority", "Advise and contribute to another role's decision."],
  ["Quality-control obligation", "Ensure the defined quality or compliance level."],
  ["Reporting obligation", "Provide status or a defined report to a named recipient."],
  ["Approval obligation", "Obtain another role's approval before acting."]
];
definitions.getRange("A1:B1").merge();
definitions.getRange("A1").values = [[labels.definitions]];
definitions.getRange("A1:B1").format = { fill: teal, font: { bold: true, color: "#FFFFFF", size: 14 }, rowHeight: 28 };
definitions.getRange(`A3:B${3 + definitionRows.length}`).values = [["Term", "Meaning"], ...definitionRows];
definitions.getRange("A3:B3").format = { fill: blue, font: { bold: true, color: "#FFFFFF" } };
definitions.getRange(`A3:B${3 + definitionRows.length}`).format.borders = { preset: "all", style: "thin", color: "#C7D1D9" };
definitions.getRange(`A4:B${3 + definitionRows.length}`).format.wrapText = true;
definitions.getRange("A:A").format.columnWidth = 30;
definitions.getRange("B:B").format.columnWidth = 75;
definitions.getRange(`A3:B${3 + definitionRows.length}`).format.autofitRows();
definitions.freezePanes.freezeRows(3);

await fs.mkdir(path.dirname(outputPath), { recursive: true });
const output = await SpreadsheetFile.exportXlsx(workbook);
await output.save(outputPath);

const previewDir = process.env.ROLE_PROFILE_PREVIEW_DIR;
if (previewDir) {
  await fs.mkdir(previewDir, { recursive: true });
  for (const sheetName of ["Role Overview", "Responsibility Matrix", "Definitions"]) {
    const rendered = await workbook.render({ sheetName, autoCrop: "all", scale: 1, format: "png" });
    const safe = sheetName.toLowerCase().replaceAll(" ", "-");
    await fs.writeFile(path.join(previewDir, `${safe}.png`), new Uint8Array(await rendered.arrayBuffer()));
  }
}

const inspection = await workbook.inspect({ kind: "table", range: "'Responsibility Matrix'!A1:L20", include: "values,formulas", tableMaxRows: 20, tableMaxCols: 12 });
console.log(inspection.ndjson);
