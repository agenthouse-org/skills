---
name: "create-role-profile"
description: "Interview a user to define an organizational role, clarify its purpose, domains, responsibilities, authority, obligations, boundaries, requirements, holder, and approval, then create a professional role profile as DOCX or Excel. Use when designing roles, clarifying accountability, separating roles from job positions, preparing organizational changes, improving handoffs, hiring, onboarding, governance, or documenting decision rights."
version: 0.1.1
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

Design a role before documenting it: a coherent set of responsibilities, domains, authorities, and obligations — not a job position. Model derived from Valerio Neri's *Die Alpha Pyramide* and NERI role-description templates. Produce DOCX or Excel in the user's preferred language.

## Contents

- [Setup](#setup)
- [Workflow](#workflow)
- [Review](#review)
- [Operating procedure](references/operating-procedure.md) — discovery through delivery
- [Role model](references/role-model.md)
- [Discovery questions](references/discovery-questions.md)
- [Input schema](references/input-schema.md)

## Setup

**DOCX** (Python + `python-docx`):

```bash
pip install python-docx
python scripts/create_role_docx.py role.json output.docx
```

**Excel** (Node.js + `@oai/artifact-tool`, typically an OpenAI artifact runtime):

```bash
node scripts/create_role_xlsx.mjs role.json output.xlsx
```

Build `role.json` from [references/input-schema.md](references/input-schema.md). See [examples/team-lead-role.json](examples/team-lead-role.json) for shape only — do not copy its business facts.

## Workflow

```
- [ ] Retrieve org context before asking
- [ ] Confirm format, language, and scope
- [ ] Adaptive discovery (purpose → domains → matrix)
- [ ] Draft the role model
- [ ] Consistency checks (authority vs obligations vs boundaries)
- [ ] Preview and confirm material authority
- [ ] Generate DOCX or Excel from validated JSON
- [ ] Deliver with governance notes
```

Execute detail from [references/operating-procedure.md](references/operating-procedure.md). Read role-model and discovery-questions before interviewing.

## Review

- [ ] Responsibilities are outcome verbs supporting the purpose
- [ ] No invented policy, salary, or disciplinary authority
- [ ] Conflicts and overlaps exposed, not silently resolved
- [ ] File opens and matches the confirmed preview

## Quick start

```text
Use $create-role-profile to help me define this role. Ask one essential question at a time, identify gaps or conflicting authority, show me the completed role model, and then create the approved version as a DOCX.
```

---

EU AI Act disclosure: **AI MODIFIED**
