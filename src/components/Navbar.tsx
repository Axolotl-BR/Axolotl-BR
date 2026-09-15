import { useEffect, useState } from 'react'
import { Menu, X, ArrowUpRight } from 'lucide-react'
import { nav, links, site } from '../data/site'
import { useScrollSpy } from '../hooks/useScrollSpy'

export function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const [progress, setProgress] = useState(0)
  const active = useScrollSpy(nav.map((n) => n.href.slice(1)))

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  useEffect(() => {
    let raf = 0
    const onScroll = () => {
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(() => {
        const doc = document.documentElement
        const max = doc.scrollHeight - doc.clientHeight
        setProgress(max > 0 ? Math.min(1, doc.scrollTop / max) : 0)
      })
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [])

  useEffect(() => {
    if (!open) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = prev
    }
  }, [open])

  const close = () => setOpen(false)

  return (
    <header className={`nav ${scrolled || open ? 'nav-scrolled' : ''}`}>
      <div
        className="nav-progress"
        style={{ width: `${progress * 100}%` }}
        aria-hidden="true"
      />

      <div className="nav-inner container">
        <a href="#hub" className="nav-logo" aria-label={`${site.brand} — início`}>
          <span className="nav-logo-mark" aria-hidden="true">
            🫟
          </span>
          <span className="nav-logo-text">
            {site.brand} <em className="nav-logo-sub">HUB</em>
          </span>
        </a>

        <nav className="nav-links" aria-label="Navegação principal">
          {nav.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className={`nav-link ${active === item.href.slice(1) ? 'is-active' : ''}`}
              aria-current={active === item.href.slice(1) ? 'true' : undefined}
            >
              {item.label}
            </a>
          ))}
        </nav>

        <a href={links.discord} target="_blank" rel="noreferrer" className="btn btn-primary nav-cta">
          DISCORD <ArrowUpRight size={14} aria-hidden="true" />
        </a>

        <button
          className="nav-toggle"
          aria-expanded={open}
          aria-controls="nav-menu"
          aria-label={open ? 'Fechar menu' : 'Abrir menu'}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      <div id="nav-menu" className={`nav-menu ${open ? 'is-open' : ''}`}>
        <nav aria-label="Navegação mobile">
          {nav.map((item, i) => (
            <a
              key={item.href}
              href={item.href}
              onClick={close}
              className="nav-menu-link"
              style={{ ['--i' as string]: i }}
            >
              <span className="mono">//</span> {item.label}
            </a>
          ))}
          <a
            href={links.discord}
            target="_blank"
            rel="noreferrer"
            onClick={close}
            className="nav-menu-link nav-menu-cta"
          >
            DISCORD <ArrowUpRight size={14} aria-hidden="true" />
          </a>
        </nav>
      </div>
    </header>
  )
}