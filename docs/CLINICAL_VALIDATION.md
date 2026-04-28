# Clinical validation plan

This document is a practical validation checklist for turning the scaffold into a clinically usable IOL planning tool.

## 1. Formula governance

For every formula module, document:

- Formula name and version.
- Author/source/permission status.
- Input fields required.
- Constants used and their source.
- Supported eye ranges.
- Known exclusions.
- Date of validation.
- Benchmark dataset pass/fail result.

## 2. Minimum benchmark matrix

Create at least these categories:

1. Average eye: AL 22.5–24.5 mm, regular K.
2. Short eye: AL < 22 mm.
3. Very short eye: AL < 20.5 mm.
4. Long eye: AL > 26 mm.
5. Very long eye: AL > 30 mm.
6. Flat cornea: mean K < 40 D.
7. Steep cornea: mean K > 47 D.
8. High regular astigmatism: corneal cylinder > 2.5 D.
9. Post-myopic LASIK/PRK.
10. Post-hyperopic LASIK/PRK.
11. Post-RK.
12. Toric case with measured posterior cornea.
13. Toric case with nomogram posterior cornea.
14. Dense cataract / low SNR biometry duplicate.
15. Pediatric or non-standard anatomy case if your service covers it.

## 3. Acceptance criteria

Recommended for each formula/module:

- The app reproduces the authorized reference calculator within the smallest clinically relevant rounding step, usually 0.01–0.05 D internally and 0.5 D for marketed lens power display.
- Every formula returns the same exclusion/unsupported cases as the authorized source.
- No result is shown when required input is missing.
- Every output includes formula version, constant source, and calculation timestamp.
- Toric results must include residual cylinder, axis, SIA, incision axis, posterior cornea assumption, and rotation sensitivity.

## 4. Outcome registry

For surgeon personalization, collect:

- Patient/case pseudonymous ID.
- Eye.
- Biometer and keratometer/tomographer.
- IOL model and serial/batch if available.
- Formula and constant.
- Target refraction.
- Implanted IOL power and toric axis.
- Stable postoperative manifest refraction, ideally 4–12 weeks.
- Complications or exclusion reasons.

Use the registry to optimize constants per surgeon, device, and IOL model.
