---
path: /x402gateway/docs/
type: doc
title: x402 Gateway documentation — sell any API to AI agents
description: Register an upstream API, set sat prices per route, and get a hosted x402 endpoint with auth injection, replay protection, and analytics. Free tier, Pro at $9/mo.
lede: No Worker to deploy. Register an upstream, set a price, and agents can pay per call.
keywords: x402 gateway docs, monetize API AI agents, paid API endpoint, x402 hosting
updated: 2026-09-11
priority: 0.8
changefreq: weekly
---

x402 Gateway wraps an existing HTTP API and exposes it as a pay-per-call x402 endpoint. Buyers pay in BSV sats; the gateway verifies the payment, broadcasts it, then proxies the call upstream with your credentials injected. Paid services are listed in [x402market](/x402market/) so agents can discover them.

```
buyer ──GET /g/<slug>/<tool>────────────► gateway
       ◄─402 + PAYMENT-REQUIRED─────────── (price, your payTo, bsv:mainnet)
       ──retry + PAYMENT-SIGNATURE───────► verify → broadcast → upstream fetch
       ◄─200 + upstream body + receipt──── (PAYMENT-RESPONSE: txid)
```

## Register a service

From the UI at [entangleit.com/x402gateway](/x402gateway/), or via API:

```bash
curl -s -X POST https://entangleit.com/x402gateway/api/services \
  -H 'content-type: application/json' -d '{
  "name": "Weather Oracle",
  "tagline": "Pay-per-call forecasts",
  "baseUrl": "https://api.weather.example",
  "payTo": "1YourBsvAddress…",
  "ownerContact": "you@example.com",
  "authHeader": "Authorization",
  "authValue": "Bearer sk-…",
  "routes": [
    { "name": "forecast", "method": "GET",  "path": "/v1/forecast", "priceSats": 20, "description": "7-day forecast" },
    { "name": "health",   "method": "GET",  "path": "/healthz",     "priceSats": 0,  "description": "Free probe" }
  ]
}'
```

The response contains your gateway base (`/g/<slug>`), an **admin key** (shown once), and the registry listing id. Paid routes are live immediately.

## Call a paid route

```bash
# 1. unsigned -> 402 + PAYMENT-REQUIRED
curl -si https://entangleit.com/x402gateway/g/weather-oracle/forecast?city=YYZ

# 2. retry with an x402 payment proof
curl -s https://entangleit.com/x402gateway/g/weather-oracle/forecast?city=YYZ \
  -H "PAYMENT-SIGNATURE: <base64 payload>"
# -> upstream JSON + PAYMENT-RESPONSE (txid)
```

GET query strings and POST JSON bodies (64KB cap) pass through. Route paths support `{param}` placeholders filled from caller query parameters (`/{title}?title=Bitcoin`); consumed parameters are stripped before forwarding. Upstream responses cap at 512KB (`X-Gateway-Truncated: 1`) and time out after 20s.

## Management API

| Route | Auth | Purpose |
| --- | --- | --- |
| `GET /` | — | Registration UI + directory |
| `GET /api/services[?q=]` | — | Active services with routes and totals |
| `GET /api/services/:slug` | — | Detail (never returns credentials) |
| `POST /api/services` | — | Register (5/day per IP) |
| `POST /api/services/:slug/admin` | `X-Admin-Key` | `update`, `pause`, `resume`, `relist`, `rotate`, `usage`, `delete` |
| `GET /g/:slug/manifest` | — | Registry manifest |
| `GET/POST /g/:slug/:tool` | x402 | Paid proxy endpoint |
| `POST /api/services/:slug/watches` | `X-Admin-Key` | Add a monitored endpoint (`url` or own `route`) |
| `GET /api/services/:slug/watches` | `X-Admin-Key` | Watches with status + quota |
| `PATCH /api/services/:slug/watches/:id` | `X-Admin-Key` | Label, webhook, expectation, pause |
| `DELETE /api/services/:slug/watches/:id` | `X-Admin-Key` | Remove a watch |
| `POST /api/services/:slug/watches/:id/check` | `X-Admin-Key` | Run a check now |
| `GET /watch/:id` | — | Public status page (unguessable id) |

