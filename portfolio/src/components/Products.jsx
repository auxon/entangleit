import React from 'react'
import { liveProducts } from '../site'

export default function Products() {
  return (
    <section id="products" className="section">
      <div className="section-inner wide">
        <h2 className="section-title">Live proof</h2>
        <p className="section-lead">
          Shipping on this origin. Leak first — free diagnosis, then the rest of the stack.
        </p>
        <div className="products-grid">
          {liveProducts.map((product) => (
            <article
              key={product.name}
              className={`project-card ${product.lead ? 'lead' : ''}`}
            >
              <div className="card-heading">
                <h3>{product.name}</h3>
                {product.badge && <span className="card-badge">{product.badge}</span>}
              </div>
              <p>{product.description}</p>
              <div className="project-tech">
                {product.tech.map((t) => (
                  <span key={t}>{t}</span>
                ))}
              </div>
              <a href={product.href} className="project-link">
                Open {product.name} →
              </a>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
