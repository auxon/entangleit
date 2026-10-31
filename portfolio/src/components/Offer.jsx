import React from 'react'
import DemoAgent from './DemoAgent'
import MigrationFeature from './MigrationFeature'
import { INSTALL_MAILTO, LOGO, MAILTO, PAY_PATH, STACK_STRIP } from '../site'

const FIT_TYPES = ['Support triage', 'Document Q&A', 'Lead qualification', 'Internal operations']

const SCOPE = [
  '90-minute discovery to pick the one workflow with the highest ROI',
  'Agent built on your data and integrated with your tools',
  'Deployed to your stack with handover docs',
  '30 days of post-launch support',
]

export default function Offer() {
  return (
    <>
      <section className="offer-hero">
        <div className="offer-hero-main">
          <img
            className="offer-logo"
            src={LOGO}
            alt="EntangleIT"
            width="640"
            height="640"
            decoding="async"
          />
          <h1 className="offer-h1">Your agent takes money without you in the loop.</h1>
          <div className="offer-cta">
            <a className="btn btn-primary" href={INSTALL_MAILTO}>
              Book a $750 / 48h install
            </a>
            <a className="offer-text-link" href={PAY_PATH}>
              Demo
            </a>
          </div>
          <div className="stack-strip" aria-label="Agent Economy Stack — what's in the $750 install">
            <p className="stack-strip-title">
              Agent Economy Stack — what&rsquo;s in the $750 install
            </p>
            <ol className="stack-strip-row">
              {STACK_STRIP.map((item, index) => (
                <li key={item.name} className="stack-strip-item">
                  {index > 0 && <span className="stack-strip-arrow" aria-hidden="true">→</span>}
                  <span className="stack-strip-name">{item.name}</span>
                  <span className="stack-strip-role">({item.role})</span>
                </li>
              ))}
            </ol>
          </div>
          <p className="offer-price-line">
            $750 / 48h install · $2,500 / 7-day custom MVP · ReceiptMirror receipts +$99
          </p>
        </div>
      </section>

      <MigrationFeature />

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

      <DemoAgent />

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
