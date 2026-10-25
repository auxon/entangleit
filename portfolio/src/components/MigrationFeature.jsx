import React from 'react'
import {
  MIGRATION_MAILTO,
  MIGRATION_PATH,
  migrationPackages,
} from '../site'

const featuredPackages = migrationPackages.filter((pkg) => !pkg.optional)

export default function MigrationFeature() {
  return (
    <section id="cloudflare-migration" className="migration-feature" aria-labelledby="migration-feature-title">
      <div className="migration-feature-inner">
        <p className="section-kicker">Also from EntangleIT</p>
        <h2 id="migration-feature-title" className="section-title">
          Done-for-you Cloudflare migration
        </h2>
        <p className="section-lead">
          Move apps, APIs, and sites off costly AWS, Vercel, Heroku, or traditional
          hosting onto Cloudflare — Workers, Pages, D1, R2, KV, Durable Objects,
          Queues, and Workers AI — to cut hosting bills and latency.
        </p>
        <div className="offer-cta">
          <a className="btn btn-primary" href={MIGRATION_MAILTO}>
            Book a free assessment
          </a>
          <a className="btn btn-secondary" href={MIGRATION_PATH}>
            See packages and process
          </a>
        </div>
        <div className="migration-feature-grid">
          {featuredPackages.map((pkg) => (
            <article key={pkg.id} className="migration-feature-card">
              <p className="offer-label">{pkg.priceNote}</p>
              <h3>{pkg.name}</h3>
              <p className="migration-feature-price">{pkg.price}</p>
              <p>{pkg.summary}</p>
            </article>
          ))}
        </div>
        <p className="card-footnote">
          Prices are starting-at figures and easy to revise for scope. Typical
          savings depend on workload — the assessment compares your current bill
          to a Cloudflare estimate. Optional monthly care plan after cutover.
        </p>
      </div>
    </section>
  )
}
