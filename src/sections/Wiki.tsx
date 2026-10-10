import { Section } from '../components/Section'
import { Reveal } from '../components/Reveal'

const wikiLinks = [
  {
    index: '01',
    name: 'wiki do smp',
    desc: 'mundos, sistemas e lore · o mapa do que vem aí',
    href: '/wiki.html',
  },
  {
    index: '02',
    name: 'regras',
    desc: 'pouca regra, regra clara · vale no Discord e no smp',
    href: '/regras.html',
  },
  {
    index: '03',
    name: 'como entrar',
    desc: 'o passo a passo pra quando o servidor abrir',
    href: '/smp.html#entrar',
  },
]

export function Wiki() {
  return (
    <Section
      id="wiki"
      eyebrow="wiki"
      title={<>a wiki do smp.</>}
      lead="Tudo do servidor num lugar só · sem mecânica inventada, só o que já está decidido."
    >
      <div className="wiki-list">
        {wikiLinks.map((item, i) => (
          <Reveal key={item.name} delay={i * 70}>
            <a href={item.href} className="wiki-row">
              <span className="wiki-index mono" aria-hidden="true">
                {item.index}
              </span>
              <span className="wiki-text">
                <span className="wiki-name">{item.name}</span>
                <span className="wiki-desc">{item.desc}</span>
              </span>
              <span className="wiki-go" aria-hidden="true">
                →
              </span>
            </a>
          </Reveal>
        ))}
      </div>
    </Section>
  )
}
