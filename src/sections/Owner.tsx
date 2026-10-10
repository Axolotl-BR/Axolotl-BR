import { Section } from '../components/Section'
import { Reveal } from '../components/Reveal'
import { owner, links } from '../data/site'

export function Owner() {
  return (
    <Section
      id="dono"
      eyebrow="o dono"
      title={<>{owner.name}.</>}
      lead="Toda comunidade tem um dono. Aqui é o fabi. Se algo quebrou, a culpa é dele. Se algo funciona, também."
    >
      <Reveal>
        <div className="owner-card panel">
          <p className="mono owner-handle">@{owner.handle}</p>
          <ul className="owner-facts">
            {owner.facts.map((f) => (
              <li key={f} className="owner-fact">
                <span className="tick mono" aria-hidden="true">
                  ▸
                </span>
                {f}
              </li>
            ))}
          </ul>
          <a
            href={links.discord}
            target="_blank"
            rel="noreferrer"
            className="btn btn-ghost owner-cta"
          >
            falar com ele no discord
          </a>
        </div>
      </Reveal>
    </Section>
  )
}
