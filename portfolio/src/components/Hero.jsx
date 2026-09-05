import React from 'react'
import { DIY_KIT, TITLE } from '../site'

export default function Hero({ navigate }) {
  return (
    <section id="hero" className="hero">
      <div className="hero-bg" aria-hidden="true" />
      <div className="hero-content">
        <p className="hero-greeting">Richard Hein · {TITLE}</p>
        <h1 className="hero-name">Need Stripe on Cloudflare this week?</h1>
        <p className="hero-summary">
          $750 installs WitnessCam or SignFlow in 48 hours.
          $2,500 buys a custom Cloudflare + Stripe week.
          Or take the $149 DIY kit and ship it yourself.
        </p>
        <div className="hero-cta">
          <button type="button" className="btn btn-primary" onClick={() => navigate('/#card')}>
            CARD / Get in Touch
          </button>
          <a
            href={DIY_KIT}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-secondary"
          >
            $149 DIY
          </a>
          <a href="/leak/" className="btn btn-ghost">
            Free Leak diagnosis
          </a>
        </div>
      </div>
    </section>
  )
}
