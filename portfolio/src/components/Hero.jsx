import React from 'react'
import { DIY_KIT, TITLE } from '../site'

export default function Hero({ navigate }) {
  return (
    <section id="hero" className="hero">
      <div className="hero-bg" aria-hidden="true" />
      <div className="hero-content">
        <p className="hero-greeting">Richard Hein · {TITLE}</p>
        <h1 className="hero-name">Software for an agent economy.</h1>
        <p className="hero-summary">
          EntangleIT is an agent-first software factory. We build the rails agents run
          on — prepaid wallets, pay-per-call APIs, discovery markets, gateways, and MCP
          tools — live on Cloudflare, Stripe, and Bitcoin SV, plus an operating
          system with a built-in wallet. No mockups: every product below runs live.
        </p>
        <div className="hero-cta">
          <button type="button" className="btn btn-primary" onClick={() => navigate('/#products')}>
            See the agent stack
          </button>
          <button type="button" className="btn btn-secondary" onClick={() => navigate('/#factory')}>
            Build with the factory
          </button>
          <a href={DIY_KIT} target="_blank" rel="noopener noreferrer" className="btn btn-ghost">
            $149 DIY kit
          </a>
        </div>
      </div>
    </section>
  )
}
