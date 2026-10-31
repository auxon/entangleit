import React from 'react'
import AgentStack from './AgentStack'
import BrandMark from './BrandMark'
import { INSTALL_CTA, PAY_PATH } from '../site'

export default function Home({ navigate }) {
  return (
    <>
      <section id="hero" className="home-hero">
        <div className="home-hero-bg" aria-hidden="true" />
        <div className="home-hero-content">
          <BrandMark className="brand-mark home-logo" size={280} />
          <h1 className="home-headline">Your agent takes money without you in the loop</h1>
          <div className="home-cta">
            <button type="button" className="btn btn-primary" onClick={() => navigate(PAY_PATH)}>
              {INSTALL_CTA}
            </button>
          </div>
        </div>
      </section>
      <AgentStack />
    </>
  )
}
