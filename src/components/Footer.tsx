import { ArrowUpRight } from 'lucide-react'
import { Button } from 'prism'
import { links, site } from '../data/site'
import { useLang } from '../lib/i18n'
import type { Copy } from '../data/copy'
import axolote from '../assets/images/axolote.png'

function FooterColumn({ col }: { col: Copy['footer']['cols'][number] }) {
  return (
    <div className="footer-col">
      <span className="footer-head">{col.head}</span>
      {col.links.map((link) => (
        <a
          key={link.label}
          href={link.href === 'DISCORD' ? links.discord : link.href}
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
  const { c } = useLang()
  const f = c.footer
  return (
    <footer className="footer" id="rodape">
      <div className="container">
        <div className="footer-giant">
          <h2 className="footer-giant-title">
            {f.title[0]}
            <br />
            {f.title[1]}
          </h2>
          <Button
            href={links.discord}
            external
            size="lg"
            label={f.join}
            icon={ArrowUpRight}
            iconPosition="end"
          />
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
          </div>
          {f.cols.map((col) => (
            <FooterColumn key={col.head} col={col} />
          ))}
        </div>

        <hr className="rule footer-rule" />

        <div className="footer-bottom">
          <p className="footer-copy">{c.copyright}</p>
          <p className="footer-meta mono">
            <a href="#inicio" className="footer-top">
              {f.top}
            </a>
          </p>
        </div>
      </div>
    </footer>
  )
}
