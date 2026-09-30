import { ArrowUpRight } from 'lucide-react'
import { useState } from 'react'
import { nav, links, site, socials } from '../data/site'
import { eggMessages } from '../lib/easterEggs'

type FooterProps = {
  onEgg: (msg: string) => void
}

export function Footer({ onEgg }: FooterProps) {
  const [clicks, setClicks] = useState(0)

  const poke = () => {
    const next = clicks + 1
    setClicks(next)
    if (next === 3) onEgg(eggMessages.footer)
  }

  return (
    <footer className="footer" id="rodape">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-brand">
            <button
              type="button"
              className="footer-axo"
              onClick={poke}
              aria-label="axolote digital (ele gosta de atenção)"
              title="🫟"
            >
              🫟
            </button>
            <div className="footer-title">{site.brand}</div>
            <p className="footer-tagline">{site.tagline}</p>
          </div>

          <div className="footer-col">
            <span className="footer-head">explorar</span>
            {nav.map((item) => (
              <a key={item.href} href={item.href} className="footer-link">
                {item.label}
              </a>
            ))}
          </div>

          <div className="footer-col">
            <span className="footer-head">espaços</span>
            {socials.map((s) => (
              <a
                key={s.name}
                href={s.href}
                target={s.href.startsWith('http') ? '_blank' : undefined}
                rel="noreferrer"
                className="footer-link"
              >
                {s.name} <ArrowUpRight size={12} aria-hidden="true" />
              </a>
            ))}
          </div>

          <div className="footer-col">
            <span className="footer-head">código</span>
            <a href={links.githubOrg} target="_blank" rel="noreferrer" className="footer-link">
              github
            </a>
            <a href={links.githubSite} target="_blank" rel="noreferrer" className="footer-link">
              este site
            </a>
          </div>
        </div>

        <div className="footer-divider line" aria-hidden="true" />
        <hr className="rule footer-rule" />

        <div className="footer-bottom">
          <p className="footer-copy">{site.copyright}</p>
          <p className="footer-mystery mono">/dev/log: nada por aqui ainda. segura esse axolote.</p>
          <p className="footer-made mono">feito por gente, não por template.</p>
        </div>
      </div>
    </footer>
  )
}