---
path: /notes/gateway-watch-launch/
type: note
title: "Gateway Watch: paging sellers before buyers notice"
description: Paid API endpoints fail in a specific way — they stop charging correctly while looking alive. Gateway Watch probes them like a buyer and alerts on breakage, price moves, and recovery.
lede: Uptime monitors check that a URL answers. Watch checks that it charges.
keywords: x402 monitoring, paid API uptime, 402 challenge monitoring, API revenue protection
updated: 2026-09-12
priority: 0.6
changefreq: monthly
---

**The failure mode.** A paid endpoint has two ways to be broken, and only one of them pages anyone today. When it's *down*, uptime monitors fire. When it's *up but not charging* — the 402 challenge is malformed, the price drifted, the payTo changed, the route 200s when it should challenge — everything looks green while revenue silently goes to zero. For an agent-payable API, the second failure is the common one, because the money path (challenge → settle → broadcast) has more moving parts than the serving path.

## What Watch does

Every paid route on the [x402 Gateway](/x402gateway/) is now probed like a buyer on a schedule: unsigned request, expect a valid 402, parse the challenge, record price, payTo, and latency.

- **Down** — unreachable, 5xx, timeout, or a challenge that won't parse.
- **Terms changed** — price or payTo moved against the observed baseline. Could be an edit; could be a hijack. Either way the owner should know within minutes, not at month-end reconciliation.
- **Recovered** — back to a valid challenge, so the 3am page has a matching all-clear.

Free services get one watched endpoint with daily checks and dashboard status. Pro ($9/mo, $86.40/yr) gets ten endpoints — including arbitrary third-party URLs — with 15-minute checks, email + webhook alerts, and a public status page per watch.

## Design notes worth stealing

**Auto-watch on registration.** The first paid route is monitored from minute one with zero configuration. Monitoring you have to set up is monitoring that doesn't exist when it matters.

**Probe from the buyer's chair, on the seller's network.** Checks run against the workers.dev origin, never same-zone entangleit.com paths — the exact trap that makes self-monitoring lie. If your architecture has a "calling yourself" path, test the path your customers actually take.

**Transitions, not thresholds.** Alerts fire on state changes (down/recovered/terms-changed), never on repeats. A pager that fires once per incident gets read; one that fires every 15 minutes gets filtered.

**The fee pays the fee.** Escrow-style arithmetic shows up everywhere in this stack; here it's simpler — history is pruned (7/90 days by plan) so the checks table can't grow unbounded, and cron ticks are capped per run.

## Try it

Register any paid route and it's watched. Break it on purpose — pause the upstream, change the price — and watch the alert land. The [docs](/x402gateway/docs/) have the three curl calls; the status page is yours to share as proof of reliability.
