import React from 'react'
import { INSTALL_MAILTO } from '../site'

export default function Pay() {
  return (
    <section className="pay-page">
      <div className="pay-inner">
        <p className="section-kicker">Static demo · no live charges</p>
        <h1 className="pay-title">Human pays the deposit. Agent proves the receipt.</h1>
        <p className="pay-lead">
          Stripe-for-agents, without a human in the spend loop. A person funds a
          deposit by card. The agent never sees the card. It pays for tools over
          x402 and proves the spend with a signed receipt the seller can verify.
        </p>

        <figure className="pay-diagram" aria-label="Human card deposit, agent x402 receipt">
          <div className="pay-diagram-col">
            <p className="pay-diagram-who">Human</p>
            <p className="pay-diagram-act">Pays the deposit by card</p>
            <p className="pay-diagram-out">Funds a prepaid agent wallet</p>
          </div>
          <div className="pay-diagram-arrow" aria-hidden="true">
            <span>receipt issued</span>
          </div>
          <div className="pay-diagram-col">
            <p className="pay-diagram-who">Agent</p>
            <p className="pay-diagram-act">Pays and proves with x402</p>
            <p className="pay-diagram-out">Seller verifies the receipt</p>
          </div>
        </figure>

        <p className="pay-note">
          This page is a diagram only. No checkout, no secrets, no network calls
          to a processor. For a live install, book the $750 / 48h engagement.
        </p>
        <a className="btn btn-primary" href={INSTALL_MAILTO}>
          Book a $750 / 48h install
        </a>
      </div>
    </section>
  )
}
