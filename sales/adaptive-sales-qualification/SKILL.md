---
name: "adaptive-sales-qualification"
description: "Assess, verify, score, and prioritize leads, accounts, and sales opportunities using an adaptive, evidence-based qualification process. Designed primarily for B2B sales and adaptable to high-consideration B2C, custom industries, geographies, products, sales cycles, and costs of sale."
version: 0.1.1
author: "Neri GmbH"
license: MIT
price: 0
tags:
  - sales
  - lead-qualification
  - opportunity-management
  - account-qualification
  - b2b
  - b2c
  - tender
  - buying-center
  - free
ai_disclosure: "AI MODIFIED"
---

# Adaptive Sales Qualification

## Why This Skill Exists

Sales agents often confuse interest with qualification, activity with progress, and missing information with positive evidence. This skill helps an AI sales agent assess a lead, account, and opportunity separately and together.

It produces four decisions:

1. qualification status;
2. pursuit priority;
3. probability to close;
4. the next best verification action.

The method is original and framework-neutral. It does not reproduce proprietary sales methodologies.

## When to Use This Skill

Use this skill when:

- qualifying a new lead;
- deciding whether an account is worth pursuing;
- verifying whether an opportunity is real and winnable;
- reviewing pipeline quality;
- preparing discovery;
- deciding whether to bid on a tender;
- identifying missing stakeholders, evidence, or commercial information;
- deciding whether to continue, nurture, reduce effort, partner, refer, no-bid, or abandon.

This skill is designed primarily for B2B sales. It may also be used for high-consideration B2C sales where the decision has meaningful cost, complexity, risk, or multiple participants.

## When Not to Use This Skill

Do not use this skill:

- as a substitute for legal, procurement, financial, or compliance advice;
- to manipulate, pressure, deceive, or discriminate against a buyer;
- to infer sensitive personal traits;
- to fabricate buying signals, stakeholder support, budget, urgency, or probability;
- to justify pursuing an opportunity that violates company policy;
- for low-value transactional purchases where qualification would cost more than it saves.

## Required Files

Read these files when available:

- `config/company-policy.md`
- `references/qualification-model.md`
- `references/adaptation-rules.md`
- `references/probability-model.md`
- `references/buying-center.md`
- `references/tender-assessment.md` when a tender or formal procurement is involved
- `references/competitive-assessment.md` when competitors are known or likely
- `templates/assessment-output.md`

## Agent Operating Procedure

## Prerequisite: Localization and language
This skill is written in English. Before starting, infer the language needed by the end user, and if not clear, ask the user to confirm the preferred language. If the user prefers a language other than English, translate all questions and output into that language.

### Phase 1: Retrieve Context Before Asking

You MUST first search all available memory, conversation history, CRM data, notes, emails, documents, and connected company sources for:

- company products and services;
- ideal customer profile and exclusions;
- customer industry and geography;
- language and cultural context;
- sales motion and channel;
- typical deal size and contribution margin;
- sales-cycle duration;
- acquisition and cost-of-sale expectations;
- implementation and delivery complexity;
- buying-center patterns;
- regulatory or procurement requirements;
- historical wins, losses, and probability baselines;
- hard disqualification rules;
- required evidence by sales stage.

Read `config/company-policy.md` if it exists and it is individualized for the company. Otherwise, read `references/qualification-model.md` and `references/adaptation-rules.md` for defaults.

Do not ask the user for information that is already available from a reliable source. Distinguish current facts from outdated memory.

### Phase 2: Identify the Assessment Object

Determine whether the user wants to assess:

- a lead;
- an account;
- an opportunity;
- or all three.

When sufficient information exists, assess all three separately and produce a combined assessment.

Do not treat a strong contact as proof of a strong account or a real opportunity.

### Phase 3: Select the Qualification Depth

Select one mode using `references/adaptation-rules.md`:

- **Lightweight**
- **Standard**
- **Strategic**

Qualification depth MUST increase with expected deal value, cost of sale, cycle duration, implementation complexity, decision irreversibility, delivery risk, regulatory exposure, and competitive intensity.

State the selected mode and why it applies.

### Phase 4: Check Hard Rules First

Apply explicit instructions in this order:

1. current user instruction;
2. approved `config/company-policy.md`;
3. reliable company memory or source data;
4. industry and sales-motion defaults;
5. generic defaults in this skill.

A hard disqualification rule overrides scores and probability.

If sources conflict, expose the conflict. Do not resolve it silently.

### Phase 5: Assess the Evidence

Use `references/qualification-model.md`.

For every material statement, label the evidence as:

- **Verified** — supported by a reliable source or direct observation;
- **Buyer-reported** — stated by the prospect but not independently verified;
- **Seller-reported** — stated by the salesperson or internal team;
- **Inferred** — plausible conclusion from available facts;
- **Unknown** — no reliable information;
- **Contradictory** — material sources disagree.

Unknown information is not automatically negative. However, a critical unknown may block qualification or reduce confidence.

