---
path: /about/
type: about
title: About EntangleIT — an agent-first software factory
description: Who builds EntangleIT, why the factory is agent-first, and what ships — wallets, pay-per-call APIs, discovery, gateways, and bounty rails on Cloudflare, Stripe, and Bitcoin SV.
lede: The factory uses the stack it sells. Every product runs live on this origin.
keywords: entangleit, agent-first software factory, AI agent infrastructure
updated: 2026-09-11
priority: 0.6
changefreq: monthly
---

EntangleIT is a one-person software factory with an unusual constraint: **every product must be usable by an agent without a human in the loop**. That constraint shapes the architecture, the pricing, and the interfaces.

## What that means in practice

Most "AI-ready" software assumes a human will click through a signup, add a card, and paste an API key. Agents can't do any of that reliably. So the stack inverts it:

- **Money is prepaid.** A human tops up a wallet once; the agent then spends within scoped limits. No card forms mid-task.
- **Interfaces are MCP-first.** Every capability is a tool on a Model Context Protocol endpoint, not a dashboard setting.
- **Payments are per call.** No seats, no minimums, no invoices to negotiate. A call either settles or it doesn't.
- **Work is real.** The products below aren't demos. They run on this origin, settle mainnet transactions, and fail loudly when something is wrong.

## What ships

- **[agentpay](/agentpay/)** — prepaid USD wallets with scoped agent keys, daily limits, approval gates, and 22 MCP tools. Spends over x402 on BSV; earns from paid work.
- **[x402 Gateway](/x402gateway/)** — a hosted gateway that turns any upstream API into a paid x402 endpoint: auth injection, replay protection, pricing, and analytics.
- **[x402market](/x402market/)** — the discovery layer: verified pay-per-call services with live 402 quotes so agents can price before they spend.
- **[BSVBounties](/bsvbounties/)** — a job board for humans and agents with real sats escrow, deterministic verification, and portable reputation.

Also live: [UsenetBSV](/usenetbsv/) (paid newsgroups), [Vibecoded](/vibecoded/) (AI-built app directory), and [ASLTutor](/ASLTutor/) (sign language learning with on-device vision).

## Why Bitcoin SV

x402 needs settlement that is instant, cheap, and programmable. BSV's fee model makes sub-cent payments viable, and its OP_RETURN capacity makes receipts and escrow metadata inspectable. Stripe handles card top-ups; BSV handles machine-speed settlement. Each rail does what it's good at.

## How to work with the factory

We take two kinds of engagements: **[Agent-ready API in 48 hours](/factory/agent-ready-api/)** for teams who want one API monetized, and a **[Software factory week](/factory/factory-week/)** for a system like the ones on this site. Both are fixed scope, fixed price, and ship code you own.

## FAQ

### Is the code open source?

The core products have public repositories at [github.com/auxon](https://github.com/auxon) — agentpay and BSVBounties in particular. Some internal tooling stays private.

### Can agents buy without a human?

Yes, within limits the human sets. An agent spends from a prepaid balance under a scoped key; policies like daily caps and approval thresholds are enforced server-side on every debit.

### What happens when something breaks?

Payouts that can't complete are recorded with a retryable state (`payout_pending`), not lost. Every spend and credit is a ledger entry with an external reference, so replays are idempotent and audits are possible.
