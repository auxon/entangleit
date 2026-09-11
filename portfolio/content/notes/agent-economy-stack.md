---
path: /notes/agent-economy-stack/
type: note
title: The agent economy stack, explained
description: Wallets, discovery, gateways, bounties, and trust — how the four products compose into an earn-and-spend loop for software agents, and why each piece exists.
lede: Each product exists because the previous one exposed a missing primitive.
keywords: agent economy, agent stack, x402 market structure, agent payments architecture
updated: 2026-09-11
priority: 0.6
changefreq: monthly
---

People ask which of the four products to use first. The honest answer is that they're one system sliced four ways, and each slice exists because the one before it hit a wall.

## The loop

**Fund → spend → earn → trust → repeat.**

A human funds a wallet. The agent spends per call on APIs. It earns by doing paid work. Its history becomes portable trust that lowers the cost of the next transaction. Then it does it again, with more of the loop running unattended each cycle.

## The four primitives

**1. A balance that software can hold — [agentpay](/agentpay/).**
The base primitive is prepaid value with scoped spending. A key that can spend but not withdraw, limits enforced server-side, approvals for the expensive edge. Everything else assumes this exists; without it, every purchase is a signup.

**2. A way to discover what's buyable — [x402market](/x402market/).**
A wallet with money needs merchants. A registry of verified 402 challenges is the machine-readable equivalent of a storefront: what tools exist, what they cost *right now*, where to pay. Discovery without a live price is a directory; discovery with one is a market.

**3. A way to become buyable — [x402 Gateway](/x402gateway/).**
The supply side can't require every API author to build a payment stack. The gateway compresses "become agent-payable" to registering a URL and a price, with the security work (SSRF, replay, credential injection) handled centrally.

**4. A way to earn — [BSVBounties](/bsvbounties/).**
Spending requires money, and money requires earning. Paid tasks with real escrow give agents an income path, and the escrow rails are the same sats the spending side settles in. The bridge makes the two balances one balance.

## The trust layer that glues it

Markets need a reason to transact with strangers. Two mechanisms do the work here:

- **Proof of activity (agentpay attestations).** A wallet can prove its settled payment history — services used, volume, refunds — with a signed summary. Sellers price trust with it.
- **Portable reputation (BSVBounties).** A deterministic 0–1000 score from completed work, pass rate, and slashes. Workers carry it; posters weigh it.

Neither is a credit score. Both are cheap to verify, hard to fake at scale, and composable: a new agent starts with zero history on both axes and accumulates it through real transactions.

## Why the rails are what they are

- **Cloudflare Workers** because latency is a feature and global edge deployment is boring now.
- **Stripe for fiat** because humans fund wallets with cards and expect receipts.
- **BSV for settlement** because per-call prices are sub-cent and the fee model has to allow that.
- **MCP for interfaces** because agents don't fill forms; they call tools.

Each choice is unremarkable in isolation. The point is that they compose into a loop with no human in the middle of the machine-speed parts.

## What the stack refuses to do

- **Custody ambiguity.** Card funds are custody with a ledger. On-chain escrow is on-chain. Never both at once, never unclear which.
- **Silent failures.** Blocked payouts are `payout_pending` with reasons and retries. Replays are rejected, not absorbed.
- **Vibes-based trust.** Attestations are signed; reputation is deterministic. No LLM decides whether you're trustworthy.

## Where it's going

The obvious next primitive is **reputation portability across the loop** — letting spend history raise bounty limits, and completed bounties lower the approval threshold for spending. The rails for it exist. The work is in making the trust graph two-way without making it gameable.

The [infographic](/infographics/agent-economy-stack.png) is the map of today's system; this note is the text version.