### Phase 6: Ask Only Decision-Relevant Questions

Ask only questions that could materially change:

- qualification status;
- pursuit priority;
- probability to close;
- a hard disqualification decision;
- the next sales action;
- or the amount of sales effort justified.

Prefer the smallest number of high-value questions.

For lightweight sales, tolerate more uncertainty. For strategic sales, require stronger evidence.

### Phase 7: Assess Lead, Account, and Opportunity

Score and explain each object independently:

- **Lead assessment**
- **Account assessment**
- **Opportunity assessment**
- **Combined assessment**

Use configurable weights from `config/company-policy.md`. When no company weights exist, apply the stage-sensitive defaults in `references/qualification-model.md`.

Do not average away a critical weakness. Highlight gating factors separately.

### Phase 8: Estimate Probability to Close

Use `references/probability-model.md`.

Always separate:

- qualification score;
- evidence confidence;
- probability to close;
- pursuit priority.

Use a probability range when uncertainty is meaningful. Never present false precision.

### Phase 9: Evaluate Seller Economics

Estimate whether the opportunity deserves further investment.

Consider:

- expected contribution margin;
- remaining cost of sale;
- probability to close;
- delivery risk;
- strategic value;
- opportunity cost;
- availability of better opportunities;
- reputational or compliance risk.

The agent MAY recommend reducing effort, nurturing, partnering, referring, no-bidding, or abandoning the opportunity.

### Phase 10: Handle Tenders and Competition

When a tender, RFP, formal procurement, or competitor is involved:

- apply `references/tender-assessment.md`;
- apply `references/competitive-assessment.md`;
- distinguish lawful prior discovery or market consultation from improper influence;
- assess whether the seller is an informed contender or merely an additional participant;
- evaluate bid effort against realistic win probability.

Never recommend improper access, hidden coordination, specification manipulation, or circumvention of procurement rules.

### Phase 11: Produce the Assessment

Use `templates/assessment-output.md`.

The output MUST contain:

- decision and rationale;
- lead, account, opportunity, and combined assessments;
- qualification score;
- probability range;
- evidence confidence;
- priority;
- hard disqualifiers;
- positive signals;
- risks and contradictions;
- missing evidence;
- buying-center view;
- commercial and opportunity-cost view;
- next action;
- verification questions;
- exit or no-bid conditions.

### Phase 12: Offer Persistent Configuration

When the user provides a reusable company rule or stable fact:

1. use it in the current assessment;
2. identify the reusable rule;
3. offer to add or update it in `config/company-policy.md`;
4. show or summarize the proposed change;
5. modify the file only after explicit approval;
6. preserve existing rules unless the user explicitly replaces them;
7. update the file's change log.

You MUST NOT silently modify this skill or its configuration.

The core `SKILL.md` should remain stable unless the user explicitly requests a methodological change.

## Decision Labels

Use one primary status:

- **Qualified**
- **Conditionally qualified**
- **Nurture**
- **Disqualified**
- **No-bid**
- **Insufficient evidence**

Use one pursuit priority:

- **High**
- **Medium**
- **Low**
- **Do not pursue**

## Guardrails

You MUST:

- score evidence, not optimism;
- distinguish facts from assumptions;
- identify contradictions;
- avoid repeated questions;
- explain material score changes;
- respect company policy and applicable procurement boundaries;
- minimize unnecessary data collection;
- avoid sensitive personal attributes in B2C assessment;
- disclose uncertainty.

You MUST NOT:

- invent a budget, decision maker, compelling event, competitor, or buyer commitment;
- treat email opens, meeting attendance, or politeness as proof of intent;
- equate a senior job title with buying authority;
- assume that a published tender is winnable merely because the seller meets the specification;
- recommend pursuing a low-value opportunity when the expected sales effort is uneconomic;
- overwrite company configuration without approval.

## Quick Start Prompt

```text
Assess this lead, account, and opportunity using the Adaptive Sales Qualification skill.

First retrieve relevant product, industry, geography, sales-cycle, buying-center, and company-policy context from available memory and sources. Ask only for information that could materially change the decision.

Provide qualification status, priority, probability to close, evidence confidence, key risks, missing evidence, opportunity-cost assessment, and the next best action.
```

## Compatibility

This skill follows the open `SKILL.md` pattern and is designed for compatible AI agents that can read Markdown files and optionally access company memory, CRM data, connected sources, and writable configuration files.

## Permissions

**Permission Profile**: Sales Analysis and Optional Configuration Update

**Tools Used**

- **Read Files**: Yes
- **Write Files**: Optional — only for approved updates to `config/company-policy.md`
- **Memory / Knowledge Retrieval**: Recommended
- **CRM / Connected Sources**: Optional
- **Browser / Network**: Optional and only when permitted or requested
- **Terminal / Shell**: Not required

**Suggested File Scopes**

- `**/*.md`
- company knowledge and approved sales documentation
- CRM records made available to the agent

---

EU AI Act disclosure: **AI MODIFIED**
