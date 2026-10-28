import React, { useEffect, useState } from 'react'
import { EMAIL, LINKEDIN, MAILTO, RESUME, migrationPackages } from '../site'

const offerOptions = [
  { value: 'agent-build', label: 'Production agent build (from $12,500)' },
  { value: 'audit', label: 'AI Opportunity Audit ($1,500)' },
  ...migrationPackages.map((pkg) => ({
    value: pkg.id,
    label: `${pkg.name} (${pkg.price})`,
  })),
  { value: 'other', label: 'Something else' },
]

function offerFromLocation(fallback = 'agent-build') {
  if (typeof window === 'undefined') return fallback
  const fromQuery = new URLSearchParams(window.location.search).get('offer')
  const fromHash = new URLSearchParams(window.location.hash.split('?')[1] || '').get('offer')
  const value = fromQuery || fromHash
  return offerOptions.some((o) => o.value === value) ? value : fallback
}

export default function Contact({ variant = 'home', defaultOffer = 'agent-build' }) {
  const [offer, setOffer] = useState(() => offerFromLocation(defaultOffer))
  const [sent, setSent] = useState(false)

  useEffect(() => {
    const sync = () => setOffer(offerFromLocation(defaultOffer))
    window.addEventListener('hashchange', sync)
    window.addEventListener('popstate', sync)
    return () => {
      window.removeEventListener('hashchange', sync)
      window.removeEventListener('popstate', sync)
    }
  }, [defaultOffer])

  const handleSubmit = (event) => {
    event.preventDefault()
    const data = new FormData(event.target)
    const selected = offerOptions.find((o) => o.value === data.get('offer'))
    const subject = encodeURIComponent(`EntangleIT — ${selected?.label || data.get('offer')} — ${data.get('name')}`)
    const body = encodeURIComponent(
      [
        `Name: ${data.get('name')}`,
        `Email: ${data.get('email')}`,
        `Offer: ${selected?.label || data.get('offer')}`,
        '',
        data.get('message'),
      ].join('\n')
    )
    window.location.href = `${MAILTO}?subject=${subject}&body=${body}`
    setSent(true)
  }

  return (
    <section id="contact" className="section contact">
      <div className="section-inner">
        <h2 className="section-title">Get in Touch</h2>
        <div className="contact-content">
          <p>
            {variant === 'about'
              ? 'Email is the catch. Book a production agent build, a Cloudflare migration, start with an audit, or ask about anything else.'
              : variant === 'lab'
                ? 'Like what the factory ships? The lab runs live — and the same team builds production agents and Cloudflare migrations. Email is the catch.'
                : variant === 'migration'
                  ? 'Book a free 20-minute assessment call. Email is the catch — the form opens your mail client.'
                : 'Book a 20-minute fit call, a Cloudflare migration assessment, or start with an AI Opportunity Audit. Email is the catch — the form opens your mail client.'}
          </p>
          <p className="contact-email">
            <a href={MAILTO}>{EMAIL}</a>
          </p>

          <form className="contact-form" onSubmit={handleSubmit}>
            <label>
              Name
              <input name="name" type="text" required autoComplete="name" />
            </label>
            <label>
              Email
              <input name="email" type="email" required autoComplete="email" />
            </label>
            <label>
              Offer
              <select name="offer" value={offer} onChange={(e) => setOffer(e.target.value)}>
                {offerOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>
            <label>
              Message
              <textarea
                name="message"
                rows="4"
                required
                placeholder={
                  variant === 'migration'
                    ? 'What are you hosting today, and what do you want to move?'
                    : 'Which workflow hurts the most?'
                }
              />
            </label>
            <button type="submit" className="btn btn-primary">
              Email Richard
            </button>
            {sent && (
              <p className="form-note">
                If your mail client did not open, write {EMAIL} directly.
              </p>
            )}
          </form>

          <div className="contact-links secondary">
            {variant === 'about' && (
              <a href={RESUME} target="_blank" rel="noopener noreferrer">
                Resume (PDF)
              </a>
            )}
            <a href={LINKEDIN} target="_blank" rel="noopener noreferrer">
              LinkedIn
            </a>
            <a href="https://github.com/EntangleIT" target="_blank" rel="noopener noreferrer">
              GitHub (EntangleIT)
            </a>
            <a href="https://github.com/auxon" target="_blank" rel="noopener noreferrer">
              GitHub (Richard Hein)
            </a>
            <a href="/privacy.html">Privacy</a>
            <a href="/tos.html">Terms</a>
          </div>
        </div>
      </div>
    </section>
  )
}
