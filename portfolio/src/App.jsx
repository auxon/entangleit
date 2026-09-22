import React, { useEffect } from 'react'
import Hero from './components/Hero'
import About from './components/About'
import Experience from './components/Experience'
import Skills from './components/Skills'
import Products from './components/Products'
import Offer from './components/Offer'
import Archive from './components/Archive'
import Contact from './components/Contact'
import Nav from './components/Nav'
import { useRoute } from './route'
import { SITE_DESCRIPTION, SITE_TITLE, TITLE } from './site'

function setMeta(title, description) {
  document.title = title
  const tag = document.querySelector('meta[name="description"]')
  if (tag) tag.setAttribute('content', description)
}

function Home() {
  useEffect(() => {
    setMeta(SITE_TITLE, SITE_DESCRIPTION)
  }, [])

  return (
    <main>
      <Offer />
      <Contact variant="home" />
    </main>
  )
}

function LabPage() {
  useEffect(() => {
    setMeta(
      'Lab · EntangleIT — live agent-economy products',
      'The EntangleIT lab: every product runs live on this origin — agent wallets, pay-per-call APIs, discovery markets, gateways, and MCP tools.'
    )
  }, [])

  return (
    <main>
      <Hero />
      <Products />
      <Contact variant="lab" />
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
  const { isAbout, isLab, navigate } = useRoute()

  return (
    <>
      <Nav navigate={navigate} />
      {isAbout ? <AboutPage /> : isLab ? <LabPage /> : <Home />}
    </>
  )
}

export default App
