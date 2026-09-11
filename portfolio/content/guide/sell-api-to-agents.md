---
path: /guide/sell-api-to-agents/
type: guide
title: How to sell your API to AI agents (x402 in an afternoon)
description: Agents don't sign up, add cards, or read docs like humans. Here's how to make an API agent-buyable with x402, sat pricing, and a discoverable listing.
lede: Agents are buyers now. The onramp is a 402, not a signup form.
keywords: sell API to AI agents, x402 API monetization, monetize API for agents, agent payments
updated: 2026-09-11
priority: 0.8
changefreq: monthly
---

Agents are becoming real customers: they browse programmatically, decide fast, and pay per call. But they fail at exactly the steps your current signup flow is made of — account creation, email verification, card entry, key rotation. If buying your API requires a human, an agent can't buy it at all.

The fix is an old HTTP status code: **402 Payment Required**.

## The x402 pattern in one minute

1. A buyer calls your endpoint with no payment.
2. You reply `402` with a machine-readable challenge: price, currency, recipient address, network.
3. The buyer pays and retries with a payment proof header.
4. You verify (or delegate verification), serve the response, and attach a receipt.

No accounts. No cards. The buyer's wallet is its identity. The protocol is x402, and it settles natively on chains fast and cheap enough for per-call pricing — BSV in this stack.

## Option A: hosted, in ten minutes

[x402 Gateway](/x402gateway/) wraps your existing API:

1. Register the upstream URL and an auth header to inject (your existing API key stays server-side).
2. Set a sat price per route and your BSV `payTo` address.
3. You get a paid endpoint at `/g/<slug>/<tool>` and a listing in [x402market](/x402market/) so agents can find it.

Free tier covers up to 5 routes; Pro ($9/mo) adds 100 routes, per-call analytics, and CSV export. You change nothing about your API.

## Option B: self-hosted, in an afternoon

If you want the endpoint to be yours, the pattern is a small Worker (or any server) that:

- returns `402 + PAYMENT-REQUIRED` on unpaid calls,
- verifies `PAYMENT-SIGNATURE` (envelope shape, amount, recipient),
- broadcasts the transaction via a facilitator or ARC,
- dedupes txids so a replay can't buy two calls,
- proxies upstream with your credentials.

Reusable pieces exist — the Seller Kit from this factory is exactly this template, and [Agent-ready API in 48 hours](/factory/agent-ready-api/) is the done-for-you version with the listing included.

## Pricing that agents can reason about

Agents compare options numerically. Help them:

- **Price per call in sats.** Sub-cent granularity is a feature, not a rounding error.
- **Describe tools precisely.** Name, one-line description, parameters. Agents pick tools by description.
- **Offer a free probe.** A zero-price health or sample route lets agents validate quality before spending.
- **Be stable.** Fresh 402 challenges on every quote; no expired cached prices.

## Discovery: be findable without a website

An agent doesn't land on your pricing page. It queries a registry. In this stack that's [x402market](/x402market/): you publish a manifest, the registry verifies it against a live 402 challenge, and buyers quote it without a wallet.

That means your marketing surface is a JSON file and your 402 response — both should be accurate on the first try.

## Getting paid

Sats land at your `payTo` address per call. There is no invoice, settlement delay, or chargeback. If you use the hosted gateway, your address is paid directly; the gateway never custodies funds. If you self-host with a facilitator, the facilitator broadcasts but doesn't hold balances.

For teams that also want fiat, the pattern in this factory is: card top-ups on one side (Stripe), machine-speed settlement on the other (BSV). Humans fund; agents spend.

## Checklist

- [ ] Endpoint returns a valid `402 + PAYMENT-REQUIRED` when unpaid.
- [ ] At least one paid route and one free probe.
- [ ] Tool descriptions written for tool-selection, not for landing-page SEO.
- [ ] `payTo` is an address you control and monitor.
- [ ] Txid dedupe in place (one payment, one call).
- [ ] Listing submitted and verified in a registry agents actually query.
- [ ] Usage visible somewhere: calls, sats, errors.

## FAQ

### Do I need to know Bitcoin to do this?

No. You need an address to receive sats and a way to broadcast transactions. The hosted gateway handles verification and broadcasting for you.

### What about bots that hammer the free probe?

Free routes should be genuinely cheap to serve and rate-limited per IP. Paid routes are naturally rate-limited by economics.

### Can I keep my existing auth?

Yes — credentials are injected server-side after payment verification. Buyers never see them.

### Is x402 only for crypto-native buyers?

The buyers here are agents with wallets (agentpay or otherwise). A human-facing card option can coexist through a separate plan; the point is that the agent path exists at all.
