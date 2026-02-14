import React, { useState, useEffect } from 'react'

const navItems = [
  { id: 'hero', label: 'Home' },
  { id: 'about', label: 'About' },
  { id: 'experience', label: 'Experience' },
  { id: 'skills', label: 'Skills' },
  { id: 'projects', label: 'Projects' },
  { id: 'contact', label: 'Contact' },
]

export default function Nav() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
    setMobileOpen(false)
  }

  return (
    <nav
      className={`nav ${scrolled ? 'scrolled' : ''}`}
      role="navigation"
    >
      <div className="nav-inner">
        <button
          className="nav-logo"
          onClick={() => scrollTo('hero')}
          aria-label="Go to top"
        >
          RH
        </button>

        <ul className="nav-links">
          {navItems.map(({ id, label }) => (
            <li key={id}>
              <button onClick={() => scrollTo(id)}>{label}</button>
            </li>
          ))}
        </ul>

        <button
          className={`nav-toggle ${mobileOpen ? 'open' : ''}`}
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
          aria-expanded={mobileOpen}
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>

      <div className={`nav-mobile ${mobileOpen ? 'open' : ''}`}>
        {navItems.map(({ id, label }) => (
          <button key={id} onClick={() => scrollTo(id)}>{label}</button>
        ))}
      </div>

      <style>{`
        .nav {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          z-index: 100;
          padding: 1rem 2rem;
          transition: background 0.3s ease, backdrop-filter 0.3s ease;
        }

        .nav.scrolled {
          background: rgba(10, 10, 11, 0.9);
          backdrop-filter: blur(12px);
          border-bottom: 1px solid var(--border);
        }

        .nav-inner {
          max-width: 1200px;
          margin: 0 auto;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .nav-logo {
          font-family: var(--font-display);
          font-weight: 700;
          font-size: 1.25rem;
          color: var(--accent);
          background: none;
          border: none;
          cursor: pointer;
          padding: 0.5rem;
        }

        .nav-logo:hover {
          color: var(--text-primary);
        }

        .nav-links {
          display: flex;
          gap: 2rem;
          list-style: none;
        }

        .nav-links button {
          font-family: var(--font-mono);
          font-size: 0.85rem;
          color: var(--text-secondary);
          background: none;
          border: none;
          cursor: pointer;
          padding: 0.25rem;
          transition: color 0.2s;
        }

        .nav-links button:hover {
          color: var(--accent);
        }

        .nav-toggle {
          display: none;
          flex-direction: column;
          gap: 5px;
          background: none;
          border: none;
          cursor: pointer;
          padding: 0.5rem;
        }

        .nav-toggle span {
          width: 24px;
          height: 2px;
          background: var(--text-primary);
          transition: transform 0.3s, opacity 0.3s;
        }

        .nav-toggle.open span:nth-child(1) {
          transform: rotate(45deg) translate(5px, 5px);
        }

        .nav-toggle.open span:nth-child(2) {
          opacity: 0;
        }

        .nav-toggle.open span:nth-child(3) {
          transform: rotate(-45deg) translate(5px, -5px);
        }

        .nav-mobile {
          display: none;
          flex-direction: column;
          gap: 1rem;
          padding: 2rem;
          background: var(--bg-secondary);
          border-bottom: 1px solid var(--border);
        }

        .nav-mobile.open {
          display: flex;
        }

        .nav-mobile button {
          font-family: var(--font-mono);
          font-size: 1rem;
          color: var(--text-secondary);
          background: none;
          border: none;
          cursor: pointer;
          text-align: left;
          padding: 0.5rem;
        }

        .nav-mobile button:hover {
          color: var(--accent);
        }

        @media (max-width: 768px) {
          .nav-links {
            display: none;
          }

          .nav-toggle {
            display: flex;
          }
        }
      `}</style>
    </nav>
  )
}
