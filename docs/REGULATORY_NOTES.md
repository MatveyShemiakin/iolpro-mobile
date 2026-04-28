# Regulatory notes

This repository is a prototype. A deployed IOL calculator may be treated as clinical decision-support software or a medical device depending on jurisdiction, claims, autonomy, and how results are used.

## Practical implications

- Do not market the app as clinically validated until validation is complete.
- Include visible limitations and formula provenance.
- Keep versioned audit records.
- Avoid hidden formula changes.
- Separate research/demo mode from clinical mode.
- Establish incident handling and feedback reporting.
- If distributed beyond a small internal research team, obtain regulatory/legal review.

## Recommended release levels

1. **Research sandbox:** UI testing, no patient care decisions.
2. **Internal validation:** benchmarked against reference calculators, not used independently.
3. **Supervised clinical pilot:** parallel calculation, surgeon signs off using approved calculators.
4. **Clinical release:** documented validation, governance, version locking, and regulatory position.
