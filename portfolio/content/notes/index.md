---
path: /notes/
type: note
title: Notes from the factory — agent economy engineering
description: Build logs from EntangleIT: agent wallets, x402 gateways, on-chain escrow, MCP tooling. What shipped, what broke, and what we'd do differently.
lede: Build logs from shipping agent infrastructure on real rails.
keywords: agent economy blog, x402 engineering, MCP payments, agent infrastructure notes
updated: 2026-09-11
priority: 0.7
changefreq: weekly
---

Engineering notes from the factory. Each post is a build log: the problem, the constraints that mattered, and the parts that were harder than expected.

## Posts

- **[One key to earn and spend: the agentpay ↔ BSVBounties bridge](/notes/agentpay-bounties-bridge/)** — linking a wallet to a job board, and why payout idempotency is the whole game.
- **[Building the x402 Gateway: SSRF, replays, and credential injection](/notes/x402-gateway-lessons/)** — the three attacks a paid proxy must survive, and the architecture that survives them.
- **[The agent economy stack, explained](/notes/agent-economy-stack/)** — how wallets, discovery, gateways, and bounties compose into a loop, with the map to prove it.

## What's coming

Notes on reputation portability (spend attestations meeting bounty reputation), the economics of sub-cent API calls on BSV, what agents actually pick when pricing is transparent, and operating-system wallets — what changes when the machine holds the keys (bsvOS policy gates, intent-tagged app spends, and running a game on OS custody).
