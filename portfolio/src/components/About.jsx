import React from 'react'
import { TITLE, YEARS } from '../site'

export default function About() {
  return (
    <section id="about" className="section">
      <div className="section-inner">
        <p className="section-kicker">{TITLE}</p>
        <h2 className="section-title">Richard Hein</h2>
        <div className="about-content">
          <p>
            Founder of EntangleIT. {YEARS} years building scalable applications,
            AI-driven solutions, and the Cloudflare + Stripe stack shipping on this origin.
          </p>
          <p>
            Greater Ottawa, Canada. Full-stack software developer and cloud architect —
            Workers, Checkout, webhooks, Durable Objects, and the products above the résumé.
          </p>
          <p>
            Technical lead for LLM RAG systems when the job needs it, from UI through
            middleware to backend. The paid work now is getting Stripe live on Cloudflare.
          </p>
        </div>
      </div>
    </section>
  )
}
