# Benchmarks

`benchmark-eyes.json` contains starter synthetic/representative cases. It intentionally does not contain expected modern-formula results. Fill the `expected` field only after comparing with authorized reference calculators or licensed connectors.

Suggested expected result format:

```json
"expected": {
  "barrett-universal-ii": {
    "recommendedIolPower": 20.5,
    "predictedRefraction": -0.12,
    "source": "official calculator, accessed YYYY-MM-DD",
    "formulaVersion": "if available"
  }
}
```
