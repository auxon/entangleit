import React from 'react'
import {
  MIGRATION_MAILTO,
  migrationPackages,
  migrationPlatform,
  migrationProcess,
  migrationProof,
} from '../site'

const FIT = [
  'Small and mid-size teams on AWS, Vercel, Heroku, or a traditional host',
  'A site, app, or API that can run on Workers or Pages',
  'Companies that want the move done for them — not a DIY checklist',
  'Workloads where a lower, more predictable bill or lower latency is the goal',
]

export default function CloudflareMigration() {
  return (
    <>
      <section className="offer-hero">
        <div className="offer-hero-grid">
          <div>
            <p className="offer-kicker">EntangleIT · Richard Hein</p>
            <h1 className="offer-h1">Done-for-you Cloudflare migrations.</h1>
            <p className="offer-subhead">
              Move apps, APIs, and sites off costly AWS, Vercel, Heroku, or
              traditional hosting onto Cloudflare. We plan the move, migrate the
              workload, cut over with a rollback plan, and hand you the docs.
            </p>
            <div className="offer-cta">
              <a className="btn btn-primary" href={MIGRATION_MAILTO}>
                Book a free assessment
              </a>
              <a className="offer-text-link" href="#packages">
                See packages
              </a>
            </div>
          </div>
          <aside className="offer-panel" aria-label="Migration process">
            <p className="offer-panel-label">How it runs</p>
            <div className="offer-day-count">
              <strong>5</strong>
              <span>
                steps from
                <br />
                call to handoff
              </span>
            </div>
            <div className="offer-timeline">
              {migrationProcess.map((row) => (
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
            Small and mid-size companies that want off expensive or high-latency
            hosting, without standing up a Cloudflare practice in-house.
          </p>
          <div className="offer-fit-grid">
            {FIT.map((type, i) => (
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
          <h2 className="section-title">What we move</h2>
          <p className="section-lead">
            Apps, APIs, and sites — onto the Cloudflare products that fit the
            workload, not a one-size template.
          </p>
          <div className="skill-tags migration-platform">
            {migrationPlatform.map((item) => (
              <span key={item} className="skill-tag">
                {item}
              </span>
            ))}
          </div>
          <p className="card-footnote">
            Typical savings depend on workload. The assessment compares your
            current bill to a Cloudflare estimate — we do not quote a percentage
            up front.
          </p>
        </div>
      </section>

      <section id="packages" className="section migration-packages">
        <div className="section-inner wide">
          <p className="section-kicker">03 / Packages</p>
          <h2 className="section-title">Starting-at pricing</h2>
          <p className="section-lead">
            Figures are starting points, scoped on the assessment. Typical
            savings depend on workload.
          </p>
          <div className="package-grid">
            {migrationPackages.map((pkg) => (
              <article
                key={pkg.id}
                className={`package-card${pkg.optional ? ' optional' : ''}`}
              >
                <p className="offer-label">{pkg.priceNote}</p>
                <h3>{pkg.name}</h3>
                <p className="migration-feature-price">{pkg.price}</p>
                <p className="offer-copy">{pkg.summary}</p>
                <ul className="package-includes">
                  {pkg.includes.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
                <a
                  className={pkg.optional ? 'btn btn-secondary' : 'btn btn-primary'}
                  href={`${MIGRATION_MAILTO}&body=${encodeURIComponent(`Interested in: ${pkg.name}`)}`}
                >
                  Book a free assessment
                </a>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="section-inner">
          <p className="section-kicker">04 / Process</p>
          <h2 className="section-title">Call, then cut over</h2>
          <ol className="offer-scope-list">
            {migrationProcess.map((step) => (
              <li key={step.when}>
                {step.what}
                <span className="process-detail">{step.detail}</span>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="offer-proof">
        <div className="section-inner">
          <p className="section-kicker">05 / Proof</p>
          <p className="offer-eyebrow">Live on this origin</p>
          <blockquote className="offer-quote">
            Systems EntangleIT already runs on Cloudflare — not invented case studies.
          </blockquote>
          <p className="migration-proof-lead">
            The factory uses the stack it migrates onto. These products are live
            on entangleit.com. Typical savings depend on workload; we do not
            publish fabricated percentages or client testimonials.
          </p>
          <div className="offer-proof-grid migration-proof-grid">
            {migrationProof.map((item) => (
              <a key={item.name} className="offer-proof-card" href={item.href}>
                <strong>{item.name}</strong>
                <span>{item.note}</span>
              </a>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="section-inner offer-footer">
          <h2 className="section-title">
            Book a free 20-minute
            <br />
            assessment call.
          </h2>
          <p className="section-lead">
            We&rsquo;ll decide quickly whether a Cloudflare move is worth it,
            and which package fits. Email is the catch — the form opens your
            mail client.
          </p>
          <a className="btn btn-primary" href={MIGRATION_MAILTO}>
            Book a free assessment
          </a>
        </div>
      </section>
    </>
  )
}
