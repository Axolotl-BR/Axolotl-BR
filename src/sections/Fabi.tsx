import { Button, Card } from 'prism'
import { Section } from '../components/Section'
import { Reveal } from '../components/Reveal'
import { owner, links } from '../data/site'
import photo from '../assets/images/fabi.jpg'

export function Fabi() {
  return (
    <Section
      id="fabi"
      eyebrow="eu"
      title={<>{owner.name}.</>}
      lead="Fundei essa comunidade em 2020 e tô no Discord todo dia. Se algo quebrou, a culpa é minha. Se funciona, também."
    >
      <Reveal>
        <div className="owner-card">
          <Card as="article">
            <div className="fabi-top">
              <img
                src={photo}
                alt="foto do fabi"
                width={96}
                height={96}
                className="fabi-photo"
                loading="lazy"
                decoding="async"
              />
              <p className="mono owner-handle">@{owner.handle}</p>
            </div>
            <ul className="owner-facts">
              {owner.facts.map((fact) => (
                <li key={fact} className="owner-fact">
                  <span className="tick mono" aria-hidden="true">
                    ▸
                  </span>
                  {fact}
                </li>
              ))}
            </ul>
            <div>
              <Button
                href={links.discord}
                external
                variant="secondary"
                label="fala comigo no discord"
              />
            </div>
          </Card>
        </div>
      </Reveal>
    </Section>
  )
}
