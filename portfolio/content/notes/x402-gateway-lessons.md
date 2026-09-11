---
path: /notes/x402-gateway-lessons/
type: note
title: Building the x402 Gateway — SSRF, replays, and credential injection
description: A paid proxy that wraps arbitrary upstream APIs has three attack surfaces that matter. Here's how the x402 Gateway handles each, and what we'd warn any builder about.
lede: The moment you proxy someone else's API for money, you inherit three problems. Two of them can lose the seller money.
keywords: x402 gateway, SSRF guard, replay protection, API credential injection, paid API proxy
updated: 2026-09-11
priority: 0.6
changefreq: monthly
---

[x402 Gateway](/x402gateway/) turns any HTTPS upstream into a pay-per-call endpoint. Sellers register a base URL, an auth header, and per-route prices; buyers pay in sats and the gateway proxies the call with credentials injected.

That description hides the interesting parts. A paid proxy has three attack surfaces that a plain reverse proxy doesn't.

## 1. SSRF: the upstream URL is user input

Sellers register an arbitrary `baseUrl`. If the gateway will fetch anything, it becomes a post-exploitation pivot into private networks, metadata endpoints, and internal services.

What the gateway enforces:

- `https://` only.
- Hostname rejected if it resolves to loopback, private, link-local, or metadata ranges.
- Redirects are not followed into private space.
- Fixed timeouts keep a hostile upstream from pinning connections (20s cap).

None of this is exotic, but every paid-proxy builder forgets at least one of these. The metadata endpoint is the one that ends you.

## 2. Replay: one payment must buy exactly one call

On-chain payments are bearer instruments. If the gateway verifies a txid and serves, a buyer can replay the same `PAYMENT-SIGNATURE` and get N calls for one payment. Worse, two concurrent retries can race between verify and dedupe.

The fix is a **claim-before-serve** write: the txid is inserted into a unique table *before* upstream fetch, and a conflict means the payment is already spent. It's the same invariant as agentpay's ledger refs — claim the reference atomically, then do the work.

Also checked at verification: amount ≥ price, correct `payTo`, correct network, and a well-formed exact-scheme envelope. Verification is not settlement; the broadcast happens after the claim wins, so a losing replay never touches the chain.

## 3. Credentials: injected, never returned

Sellers don't want to hand buyers their upstream key, and buyers shouldn't see it. The gateway injects `authHeader`/`authValue` server-side after verification. Consequences:

- No API endpoint ever returns stored credentials — service detail scrubs them.
- Logs record routes and statuses, not headers.
- The admin key (one per service) is separate from the upstream credential, rotates independently, and is shown exactly once.

## The operational bits that saved us

- **Frozen route semantics**: route paths can carry `{param}` placeholders filled from caller query params, and consumed params are stripped before forwarding. Without this, sellers leak internal identifiers into upstream paths.
- **Output caps**: 512KB response cap with `X-Gateway-Truncated: 1`, so a chatty upstream can't hammer a buyer's context window or your egress.
- **Plan limits as product**: Free allows 5 routes; Pro ($9/mo) allows 100 plus per-call analytics. Limits are enforced at route registration, not by silently dropping traffic.
- **Idempotent webhooks**: Stripe events are stored and deduped (`xgw_stripe_events`), so a re-delivered subscription event can't double-flip a plan.

## What we'd tell a first-time builder

1. **Model the threat, not the feature.** The feature is "proxy with payment." The threats are SSRF, replay, and credential leak. Design those first.
2. **Claim before you serve.** Anywhere money and work meet, make the dedupe write the gate, not a check after the fact.
3. **Treat upstreams as hostile.** Timeouts, size caps, and redirect discipline are table stakes when someone else controls the other side.
4. **Put analytics behind the paid tier.** Per-call logs are real infrastructure cost and a genuinely useful upgrade — but never let billing depend on them.

The gateway is live at [entangleit.com/x402gateway](/x402gateway/); the registration UI doubles as the directory. If you just want one API monetized without running any of this, that's the [Agent-ready API](/factory/agent-ready-api/) engagement.
