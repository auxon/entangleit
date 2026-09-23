import React from 'react'
import { MAILTO } from '../site'

const FIT_TYPES = ['Support triage', 'Document Q&A', 'Lead qualification', 'Internal operations']

const SCOPE = [
  '90-minute discovery to pick the one workflow with the highest ROI',
  'Agent built on your data and integrated with your tools',
  'Deployed to your stack with handover docs',
  '30 days of post-launch support',
]

const TIMELINE = [
  { when: 'DAY 0', what: 'Discover the highest-ROI workflow' },
  { when: '01–10', what: 'Build on your data and tools' },
  { when: '11–14', what: 'Deploy, test, and hand over' },
  { when: '+30', what: 'Post-launch support included' },
]

export default function Offer() {
  return (
    <>
      <section className="offer-hero">
        <div className="offer-hero-grid">
          <div>
            <p className="offer-kicker">One useful agent. Live in two weeks.</p>
            <h1 className="offer-h1">A production AI agent, working in your business in 14 days.</h1>
            <p className="offer-subhead">
              I design, build, and deploy a custom AI agent on your data and your
              workflows — in Slack, on your site, or inside your app. Fixed price.
              You own everything.
            </p>
            <div className="offer-cta">
              <a className="btn btn-primary" href={MAILTO}>
                Book a 20-minute fit call
              </a>
              <a className="offer-text-link" href="#audit">
                Start with an audit
              </a>
            </div>
          </div>
          <aside className="offer-panel" aria-label="Fourteen-day delivery plan">
            <p className="offer-panel-label">Build window</p>
            <div className="offer-day-count">
              <strong>14</strong>
              <span>
                days to
                <br />
                production
              </span>
            </div>
            <div className="offer-timeline">
              {TIMELINE.map((row) => (
                <div key={row.when} className="offer-timeline-row">
                  <time>{row.when}</time>
                  <p>{row.what}</p>
                </div>
              ))}
            </div>
          </aside>
        </div>
      </section>

      <section className="section">
        <div className="section-inner">
          <p className="section-kicker">01 / Fit</p>
          <h2 className="section-title">Who it&rsquo;s for</h2>
          <p className="section-lead">
            Teams drowning in repetitive knowledge work — support triage, document
            Q&amp;A, lead qualification, internal ops.
          </p>
          <div className="offer-fit-grid">
            {FIT_TYPES.map((type, i) => (
              <div key={type} className="offer-fit-card">
                <span>{String(i + 1).padStart(2, '0')}</span>
                {type}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="section-inner">
          <p className="section-kicker">02 / Scope</p>
          <h2 className="section-title">What&rsquo;s included</h2>
          <ol className="offer-scope-list">
            {SCOPE.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ol>
        </div>
      </section>

      <section className="offer-proof">
        <div className="section-inner">
          <p className="section-kicker">03 / Proof</p>
          <p className="offer-eyebrow">Live systems, not demos</p>
          <blockquote className="offer-quote">
            Production agents built for Roofstock and Cognilore.
          </blockquote>
          <div className="offer-proof-grid">
            <div className="offer-proof-card">
              <strong>Roofstock</strong>
              <span>Real estate · 2 production agents</span>
            </div>
            <div className="offer-proof-card">
              <strong>Cognilore</strong>
              <span>Digital publishing · RAG chatbot</span>
            </div>
          </div>
        </div>
      </section>

      <section className="offer-commercial" aria-label="Engagement options">
        <div className="offer-commercial-grid">
          <div className="offer-build">
            <p className="offer-label">Production agent build</p>
            <p className="offer-price">
              From $12,500<small>Fixed price · No hourly meter</small>
            </p>
            <p className="offer-copy">
              A focused engagement from discovery through production, with the code,
              deployment, documentation, and support included.
            </p>
            <a className="btn btn-primary" href={MAILTO}>
              Book a 20-minute fit call
            </a>
          </div>
          <div className="offer-audit" id="audit">
            <p className="offer-label">A smaller first step</p>
            <h2 className="offer-audit-title">AI Opportunity Audit — $1,500</h2>
            <p className="offer-copy">
              A 90-minute working session finding the 3 places an AI agent pays for
              itself in your business, with a written report.
            </p>
            <p className="offer-credit">Credited in full toward a build.</p>
            <a className="btn btn-secondary" href={MAILTO}>
              Book the audit
            </a>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="section-inner offer-footer">
          <h2 className="section-title">
            Bring the workflow.
            <br />
            Leave with a production plan.
          </h2>
          <p className="section-lead">
            Start with a 20-minute fit call. We&rsquo;ll decide quickly whether
            there&rsquo;s a useful, high-ROI agent to build.
          </p>
          <a className="btn btn-primary" href={MAILTO}>
            Book a 20-minute fit call
          </a>
        </div>
      </section>
    </>
  )
}
