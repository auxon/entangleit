import React from 'react'
import { DIY_KIT, offers } from '../site'

export default function Card({ navigate }) {
  return (
    <section id="card" className="section">
      <div className="section-inner wide">
        <p className="section-kicker">Services</p>
        <h2 className="section-title">CARD</h2>
        <p className="section-lead">
          Get Stripe live on Cloudflare. Install an existing product, or buy a week.
        </p>
        <div className="offers-grid">
          {offers.map((offer) => (
            <article key={offer.id} className="offer-card">
              <p className="offer-price">{offer.price}</p>
              <h3>{offer.name}</h3>
              <p>{offer.summary}</p>
              {offer.href ? (
                <a
                  href={offer.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-secondary"
                >
                  Buy the kit
                </a>
              ) : (
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={() => {
                    window.dispatchEvent(new CustomEvent('card-offer', { detail: offer.id }))
                    navigate('/#contact')
                  }}
                >
                  Get in Touch
                </button>
              )}
            </article>
          ))}
        </div>
        <p className="card-footnote">
          DIY kit is also on{' '}
          <a href={DIY_KIT} target="_blank" rel="noopener noreferrer">
            Gumroad
          </a>
          . Installs and custom weeks start with email.
        </p>
      </div>
    </section>
  )
}
