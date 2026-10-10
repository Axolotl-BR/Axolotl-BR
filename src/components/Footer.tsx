import { ArrowUpRight } from 'lucide-react'
import { links, site, footerCols } from '../data/site'
import type { FooterCol } from '../data/site'
import axolote from '../assets/images/axolote.png'

function FooterColumn({ col }: { col: FooterCol }) {
  return (
    <div className="footer-col">
      <span className="footer-head">{col.head}</span>
      {col.links.map((link) => (
        <a
          key={link.label}
          href={link.href}
          target={link.external ? '_blank' : undefined}
          rel={link.external ? 'noreferrer' : undefined}
          className="footer-link"
        >
          {link.label}
        </a>
      ))}
    </div>
  )
}

export function Footer() {
  return (
    <footer className="footer" id="rodape">
      <div className="container">
        <div className="footer-giant">
          <h2 className="footer-giant-title">
            Sua comunidade
            <br />
            na internet.
          </h2>
          <a
            href={links.discord}
            target="_blank"
            rel="noreferrer"
            className="btn btn-primary footer-giant-cta"
          >
            entrar no discord <ArrowUpRight size={15} aria-hidden="true" />
          </a>
        </div>

        <div className="footer-grid">
          <div className="footer-brand">
            <img
              src={axolote}
              alt=""
              width={40}
              height={40}
              className="footer-axolote"
              loading="lazy"
              decoding="async"
            />
            <div className="footer-title">{site.brand}</div>
            <p className="footer-tagline">{site.tagline}</p>
          </div>
          {footerCols.map((col) => (
            <FooterColumn key={col.head} col={col} />
          ))}
        </div>

        <hr className="rule footer-rule" />

        <div className="footer-bottom">
          <p className="footer-copy">{site.copyright}</p>
          <p className="footer-meta mono">
            gerado em {__BUILD_DATE__}
            <span aria-hidden="true"> · </span>
            <a href="#inicio" className="footer-top">
              voltar ao topo ↑
            </a>
          </p>
        </div>
      </div>
    </footer>
  )
}
