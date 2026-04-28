# IOLPro Mobile

Mobile-first PWA scaffold for ophthalmic surgeons planning intraocular lens implantation.

**Status:** professional prototype / research scaffold. It is **not** a certified medical device and must not be used as the sole basis for clinical IOL selection until every formula module, constant source, device import path, and output has been validated under your local clinical governance process.

## What is included

- Vite + React + TypeScript mobile-first PWA.
- GitHub Pages deployment workflow.
- Biometry form: AL, K1/K2, axes, ACD, LT, WTW, CCT, target refraction, SIA, incision axis.
- Modes: standard, toric, post-refractive.
- Input quality warnings for short/long eyes, axis mismatch, out-of-range values.
- Formula-provider architecture.
- Local legacy SRK-II reference module for UI/pipeline testing only.
- Licensed-connector placeholders for Barrett Universal II, Barrett Toric, Kane, EVO, PEARL-DGS, Hill-RBF, Cooke K6, Hoffer QST.
- Toric candidate workflow using double-angle vector approximation for UI demonstration.
- JSON/audit export.
- Backend gateway scaffold for future authorized formula connectors.
- Benchmark eye set schema.

## Why modern formulas are connector modules

Several modern IOL formulas are proprietary, licensed, web-hosted, or distributed through their authors' official calculators. This repository therefore does **not** include reverse-engineered implementations of Barrett, Kane, PEARL-DGS, Hill-RBF, EVO, Cooke K6, or Hoffer QST. The app is prepared to connect to authorized backend modules/API integrations once you have the required permissions.

## Local run

```bash
npm install
npm run dev
```

Open the local URL shown by Vite. On a mobile device in the same Wi-Fi network, open the LAN URL.

## Production build

```bash
npm run build
npm run preview
```

## Deploy to GitHub Pages

1. Create an empty GitHub repository, for example `iolpro-mobile`.
2. Upload all files from this folder.
3. In the repository, go to **Settings → Pages**.
4. Under **Build and deployment**, choose **GitHub Actions** as the source.
5. Push to the `main` branch.
6. Open the **Actions** tab and wait for `Deploy PWA to GitHub Pages` to finish.
7. Your app URL will be shown in the deploy job and usually has this format:
   `https://YOUR_USERNAME.github.io/iolpro-mobile/`

## Add to iPhone / Android home screen

### iPhone / iPad

1. Open the GitHub Pages URL in Safari.
2. Tap **Share**.
3. Tap **Add to Home Screen**.
4. Confirm the app name.

### Android

1. Open the GitHub Pages URL in Chrome.
2. Tap the menu `⋮`.
3. Tap **Add to Home screen** or **Install app**.

## Clinical validation checklist

Before clinical use:

- Replace demo lens constants with model-specific optimized constants.
- Add real formula modules only through license/API/permission.
- Build a benchmark set from known reference calculators.
- Validate against at least normal, short, long, steep/flat K, high astigmatism, post-refractive, and toric cases.
- Lock formula versions and constant sources.
- Keep an audit trail for each calculation.
- Decide whether the app is a regulated medical device in your jurisdiction.

## Suggested repository structure

```text
src/core/              calculation types, validation, formulas, toric vectors
src/data/              demo lens catalog
src/App.tsx            mobile-first UI
benchmarks/            benchmark eye schema and starter cases
server/formula-gateway authorized formula connector scaffold
docs/                  validation and regulatory notes
.github/workflows/     GitHub Pages deployment
```

## License

Use internally until you decide on licensing, clinical governance, and formula permissions.
