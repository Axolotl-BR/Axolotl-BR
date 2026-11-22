import { ArrowUpRight } from 'lucide-react'
import { Section } from '../components/Section'
import { Reveal } from '../components/Reveal'
import { links } from '../data/site'
import { useLang } from '../lib/i18n'

export function About() {
  const { c } = useLang()
  const a = c.about
  return (
    <Section
      id="sobre"
      className="about"
      eyebrow={a.eyebrow}
      title={
        <>
          {a.title[0]}
          <span className="text-accent">{a.title[1]}</span>
        </>
      }
    >
      <div className="community-grid">
        <div className="community-copy">
          <Reveal>
            <p className="lead">{a.p1}</p>
          </Reveal>
          <Reveal delay={100}>
            <p className="community-p">{a.p2}</p>
          </Reveal>
          <Reveal delay={200}>
            <p className="community-strong">{a.strong}</p>
          </Reveal>
          <Reveal delay={300}>
            <p className="community-note">{a.note}</p>
            <a href={links.discord} target="_blank" rel="noreferrer" className="community-cta">
              {a.cta} <ArrowUpRight size={14} aria-hidden="true" />
            </a>
          </Reveal>
        </div>

        <Reveal delay={150} className="community-lista-wrap">
          <ul className="community-lista">
            {a.items.map((item, i) => (
              <li key={item} className="community-item" style={{ ['--i' as string]: i }}>
                <span className="tick" aria-hidden="true" />
                {item}
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </Section>
  )
}
