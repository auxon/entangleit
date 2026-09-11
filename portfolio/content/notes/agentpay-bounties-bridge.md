---
path: /notes/agentpay-bounties-bridge/
type: note
title: One key to earn and spend — the agentpay ↔ BSVBounties bridge
description: How we linked a prepaid agent wallet to a bounty board, added on-chain sats escrow funded from balances, and made every payout idempotent.
lede: An agent with a wallet could spend. Making it able to earn took a bridge, an escrow state machine, and a stubborn insistence on idempotency.
keywords: agentpay bounties bridge, agent escrow, on-chain bounty payout, idempotent payouts
updated: 2026-09-11
priority: 0.6
changefreq: monthly
---

**The problem.** We had two systems that didn't talk: [agentpay](/agentpay/), where an agent spends prepaid dollars on x402 services, and [BSVBounties](/bsvbounties/), where work gets done for sats. An agent could buy things. It couldn't earn things. That's half an economy.

## The bridge, v1: trust, then verify

The first version linked a wallet to a bounty at claim time. An agent called `claim_bounty`, the wallet id was recorded against the bounty, and when the board settled it fired a signed event to agentpay, which credited the balance.

The invariant that made this safe: **credits are idempotent on `bounty:<id>`**. Settlement events can be retried, replayed, or delivered twice by an overeager queue, and the ledger still moves once — because the credit claims a unique reference before it touches a balance.

## v2: escrow that a solver would respect

"Credit on settle" was fine for small work, but it assumed the poster paid. If the poster ran off, the ledger credit had no sats behind it. So we added the rail the system actually needed: **agentpay-funded bounties with on-chain escrow**.

The flow:

1. `post_bounty` debits the poster's wallet (USD cents, rounded up at the configured rate).
2. The treasury broadcasts a real P2PKH output — the reward — to a fresh per-bounty key, encrypted at rest with AES-GCM.
3. The bounty is listed on the board under its own funding rail.
4. On settle `paid`, the escrow output is spent: worker net, platform fee, change. On `refunded`, it sweeps back and re-credits the poster.
5. The payout txid is written back to the board so both sides can inspect it.

No custody ambiguity: the sats exist, the key is held encrypted, and the transitions are recorded.

## What was harder than expected

**WOC lies by omission.** WhatsOnChain's address index lags fresh outputs. The first payout attempt after funding failed with "escrow UTXO not found." The fix was to stop asking the index: we know the outpoint (`funding_txid:0`) and the amount, so we construct the UTXO from what we already know and use the spent-check only as a guard.

**Fee arithmetic eats margins.** The escrow output is exactly the reward, so the network fee has to come out of the platform fee. If the fee can't cover it, the payout is marked `payout_pending` with a reason instead of broadcasting a transaction that can't pay for itself.

**Event routing is load-bearing.** Our first production run took the *legacy* credit path because the internal event didn't forward the funding rail. The wallet got credited but the escrow stayed open. One field, two systems, real money — the event payload is now a typed contract with tests on both repos.

**Same-zone Workers can't call each other by hostname.** `agentpay` calling `entangleit.com/api/agentpay` from another Worker on the same zone hits Pages, not the Worker route. Cloudflare **service bindings** solved it in both directions; the shared secret is just defense in depth.

## Results

The loop now closes: claim work, submit, get paid into the balance, spend it on an API call minutes later — one key, one MCP endpoint, no human step. Escrow, payout, and refund transaction ids are all inspectable, and `payout_pending` states are retryable rather than lost.

The next piece is portability: letting spend attestations and bounty reputation feed the same trust graph, so an agent's history on one side of the market is collateral on the other.
