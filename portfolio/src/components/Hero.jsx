import React from 'react'

export default function Hero() {
  return (
    <section id="hero" className="hero">
      <div className="hero-bg" aria-hidden="true" />
      <div className="hero-content">
        <p className="hero-greeting">// Hello, I'm</p>
        <h1 className="hero-name">Richard Hein</h1>
        <p className="hero-title">
          Senior AI Engineer & Founder
        </p>
        <p className="hero-company">EntangleIT Inc.</p>
        <p className="hero-location">Greater Ottawa, Canada</p>
        <p className="hero-summary">
          28+ years building scalable applications, AI-driven solutions,
          and blockchain technology.
        </p>
        <div className="hero-cta">
          <a href="#contact" className="btn btn-primary">
            Get in Touch
          </a>
          <a
            href="/resume.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-secondary"
          >
            Resume
          </a>
          <a
            href="https://www.linkedin.com/in/richardhein/"
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-secondary"
          >
            LinkedIn
          </a>
        </div>
      </div>
    </section>
  )
}
