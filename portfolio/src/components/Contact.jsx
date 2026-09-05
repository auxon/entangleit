import React, { useEffect, useState } from 'react'
import { EMAIL, LINKEDIN, MAILTO, RESUME } from '../site'

const offerOptions = [
  { value: 'install', label: '$750 WitnessCam or SignFlow install (48h)' },
  { value: 'week', label: '$2,500 custom CF + Stripe week' },
  { value: 'other', label: 'Something else' },
]

function offerFromLocation() {
  if (typeof window === 'undefined') return 'install'
  const fromQuery = new URLSearchParams(window.location.search).get('offer')
  const fromHash = new URLSearchParams(window.location.hash.split('?')[1] || '').get('offer')
  const value = fromQuery || fromHash
  return offerOptions.some((o) => o.value === value) ? value : 'install'
}

export default function Contact({ variant = 'home' }) {
  const [offer, setOffer] = useState(offerFromLocation)
  const [sent, setSent] = useState(false)

  useEffect(() => {
    const sync = () => setOffer(offerFromLocation())
    const onOffer = (event) => {
      if (event.detail) setOffer(event.detail)
    }
    window.addEventListener('hashchange', sync)
    window.addEventListener('popstate', sync)
    window.addEventListener('card-offer', onOffer)
    return () => {
      window.removeEventListener('hashchange', sync)
      window.removeEventListener('popstate', sync)
      window.removeEventListener('card-offer', onOffer)
    }
  }, [])

  const handleSubmit = (event) => {
    event.preventDefault()
    const data = new FormData(event.target)
    const selected = offerOptions.find((o) => o.value === data.get('offer'))
    const subject = encodeURIComponent(`CARD — ${selected?.label || data.get('offer')} — ${data.get('name')}`)
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
              ? 'Email is the catch. Installs, custom weeks, or anything else.'
              : 'Book a $750 install or a $2,500 week. Email is the catch — the form opens your mail client.'}
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
              <textarea name="message" rows="4" required placeholder="What needs to go live?" />
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
            <a href={RESUME} target="_blank" rel="noopener noreferrer">
              Resume (PDF)
            </a>
            <a href={LINKEDIN} target="_blank" rel="noopener noreferrer">
              LinkedIn
            </a>
            <a href="https://github.com/EntangleIT" target="_blank" rel="noopener noreferrer">
              GitHub (EntangleIT)
            </a>
            <a href="https://github.com/auxon" target="_blank" rel="noopener noreferrer">
              GitHub (Richard Hein)
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
