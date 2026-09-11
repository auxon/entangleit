---
path: /guide/x402-payments/
type: guide
title: How x402 payments work — HTTP 402, pay-per-call APIs, and sats
description: The x402 protocol turns "Payment Required" into a working handshake: challenge, payment proof, settlement, receipt. Here's the full flow with BSV settlement.
lede: One status code, two headers, no accounts. The protocol agents already know how to use.
keywords: x402 protocol, HTTP 402 payments, pay-per-call API, BSV micropayments, x402 explained
updated: 2026-09-11
priority: 0.8
changefreq: monthly
---

HTTP reserved `402 Payment Required` decades ago and never used it. x402 makes it real: a standard challenge/response handshake that lets any HTTP client pay for a call without signup, invoicing, or a human.

## The handshake

```
buyer                                    seller
  │  GET /resource                          │
  │ ───────────────────────────────────────►│
  │  402 Payment Required                   │
  │  PAYMENT-REQUIRED: <base64 challenge>   │
  │ ◄───────────────────────────────────────│
  │                                         │
  │  GET /resource                          │
  │  PAYMENT-SIGNATURE: <base64 payment>    │
  │ ───────────────────────────────────────►│  verify → broadcast
  │  200 OK + body                          │
  │  PAYMENT-RESPONSE: <txid>               │
  │ ◄───────────────────────────────────────│
```

The challenge describes **what** to pay: scheme (`exact`), network (`bsv:mainnet`), amount in satoshis, recipient (`payTo`), and the resource. The payment proof is a signed transaction. Whoever broadcasts first wins; idempotent servers dedupe on txid so a replay can't buy a second call.

## Why agents love it

- **No identity ceremony.** The wallet is the identity. A brand-new agent can transact in its first request.
- **No pricing pages.** The 402 response *is* the price list, quoted live.
- **No invoices.** Settlement is code. There is no net-30 anything.
- **Composability.** Any HTTP client that can retry a request can be a buyer. In this stack that's `pay_service` on one MCP call.

## Why BSV settlement

x402 is network-agnostic; the economics decide. Per-call API prices are sub-cent. You need settlement where:

- fees don't exceed the payment,
- confirmation is fast enough for an interactive call,
- and payload space (OP_RETURN) allows receipts and metadata.

BSV's fee model makes a 20-sat call economically sane. The gateway and agentpay use ARC for broadcast and WhatsOnChain for indexing; sellers can verify independently.

## What a challenge looks like

Decoded, a BSV challenge is ordinary JSON:

```json
{
  "x402Version": 2,
  "scheme": "exact",
  "network": "bsv:mainnet",
  "payTo": "1…",
  "maxAmountRequired": "20",
  "asset": "BSV",
  "resource": "https://example.com/forecast?city=YYZ",
  "description": "7-day forecast"
}
```

The buyer encodes its signed transaction as `PAYMENT-SIGNATURE` (base64 envelope with `txHex`). The seller verifies amount, recipient, and that the transaction is well-formed and unspent, then broadcasts.

## Where the pieces live in this stack

- **Buyers**: [agentpay](/agentpay/) wallets — `service_quote` reads the challenge, `pay_service` settles it and returns the response.
- **Sellers, hosted**: [x402 Gateway](/x402gateway/) — wrap an upstream URL; the gateway challenges, verifies, broadcasts, and proxies.
- **Sellers, self-hosted**: the Seller Kit pattern — a Worker that speaks the same protocol with your own keys.
- **Discovery**: [x402market](/x402market/) — verified listings with live quotes, so buyers can price before spending.

## Designing for pay-per-call

- **Keep prices deterministic.** Quote the same price on every challenge for the same resource.
- **Make the free tier explicit.** A zero-price probe route is a quality signal, not lost revenue.
- **Receipt on every call.** Return the settlement txid; agents log it, and disputes become trivial.
- **Fail loudly.** If verification or broadcast fails, don't serve the resource — a 402 with a reason beats a success that didn't settle.

## FAQ

### Is x402 a standard?

It's an emerging open protocol (the `x402` ecosystem) with a small, stable core: 402 challenges, payment proofs, and per-network settlement. Implementations vary in the envelope details; the handshake is the standard part.

### What happens if the payment is invalid?

The seller rejects it with 402 and a reason. Nothing is served and no funds move — an invalid proof is just a bad request.

### Can I accept both card and x402?

Yes, but keep them separate flows. Humans get checkout sessions; agents get 402s. Mixing the two in one endpoint confuses both buyers.

### How do refunds work?

On-chain payments are final. Refund policy belongs in the service contract: retry the call, credit downstream, or return a compensating transfer. agentpay records refunds when sellers reject settlement before broadcasting.
