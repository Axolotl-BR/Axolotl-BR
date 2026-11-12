import { useCallback, useMemo, useState } from 'react'
import { Menu, X } from 'lucide-react'
import { Button } from 'prism'
import { links, site } from '../data/site'
import { useLang } from '../lib/i18n'
import { LangSwitch } from './LangSwitch'
import { ThemeSwitch } from './ThemeSwitch'
import { useScrollSpy } from '../hooks/useScrollSpy'
import { useScrolled } from '../hooks/useScrolled'
import { useEscapeKey } from '../hooks/useEscapeKey'
import { useScrollProgress } from '../hooks/useScrollProgress'
import { useBodyLock } from '../hooks/useBodyLock'
import { MobileMenu } from './MobileMenu'
import wordmark from '../assets/images/wordmark.png'

function DesktopLinks({ active }: { active: string }) {
  const { c } = useLang()
  return (
    <nav className="nav-links" aria-label={c.navAria}>
      {c.nav.map((item) => {
        const id = item.href.slice(1)
        const isActive = active === id
        return (
          <a
            key={item.href}
            href={item.href}
            className={`nav-link ${isActive ? 'is-active' : ''}`}
            aria-current={isActive ? 'location' : undefined}
          >
            {item.label}
          </a>
        )
      })}
    </nav>
  )
}

export function Navbar() {
  const [open, setOpen] = useState(false)
  const { c } = useLang()
  const scrolled = useScrolled()
  const progress = useScrollProgress()
  const ids = useMemo(() => c.nav.map((n) => n.href.slice(1)), [c])
  const active = useScrollSpy(ids)

  const close = useCallback(() => setOpen(false), [])
  useEscapeKey(close)
  useBodyLock(open)

  return (
    <header className={`nav ${scrolled || open ? 'nav-scrolled' : ''}`}>
      <div
        className="nav-progress"
        style={{ width: `${progress * 100}%` }}
        aria-hidden="true"
      />
      <div className="nav-inner container">
        <a href="#inicio" className="nav-logo" aria-label={`${site.brand} · início`}>
          <img
            src={wordmark}
            alt={site.brand}
            className="nav-logo-img"
            loading="eager"
            decoding="async"
          />
        </a>
        <DesktopLinks active={active} />
        <div className="nav-tools">
          <LangSwitch />
          <ThemeSwitch />
        </div>
        <span className="nav-cta">
          <Button href={links.discord} external size="sm" label="Discord" />
        </span>
        <button
          className="nav-toggle"
          aria-expanded={open}
          aria-controls="nav-menu"
          aria-label={open ? c.menuClose : c.menuOpen}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>
      <MobileMenu open={open} onClose={close} />
    </header>
  )
}
