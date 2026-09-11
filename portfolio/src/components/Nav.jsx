import React, { useState, useEffect } from 'react'

const navItems = [
  { href: '/#products', label: 'Products' },
  { href: '/#factory', label: 'Factory' },
  { href: '/agentpay/', label: 'agentpay' },
  { href: '/x402market/', label: 'x402market' },
  { href: '/x402gateway', label: 'x402gateway' },
  { href: '/vibecoded/', label: 'Vibecoded' },
  { href: '/bitcoinzip/', label: 'BitcoinZip' },
  { href: '/leak/', label: 'Leak' },
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
          EI
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
