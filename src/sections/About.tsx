import { ArrowUpRight, Gamepad2, Lightbulb, MessageCircle, Palette, Trophy } from 'lucide-react'
import { Section } from '../components/Section'
import { Reveal } from '../components/Reveal'
import { Typed } from '../components/Typed'
import { links } from '../data/site'
import { useLang } from '../lib/i18n'

const icons = [MessageCircle, Gamepad2, Trophy, Palette, Lightbulb]

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
      <Reveal>
        <Typed file={a.file} lines={[a.p1, a.p2, a.strong, a.note]} />
      </Reveal>

      <ul className="about-cards">
        {a.items.map((item, i) => {
          const Icon = icons[i % icons.length]
          return (
            <li key={item}>
              <Reveal delay={i * 90}>
                <div className="about-card">
                  <span className="about-card-n mono">0{i + 1}</span>
                  <Icon size={22} aria-hidden="true" />
                  <p>{item}</p>
                </div>
              </Reveal>
            </li>
          )
        })}
      </ul>

      <a href={links.discord} target="_blank" rel="noreferrer" className="community-cta">
        {a.cta} <ArrowUpRight size={14} aria-hidden="true" />
      </a>
    </Section>
  )
}
