import { Section } from '../components/Section'
import { Reveal } from '../components/Reveal'
import { links } from '../data/site'

const vibe = [
  'conversa boa',
  'jogos juntos',
  'eventos',
  'ajuda quando precisa',
  'amizade de internet',
]

export function About() {
  return (
    <Section
      id="sobre"
      eyebrow="sobre nós"
      title={
        <>
          feito de <span className="text-accent">player para player.</span>
        </>
      }
      lead="Sem empresa por trás, sem roteiro. Gente que joga junto, cria coisa e aparece todo dia."
    >
      <div className="community-grid">
        <div className="community-copy">
          <Reveal>
            <p className="lead">
              Todo mundo pode entrar, todo mundo pode criar, e ninguém precisa pedir permissão pra
              ter ideia.
            </p>
          </Reveal>
          <Reveal delay={100}>
            <p className="community-note">
              não é sobre ser o maior. é sobre ser um lugar onde dá vontade de ficar.
            </p>
          </Reveal>
          <Reveal delay={160}>
            <a
              href={links.discord}
              target="_blank"
              rel="noreferrer"
              className="community-cta mono"
            >
              entrar no discord
            </a>
          </Reveal>
        </div>

        <Reveal delay={150} className="community-lista-wrap">
          <ul className="community-lista">
            {vibe.map((item) => (
              <li key={item} className="community-item">
                <span className="tick mono" aria-hidden="true">
                  ▸
                </span>
                {item}
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </Section>
  )
}
