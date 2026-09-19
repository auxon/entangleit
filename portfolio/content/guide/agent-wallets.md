---
path: /guide/agent-wallets/
type: guide
title: What is an agent wallet? Prepaid balances for AI agents explained
description: AI agents can't fill card forms. An agent wallet is a prepaid balance with scoped keys, spending limits, and approval gates — designed for software to spend safely. Covers hosted wallets (agentpay) and OS-level self-custody (bsvOS).
lede: Give the agent a key, not your card. Limits fail closed, and every debit has a receipt.
keywords: AI agent wallet, agent payments, prepaid wallet for agents, spend limits for agents
updated: 2026-09-11
priority: 0.8
changefreq: monthly
---

Your API key lets an agent talk to a service. Nothing lets it **pay** for one safely. Handing an agent a corporate card is absurd; giving it your Stripe secret key is worse. The missing primitive is a wallet designed around how software actually behaves.

## What makes it an *agent* wallet

A normal wallet assumes a human at the controls: one balance, one signer, slow decisions. An agent wallet assumes the opposite:

- **Prepaid.** Money moves in once (card, transfer), then the agent spends from the balance. No per-call card authorizations.
- **Scoped keys.** The agent gets a key that can only spend, never withdraw or change settings. You keep the owner credential.
- **Server-enforced limits.** Daily caps and per-key budgets are checked on every debit by the server. A prompt-injected agent hits a wall, not your balance.
- **Approval gates.** Above a threshold, a spend returns `402 approval_required` with a URL. A human taps approve once; the approval is consumed exactly once at settlement.
- **Receipts and audit.** Every debit is a ledger entry with an external reference; every settled call writes a receipt.
- **Delegation.** A parent agent can mint child keys with their own budgets and expiries, so a fleet shares one funding source without sharing authority.

## The architecture that makes it safe

[agentpay](/agentpay/) is one implementation:

1. **Human rails for funding** — Stripe Checkout tops up the USD balance. Humans do human things.
2. **Machine rails for spending** — x402 challenges are settled in sats from an operator treasury; the agent's key never touches a private key or a card.
3. **Policy engine in the middle** — every `spend` and `pay_service` call passes through the same checks: key active, daily limit, sub-agent budget, tool allowlist, approval threshold.
4. **Fail closed** — expired keys, exhausted budgets, and unapproved high-value spends return errors instead of degrading gracefully into an overdraft.

[bsvOS](https://github.com/auxon/bsv-os) is the same idea pushed onto the device — a self-custody agent wallet where the machine holds the keys and the human holds the policy:

1. **OS-level custody** — one wallet in the system keyring with auto-lock. Apps and agents never see keys; every sat leaves through the daemon.
2. **Per-origin policy** — allow, deny, ask, or auto-approve, with spend caps. The first spend from anything new is denied and teaches the human the exact approval command.
3. **Agent sub-wallets** — mint an allowance with a lifetime budget, daily limit, and expiry. Minting is the approval ceremony; routine spends then pass without prompts, and revocation is one command.
4. **Receipts on-chain** — every spend is a labeled transaction the human can audit, and a Jev advisor scores the uncertain ones for human review.

## A minimal flow

An agent with a 50-cent daily limit:

```json
// list_services -> service_quote -> pay_service
{ "serviceId": "s_…", "tool": "forecast", "params": { "city": "YYZ" }, "amountCents": 2 }
```

What happened server-side: policy checked, balance debited in cents, treasury paid sats to the seller, seller responded, receipt written. The agent saw JSON.

## How this differs from "just use API keys"

API keys are access control. Agent wallets are **economic** control. You can rotate a key; you can't rotate an overdraft. Prepaid + scoped + limited is the combination that makes autonomous spending tolerable.

## Attestations: turning spend into trust

A wallet's history is useful to sellers. agentpay can sign a summary of settled activity — payments, distinct services, spend, refunds, bounty earnings — as an ECDSA attestation. Sellers verify it offline and can price trust: a discount for proven payers, a deposit requirement for brand-new keys.

That's a two-sided win: new agents bootstrap reputation without a credit history, and sellers get a sybil-resistant signal that isn't a captcha.

## When you don't need one

If the agent only ever spends on one service you control, a Stripe subscription or an internal credit ledger is simpler. Agent wallets earn their keep when:

- multiple services are involved,
- limits and approvals matter,
- or you want the agent to **earn** as well as spend (bounties credited to the same balance).

## FAQ

### Can the agent lose money if it's compromised?

It can lose up to its limits — which is exactly what limits are for. The key can't withdraw, can't exceed daily caps, and can't pass an approval threshold without a human.

### Do I need crypto to fund it?

No. Humans fund with a card; the rails settle in BSV behind the scenes. The agent never sees an exchange or a seed phrase.

### How do I audit what it bought?

`list_transactions` and receipts show every debit with amounts, services, and references. Pro wallets export CSV and share read-only report links.

### Can multiple agents share a budget?

Yes — mint one key per worker from one wallet, or delegate child budgets with `mint_subagent`. Children can't mint children, and revoking a parent revokes its descendants.
