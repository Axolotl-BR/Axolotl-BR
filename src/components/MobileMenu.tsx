import { links } from '../data/site'
import { useLang } from '../lib/i18n'

type MobileMenuProps = {
  open: boolean
  onClose: () => void
}

export function MobileMenu({ open, onClose }: MobileMenuProps) {
  const { c } = useLang()
  return (
    <div id="nav-menu" className={`nav-menu ${open ? 'is-open' : ''}`}>
      <nav aria-label={c.navAria}>
        {c.nav.map((item, i) => (
          <a
            key={item.href}
            href={item.href}
            onClick={onClose}
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
          onClick={onClose}
          className="nav-menu-link nav-menu-cta"
        >
          Discord
        </a>
      </nav>
    </div>
  )
}
