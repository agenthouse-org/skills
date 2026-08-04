---
name: "create-role-profile"
description: "Interview a user to define an organizational role, clarify its purpose, domains, responsibilities, authority, obligations, boundaries, requirements, holder, and approval, then create a professional role profile as DOCX or Excel. Use when designing roles, clarifying accountability, separating roles from job positions, preparing organizational changes, improving handoffs, hiring, onboarding, governance, or documenting decision rights."
version: 0.1.0
author: "Neri GmbH"
license: MIT
price: 0
tags:
  - organization-design
  - role-design
  - governance
  - accountability
  - leadership
  - hr
  - docx
  - excel
  - free
ai_disclosure: "AI MODIFIED"
---

# Create Role Profile

## Purpose

Help a user design a role before documenting it. A role is a coherent set of responsibilities, domains, authorities, and obligations. Do not confuse it with a job position: one person may hold several roles, and one role may be held by several people.

Use the role model derived from Valerio Neri's *Die Alpha Pyramide* and the accompanying NERI role-description templates. Produce either a DOCX or Excel workbook in the user's preferred language.

## Required Resources

Read:

- `references/role-model.md` for definitions and design rules;
- `references/discovery-questions.md` before interviewing the user;
- `references/input-schema.md` before generating a file.

Consult `examples/team-lead-role.json` when a worked input helps. Do not copy its business facts into another role.

## Workflow

### 1. Retrieve context

Inspect available organization charts, process descriptions, policies, existing job descriptions, role profiles, and conversation context before asking questions. Do not ask for information already available from a reliable source.

### 2. Establish output and scope

Confirm or infer:

- DOCX or Excel output;
- output language;
- new role or revision;
- organization or team in scope;
- whether the role has one holder, several holders, or is currently unassigned.

If format is not specified, recommend DOCX for approval, communication, and signing; recommend Excel for comparison, collaborative maintenance, responsibility matrices, or many roles. Ask only if the choice materially affects the result.

### 3. Conduct adaptive discovery

Ask the smallest useful question set from `references/discovery-questions.md`. Start with purpose and outcomes, then work outward to domains, responsibilities, authorities, obligations, and boundaries.

Prefer one focused question at a time when the user is developing the role conversationally. Batch closely related questions only when the user has supplied substantial source material or asks for a questionnaire.

Use examples to explain unfamiliar authority types. Do not lead the user toward granting authority merely to fill the matrix.

### 4. Draft the role model

Create:

1. role name;
2. purpose and intended outcomes;
3. domains;
4. requirements;
5. responsibility statements;
6. authority assigned to each responsibility;
7. obligations assigned to each responsibility;
8. notes, interfaces, thresholds, and named counterpart roles;
9. exclusions and boundaries;
10. holder and approval metadata when applicable.

Write responsibilities as outcomes or accountable activities, not vague topics. Use verbs. Keep each row independently understandable.

### 5. Run consistency checks

Before generating the file, check:

- every responsibility supports the purpose;
- domains describe controlled scopes, not task lists;
- decision authority names its boundary or threshold where needed;
- functional direction identifies the affected role or group;
- reporting obligations identify recipient, cadence, or trigger where material;
- approval obligations identify the approving role;
- control authority and quality-control obligation are not confused;
- no exclusion contradicts a granted authority;
- overlaps and gaps with neighboring roles are exposed;
- employment-law or disciplinary authority is not inferred from a team-lead title.

If a material conflict remains, show it and ask one decision-relevant question. Do not silently resolve governance conflicts.

### 6. Confirm the content

Present a concise preview containing purpose, domains, boundaries, and the responsibility matrix. Mark assumptions and unresolved items. Obtain confirmation before finalizing when the role grants consequential financial, personnel, compliance, safety, or policy authority.

### 7. Generate the requested artifact

Create a JSON input that follows `references/input-schema.md`.

For DOCX:

```text
python scripts/create_role_docx.py role.json output.docx
```

For Excel:

```text
node scripts/create_role_xlsx.mjs role.json output.xlsx
```

Use the workspace-provided Python, Node.js, and `@oai/artifact-tool` runtimes. Follow the active document or spreadsheet skill's render-and-verify requirements. Do not claim completion until the file is structurally valid and visually reviewed.

### 8. Deliver with governance notes

State:

- the created format;
- assumptions that remain;
- overlaps, gaps, or risky authority combinations;
- the recommended approver or validation participants;
- a suggested review date when the organization is changing quickly.

## Output Quality

Use plain, neutral language. Keep the profile usable across people and avoid embedding the current holder's habits as permanent role requirements. Distinguish mandatory capabilities from desirable traits. Avoid discriminatory or personality-coded requirements.

Do not fabricate policies, reporting lines, authority, salary, seniority, qualifications, or approval. Do not present the profile as legal or employment advice.

## Quick Start

```text
Use $create-role-profile to help me define this role. Ask one essential question at a time, identify gaps or conflicting authority, show me the completed role model, and then create the approved version as a DOCX.
```

---

EU AI Act disclosure: **AI MODIFIED**
