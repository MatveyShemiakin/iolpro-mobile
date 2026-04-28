# IOLPro Formula Gateway

Backend scaffold for authorized formula integrations. Do not put proprietary formula logic into the public repository unless you have explicit rights to publish it.

## Run

```bash
cd server/formula-gateway
npm install
npm run dev
```

Health check:

```bash
curl http://localhost:8787/health
```

Formula connector placeholder:

```bash
curl -X POST http://localhost:8787/api/formulas/barrett-universal-ii \
  -H 'content-type: application/json' \
  -d '{"axialLength":23.55,"k1":43.25,"k2":44.1}'
```
