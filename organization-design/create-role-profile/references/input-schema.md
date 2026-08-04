# Generator Input Schema

Create one UTF-8 JSON file with this structure:

```json
{
  "language": "en",
  "role_name": "Customer Operations Lead",
  "purpose": "Ensure reliable customer operations and develop the team.",
  "domains": ["Customer support", "Support quality standard"],
  "requirements": {
    "required": ["Team leadership", "Service operations"],
    "preferred": ["Process improvement"]
  },
  "responsibilities": [
    {
      "responsibility": "Plan team capacity against forecast demand.",
      "authorities": {
        "information": true,
        "decision": true,
        "functional_direction": true,
        "policy": false,
        "control": false,
        "participation": false
      },
      "authority_notes": "May reallocate work within the assigned team.",
      "obligations": {
        "quality_control": true,
        "reporting": true,
        "approval": false
      },
      "obligation_notes": "Report capacity risks weekly to Head of Operations."
    }
  ],
  "interfaces": ["Head of Operations", "People Operations"],
  "exclusions": ["Disciplinary action remains with Head of Operations."],
  "holder": "",
  "approved_by": "",
  "approval_date": "",
  "review_date": "",
  "assumptions": []
}
```

## Rules

- Use `language` value `en` or `de`; generators default to English.
- Use JSON booleans for authority and obligation selections.
- Include an empty list or empty string when a value is intentionally blank.
- Do not encode multiple unrelated responsibilities in one row.
- Put thresholds and counterpart roles in notes.
- Preserve unresolved assumptions in `assumptions` rather than presenting them as facts.
