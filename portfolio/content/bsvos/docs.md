---
path: /bsvos/
type: doc
title: bsvOS documentation — an operating system with a built-in wallet
description: Install bsvOS, approve spends, mint agent budgets, and build apps on OS-level custody — policy gates, a Jev advisor, sandboxed runner apps, and MCP tools.
lede: The machine holds the money. The human holds the policy. Agents do the work.
keywords: bsvOS docs, Bitcoin SV operating system, OS wallet, agent spending policy, BRC-100 wallet, sub-wallets
updated: 2026-09-19
priority: 0.9
changefreq: weekly
---

bsvOS is an operating system with a built-in wallet. A system daemon holds the keys, enforces spending policy, and lets any app — or AI agent — transact without ever touching keys. It is [open source](https://github.com/auxon/bsv-os).

> **The one rule:** *apps never see keys. Every sat that leaves the machine passes a policy gate.*

## The three pieces

1. **`bsv-walletd`** — the system BRC-100 wallet. One recovery phrase in the OS keyring, 15-minute auto-lock, local JSON-RPC plus a `bsv` CLI and MCP.
2. **Policy engine** — per-origin allow, deny, ask, or auto-approve, with spend caps. The first spend from anything new is denied and teaches the human the exact approval command. Agents get sub-wallets: a budget, a daily allowance, an expiry.
3. **Runner apps** — plain local web apps served on loopback, sandboxed with per-app profiles. They call the daemon through `window.bsv` intents; the daemon signs and broadcasts.

## Install

On a fresh Omarchy Linux (aarch64) machine, one command:

```bash
curl -fsSL https://raw.githubusercontent.com/auxon/bsv-os/main/scripts/install.sh | bash
```

Then:

```bash
bsv status    # wallet enrolled? unlocked?
bsv balance   # address + confirmed/unconfirmed sats
```

## Policy: the whole game

Every origin (app, agent, `cli`) has a mode and a cap:

```bash
bsv policies    # who's allowed what
bsv requests    # open first-spend approvals
bsv allow <origin> [capSats] [--auto]  # approve; --auto lets Jev approve routine spends
bsv deny <origin>                      # revoke
```

Unknown origins start denied — that is the system working, not an error. For long-running agents, mint a sub-wallet instead of a bare approval:

```bash
bsv agent mint <name> --budget=2000000 --daily=500000 --expiry=30d
bsv agent list                         # remaining, daily window, expiry
bsv agent revoke <name>                # one command cuts access
```

A **Jev advisor** scores uncertain spends with calibrated probabilities (`allow` / `ask` / `deny` plus a routine → harmful risk axis). In `auto` mode, routine confident spends pass without waking the human; everything else pauses for approval. Nothing is ever silently approved — no answer means a pending request, never a spend.

## Everyday commands

```bash
bsv address --qr             # receive address + terminal QR (panel Receive section shows it too)
bsv send <address> <sats>    # human send through the full policy gate
bsv probe <origin> <action> <sats> [--label=..]  # dry-run the gate — no money moves
bsv events --wait 60         # approval-lifecycle feed (agents poll this, not state)
bsv doctor                   # machine-check the gotchas; exit 1 if anything is broken
bsv history                  # ledger + approvals audit (same view as the panel)
bsv app open <domain>        # sandboxed runner window with window.bsv
bsv store                    # curated apps, requested caps, update status
```

## Runner apps

Installed apps open in sandboxed Chromium windows (no shared cookies, the bridge extension is the only extension) and reach the wallet through capability-scoped `window.bsv` intents: `spend`, `inscribe`, `transferNft`, atomic-swap `signSwapOffer` / `completeSwap`, `timestamp`. Reads are free; every write is policy-gated under the app's origin and labeled in the ledger.

The reference citizen is **Pocket Pets** — a gacha game whose mints, market buys, battle stakes, and ledger anchors all route through OS custody: 1-sat action fees, NFT mints as 1Sat Ordinal inscriptions, escrow-free atomic swaps.

## Agents (MCP)

```jsonc
// one MCP server per agent identity:
{ "command": "bsv", "args": ["mcp", "--agent=<your-stable-name>"] }
```

Your `--agent` name is your policy identity, budget holder, and ledger principal. The loop: **probe first** (`policy_probe`), relay denials verbatim to your human, then **wait on `events_poll`** until `request.approved` (or `budget.minted`) arrives. There is deliberately no open send tool — moving arbitrary sats is human-only. Full agent reference: [SKILLS.md](https://github.com/auxon/bsv-os/blob/main/SKILLS.md).

## Build on it

- Declare spend intents in your manifest (`metanet.intents`): action tags, typical costs, descriptions. New actions count as permission widening on update.
- Tag every spend at the source: the **first memo entry is the action tag** (policy label + ledger label), the rest is the description the advisor reads.
- Probe every spend in development (`bsv probe`) and test with `MockChainProvider` — no network, no money.
- Developer guide written from the reference apps: [AGENT-ECONOMY.md](https://github.com/auxon/bsv-os/blob/main/AGENT-ECONOMY.md).

## Field notes

- The wallet auto-locks after ~15 minutes idle — check status before spending, unlock to continue.
- `cap 0` means uncapped. Always set a real cap or mint a budgeted sub-wallet.
- A failed broadcast (`REJECTED`, "double spend attempted") means funds never moved — re-run the action.
- `bsv doctor` catches all of the above plus dangling sign rounds and panel skew. Run it when anything smells off.
