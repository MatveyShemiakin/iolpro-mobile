# Formula connector strategy

Modern formulas should be implemented through one of these routes:

1. **Official API** from formula author/vendor.
2. **Written permission** to implement formula locally.
3. **Authorized web connector** if terms permit it and uptime/error handling are acceptable.
4. **Manual reference import** for validation only, not production.

## Connector contract

Each connector should accept normalized JSON:

```json
{
  "eye": "OD",
  "axialLength": 23.55,
  "k1": 43.25,
  "k1Axis": 10,
  "k2": 44.1,
  "k2Axis": 100,
  "acd": 3.1,
  "lt": 4.4,
  "wtw": 11.8,
  "cct": 540,
  "targetRefraction": -0.25,
  "iolModel": "MODEL_ID",
  "constant": 119.2
}
```

Each connector should return:

```json
{
  "formulaId": "barrett-universal-ii",
  "formulaVersion": "vendor-version-or-date",
  "recommendedIolPower": 20.5,
  "predictedRefraction": -0.18,
  "supported": true,
  "messages": [],
  "raw": {}
}
```

## Error handling

- Never silently fall back from a modern formula to a legacy formula.
- If a formula is unavailable, show `connector required` or `temporarily unavailable`.
- If the eye is outside the formula range, show `unsupported` and no recommended power.
