---
path: /x402market/docs/
type: doc
title: x402market documentation — list and discover paid APIs
description: How the x402 service registry works: publish a manifest, pass live 402 verification, get discovered by agents. Quoting, listing rules, and the registry API.
lede: Manifests in, live 402 challenges out. Discovery that agents can actually transact on.
keywords: x402market docs, list x402 service, paid API registry, agent API discovery
updated: 2026-09-11
priority: 0.8
changefreq: weekly
---

x402market is a registry of pay-per-call services for AI agents. Sellers publish a manifest; the worker verifies it against a **live 402 challenge** and lists it. Buyers (often agentpay wallets) read listings and quotes without a wallet.

## Why a registry matters

An agent can't browse a website, compare pricing pages, or sign up for a trial. It needs machine-readable answers to three questions:

1. What tools exist and what do they do? → **manifest**
2. What does a call cost right now? → **live 402 quote**
3. Where do I pay? → **`payTo` address and network**

Everything in x402market answers those three questions in JSON.

## Publishing a service

You need an x402-compatible endpoint that returns `402` with a `PAYMENT-REQUIRED` header on unpaid calls. The easiest paths:

- **[x402 Gateway](/x402gateway/)** — register an upstream URL and get a hosted `/g/<slug>/<tool>` endpoint. No code.
- **Self-hosted** — use the Seller Kit pattern (see [github.com/auxon](https://github.com/auxon)) to deploy a Worker that challenges and settles directly.

Then submit the manifest URL:

```bash
curl -s -X POST https://entangleit.com/api/x402market/services \
  -H 'content-type: application/json' -d '{
    "manifestUrl": "https://x402-gateway.richard-hein.workers.dev/g/weather-oracle/manifest",
    "name": "Weather Oracle",
    "tagline": "Pay-per-call forecasts",
    "description": "Global forecasts, 20 sats per call.",
    "ownerContact": "you@example.com"
  }'
```

Verification happens synchronously: the worker fetches the manifest, checks the shape (base URL, network, tools), then probes a paid tool and requires a real `402` with decodable requirements. Listings that fail verification are rejected with the reason (`422`).

## Registry API

| Route | Auth | Purpose |
| --- | --- | --- |
| `GET /api/x402market/services` | — | Verified listings. Filters: `q`, `network`, `sort=new\|tools`, `limit` |
| `GET /api/x402market/services/:id` | — | Listing detail (increments views) |
| `POST /api/x402market/services` | — | Publish a manifest (verified before insert) |
| `GET /api/x402market/quote?service=&tool=` | — | **Live** 402 requirements for one tool, proxied from the seller |

Example quote response shape:

```json
{
  "quote": {
    "serviceId": "s_…",
    "tool": "forecast",
    "satoshis": 20,
    "payTo": "1…",
    "network": "bsv:mainnet",
    "resource": "https://…/forecast?city=YYZ"
  }
}
```

No wallet is needed to quote — that's the point. Agents price the call before deciding to spend.

## What agents do with it

An agentpay wallet exposes the registry through MCP:

- `list_services` reads verified listings.
- `service_quote` proxies the live 402 challenge.
- `pay_service` settles and returns the seller's result in one call.

The same tools work directly against this API for agents that don't use agentpay.

## Listing rules

- The manifest URL must be `https://`.
- The paid tool must challenge with a decodable `PAYMENT-REQUIRED` header at verification time.
- Free tools are allowed alongside paid ones and are labeled.
- Listings that stop challenging, or whose seller disappears, can be removed or paused; the directory only shows `verified` entries.
- Credentials are never part of a listing — `payTo` and prices are public by design.

## FAQ

### Does listing cost anything?

No. Listing is free; the gateway that powers hosted listings has a Free tier and a $9/mo Pro tier for volume.

### How is this different from an API directory?

Directories list docs. x402market lists **prices and payment addresses verified against a live challenge**, so the next step is a paid call, not a signup.

### Can I update a listing?

Update the gateway service and relist it, or resubmit the manifest — verification runs again on every submission.

### How do I get featured?

Featured placement is curated. The strongest signal is a fast, reliable endpoint with clear tool descriptions and honest pricing.
