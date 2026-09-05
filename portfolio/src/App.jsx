import React, { useEffect } from 'react'
import Hero from './components/Hero'
import About from './components/About'
import Experience from './components/Experience'
import Skills from './components/Skills'
import Products from './components/Products'
import Card from './components/Card'
import Archive from './components/Archive'
import Contact from './components/Contact'
import Nav from './components/Nav'
import { useRoute } from './route'
import { TITLE } from './site'

function setMeta(title, description) {
  document.title = title
  const tag = document.querySelector('meta[name="description"]')
  if (tag) tag.setAttribute('content', description)
}

function Home({ navigate }) {
  useEffect(() => {
    setMeta(
      `EntangleIT — Stripe on Cloudflare`,
      `Need Stripe on Cloudflare this week? Founder, EntangleIT. $750 WitnessCam or SignFlow install in 48 hours, $2,500 custom CF+Stripe week, or $149 DIY.`
    )
  }, [])

  return (
    <main>
      <Hero navigate={navigate} />
      <Products />
      <Card navigate={navigate} />
      <Contact variant="home" />
    </main>
  )
}

function AboutPage() {
  useEffect(() => {
    setMeta(
      `About · Richard Hein · EntangleIT`,
      `Richard Hein, ${TITLE}. Timeline, skills, and older projects.`
    )
  }, [])

  return (
    <main className="page-about">
      <About />
      <Experience />
      <Skills />
      <Archive />
      <Contact variant="about" />
    </main>
  )
}

function App() {
  const { isAbout, navigate } = useRoute()

  return (
    <>
      <Nav navigate={navigate} />
      {isAbout ? <AboutPage /> : <Home navigate={navigate} />}
    </>
  )
}

export default App
