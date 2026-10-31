import React, { useMemo, useState } from 'react'
import BrandMark from './BrandMark'
import {
  AGENT_STACK,
  EMAIL,
  INSTALL_CTA,
  INSTALL_HOURS,
  INSTALL_PRICE,
  MAILTO,
  PAY_CHECKOUT_PATH,
} from '../site'

const SCOPE = [
  'agentpay wallet live on your origin — scoped keys, budgets, card top-ups',
  'x402 charge path so agents can pay per call without a human checkout',
  'x402market listing so agents can find the tools',
  'bounties wired so the same agent can get paid',
]

export default function Pay() {
  const status = useMemo(() => {
    if (typeof window === 'undefined') return ''
    return new URLSearchParams(window.location.search).get('status') || ''
  }, [])
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  const startCheckout = async () => {
    setBusy(true)
    setError('')
    try {
      const res = await fetch(PAY_CHECKOUT_PATH, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
      })
      const data = await res.json().catch(() => ({}))
      if (data && data.url) {
        window.location.assign(data.url)
        return
      }
      setError(
        `Checkout is not wired on this environment yet. Email ${EMAIL} to book the $${INSTALL_PRICE} install.`,
      )
    } catch {
      setError(`Could not reach checkout. Email ${EMAIL} and we will send a payment link.`)
    } finally {
      setBusy(false)
    }
  }

  return (
    <section className="pay-page">
      <div className="pay-inner">
        <BrandMark className="brand-mark pay-logo" size={200} />
        <p className="pay-kicker">Stripe for agents</p>
        <h1 className="pay-headline">
          ${INSTALL_PRICE} · {INSTALL_HOURS}-hour install
        </h1>
        <p className="pay-lead">
          We put the agent economy stack on your API: a wallet that can spend, a charge
          path that collects, a market that discovers tools, and bounties that pay the
          agent back. Proof is this origin. You own the result.
        </p>

        {status === 'success' && (
          <p className="pay-banner pay-banner-ok" role="status">
            Payment received. Richard starts the {INSTALL_HOURS}-hour install from the
            Stripe receipt.
          </p>
        )}
        {status === 'cancel' && (
          <p className="pay-banner" role="status">
            Checkout canceled. The install is still ${INSTALL_PRICE} when you are ready.
          </p>
        )}

        <div className="pay-cta">
          <button type="button" className="btn btn-primary" onClick={startCheckout} disabled={busy}>
            {busy ? 'Opening checkout…' : INSTALL_CTA}
          </button>
          <a className="pay-email" href={`${MAILTO}?subject=${encodeURIComponent('EntangleIT — Stripe for agents install')}`}>
            Or email {EMAIL}
          </a>
        </div>
        {error && <p className="pay-error">{error}</p>}

        <h2 className="pay-subhead">What&rsquo;s in the install</h2>
        <ol className="pay-scope">
          {SCOPE.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ol>

        <p className="stack-label pay-stack-label">
          Agent Economy Stack — what&rsquo;s in the ${INSTALL_PRICE} install
        </p>
        <ol className="stack-flow">
          {AGENT_STACK.map((step, index) => (
            <li key={step.name} className="stack-step">
              {index > 0 && (
                <span className="stack-arrow" aria-hidden="true">
                  →
                </span>
              )}
              <a className="stack-card" href={step.href}>
                <strong>{step.name}</strong>
                <span>{step.role}</span>
              </a>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
