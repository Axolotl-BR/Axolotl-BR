import { useEffect, useState } from 'react'
import { ArrowUpRight } from 'lucide-react'
import { Badge } from 'prism'
import { Section } from '../components/Section'
import { Reveal } from '../components/Reveal'
import { links } from '../data/site'
import { useLang } from '../lib/i18n'

const GITHUB = 'https://github.com/Axolotl-BR'
const COMET = 'https://ofabiano1.github.io/comet/'

// Status do ALT vem do /api/status (widget do Discord). null = sem checagem.
function useAltOnline(): boolean | null {
  const [alt, setAlt] = useState<boolean | null>(null)
  useEffect(() => {
    let alive = true
    fetch('/api/status')
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        if (alive && d && typeof d.alt === 'boolean') setAlt(d.alt)
      })
      .catch(() => {})
    return () => {
      alive = false
    }
  }, [])
  return alt
}

export function Projects() {
  const { c } = useLang()
  const p = c.projects
  const alt = useAltOnline()

  const status = (id: string) => {
    if (id === 'alt') {
      if (alt === true) return { label: p.online, tone: 'success' as const }
      if (alt === false) return { label: p.offline, tone: 'warning' as const }
      return { label: p.unknown, tone: 'neutral' as const }
    }
    if (id === 'smp') return { label: p.dev, tone: 'warning' as const }
    return { label: p.live, tone: 'success' as const }
  }
  const href = (id: string) =>
    id === 'alt' ? '/projetos.html' : id === 'smp' ? '#smp' : id === 'comet' ? COMET : GITHUB
  const external = (id: string) => id === 'site' || id === 'comet'

  return (
    <Section id="projetos" className="projects" eyebrow={p.eyebrow} title={<>{p.title}</>} lead={p.lead}>
      <ul className="proj-grid">
        {p.items.map((item, i) => {
          const s = status(item.id)
          return (
            <li key={item.id}>
              <Reveal delay={i * 110}>
                <article className="proj-card">
                  <div className="proj-top">
                    <span className="mono proj-kind">{item.kind}</span>
                    <Badge label={s.label} tone={s.tone} size="sm" dot />
                  </div>
                  <h3 className="proj-name">{item.name}</h3>
                  <p className="proj-desc">{item.desc}</p>
                  <a
                    className="proj-link"
                    href={href(item.id)}
                    {...(external(item.id) ? { target: '_blank', rel: 'noreferrer' } : {})}
                  >
                    {item.link} <ArrowUpRight size={14} aria-hidden="true" />
                  </a>
                </article>
              </Reveal>
            </li>
          )
        })}
      </ul>
      <p className="mono proj-foot">
        <a href={links.discord} target="_blank" rel="noreferrer">
          {p.foot}
        </a>
      </p>
    </Section>
  )
}
