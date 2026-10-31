import React, { useState, useEffect } from 'react'
import BrandMark from './BrandMark'

const navItems = [
  { href: '/', label: 'Home' },
  { href: '/pay', label: 'Install' },
  { href: '/lab', label: 'Lab' },
  { href: '/cloudflare-migration', label: 'Migration' },
  { href: '/about', label: 'About' },
]

export default function Nav({ navigate }) {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const go = (href) => {
    navigate(href)
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
          onClick={() => go('/')}
          aria-label="EntangleIT home"
        >
          <BrandMark className="brand-mark nav-mark" size={36} />
        </button>

        <ul className="nav-links">
          {navItems.map(({ href, label }) => (
            <li key={href}>
              <button type="button" onClick={() => go(href)}>{label}</button>
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
        {navItems.map(({ href, label }) => (
          <button key={href} type="button" onClick={() => go(href)}>{label}</button>
        ))}
      </div>
    </nav>
  )
}
