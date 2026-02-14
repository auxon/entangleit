import React from 'react'

export default function Contact() {
  return (
    <section id="contact" className="section contact">
      <div className="section-inner">
        <h2 className="section-title">Get in Touch</h2>
        <div className="contact-content">
          <p>
            Interested in AI, blockchain, or full-stack development? I'm always open to
            discussing new opportunities and interesting projects.
          </p>
          <div className="contact-links">
            <a
              href="/resume.pdf"
              target="_blank"
              rel="noopener noreferrer"
            >
              Resume (PDF)
            </a>
            <a
              href="https://www.linkedin.com/in/richardhein/"
              target="_blank"
              rel="noopener noreferrer"
            >
              LinkedIn
            </a>
            <a
              href="https://github.com/richardhein"
              target="_blank"
              rel="noopener noreferrer"
            >
              GitHub
            </a>
            <a href="https://entangleit.com" target="_blank" rel="noopener noreferrer">
              EntangleIT
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