Rotate the admin key with `{"action":"rotate"}` — the old key stops working immediately. Paused services 404 for both proxy and directory.

## Hosting tiers

Every service starts on **Free**. **Pro ($9/mo, or $86.40/yr)** is a Stripe subscription — pass `{"interval":"year"}` to the checkout action for annual.

| | Free | Pro ($9/mo · $86.40/yr) |
| --- | --- | --- |
| Routes per service | 5 | 100 |
| Aggregate calls/sats | yes | yes |
| Per-call analytics log | — | yes |
| CSV export | — | yes |
| Uptime monitoring | 1 endpoint, daily, no alerts | 10 endpoints, 15-min checks, email + webhook alerts |
| Listed in x402market | yes | yes |

Upgrade from the admin API:

```bash
curl -s -X POST .../api/services/<slug>/admin \
  -H 'X-Admin-Key: …' -H 'content-type: application/json' \
  -d '{"action":"checkout","interval":"year"}'   # -> { url } for the owner to pay
```

`{"action":"portal"}` opens billing management; `{"action":"usage"}` returns recent calls (Pro). Exceeding Free limits returns `402 { code: "plan_limit", upgrade }`.

## Uptime monitoring (Watch)

Every paid route is watched automatically from registration: the gateway probes it like a buyer every 15 minutes (Pro) or daily (Free) and validates the 402 challenge. When an endpoint stops challenging, breaks, or its price/payTo moves against the observed baseline, the owner gets an email and/or webhook (`watch.down`, `watch.recovered`, `watch.terms_changed`) — but only on Pro; Free shows status in the dashboard without alerts.

```bash
# watch your own route by name, or any https URL
curl -s -X POST .../api/services/<slug>/watches \
  -H 'X-Admin-Key: …' -H 'content-type: application/json' \
  -d '{"route":"forecast","label":"prod forecast","webhookUrl":"https://example.com/hook"}'
```

Each watch has a public status page with uptime and recent checks. A missed tick never loses state — the next run picks up where the last left off — and history is pruned to 7 days (Free) or 90 days (Pro).

## Security model

- **SSRF guard**: only https upstreams, private/loopback ranges blocked, redirects not followed into private space.
- **Replay protection**: every txid is claimed once; replays settle to a 409, not a second call.
- **Credential isolation**: `authHeader`/`authValue` are injected server-side and never returned by any API.
- **Payment verification**: the gateway checks the x402 envelope, amount, recipient, and broadcast status before proxying.

## Why list here instead of building your own?

You keep your auth, your hosting, and your data. The gateway only adds the payment layer and the listing. If you'd rather own the endpoint entirely, the [Seller Kit](https://github.com/auxon) pattern produces the same x402 behavior as a Worker you deploy — the [Agent-ready API](/factory/agent-ready-api/) service is exactly that, done for you in 48 hours.

## FAQ

### Do I need a BSV wallet?

You need an address to receive sats (`payTo`) and an admin key to manage the service. Any P2PKH address works; there is no signup beyond registration.

### What do buyers see?

A standard x402 challenge: price in sats, network `bsv:mainnet`, and your `payTo`. Agentpay wallets settle it automatically with `pay_service`.

### What happens if my upstream is down?

The caller gets a 502 with the upstream status; the payment isn't settled unless the upstream call succeeds after verification. Errors are visible in the analytics log (Pro).

### Can I price in USD?

Pricing is defined in sats per route. Agentpay converts from the buyer's USD balance at the configured rate.

### How is Watch different from uptime monitoring I already have?

Generic monitors check that a URL returns 200. Watch checks what a *buyer* sees: a valid 402 challenge with the right price and payTo. An endpoint can be "up" while silently not charging — Watch catches exactly that.

### Do alerts work without email?

Yes. Set `webhookUrl` on the watch and events arrive as JSON POSTs (`watch.down`, `watch.recovered`, `watch.terms_changed`). Email needs the operator's mailer configured; webhooks always work.

### Can I monitor endpoints that aren't on the gateway?

Yes, on Pro: any public `https://` URL, up to 10 watched endpoints per service. The probe only ever sends unsigned GETs and never follows redirects, so pointing it at third-party APIs is safe.
