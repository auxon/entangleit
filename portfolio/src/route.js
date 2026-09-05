import { useEffect, useState } from 'react'

export function normalizePath(pathname) {
  if (!pathname || pathname === '/') return '/'
  return pathname.endsWith('/') ? pathname.slice(0, -1) : pathname
}

export function useRoute() {
  const [path, setPath] = useState(() =>
    typeof window === 'undefined' ? '/' : normalizePath(window.location.pathname)
  )

  useEffect(() => {
    const sync = () => setPath(normalizePath(window.location.pathname))
    window.addEventListener('popstate', sync)
    return () => window.removeEventListener('popstate', sync)
  }, [])

  useEffect(() => {
    const id = window.location.hash.replace('#', '').split('?')[0]
    if (!id) {
      window.scrollTo(0, 0)
      return
    }
    const frame = requestAnimationFrame(() => {
      document.getElementById(id)?.scrollIntoView()
    })
    return () => cancelAnimationFrame(frame)
  }, [path])

  function navigate(href) {
    if (!href) return
    if (/^(https?:|mailto:)/i.test(href)) {
      window.location.assign(href)
      return
    }

    const url = new URL(href, window.location.origin)
    const next = normalizePath(url.pathname)
    const hash = url.hash
    const sectionId = hash.replace('#', '').split('?')[0]
    const dest = next + url.search + hash
    const current = normalizePath(window.location.pathname)

    if (next !== '/' && next !== '/about') {
      window.location.assign(url.pathname + url.search + url.hash)
      return
    }

    if (next === current && hash) {
      window.history.replaceState({}, '', dest)
      document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' })
      window.dispatchEvent(new PopStateEvent('popstate'))
      return
    }

    window.history.pushState({}, '', dest)
    setPath(next)
    if (!hash) window.scrollTo(0, 0)
  }

  return { path, navigate, isAbout: path === '/about' }
}
