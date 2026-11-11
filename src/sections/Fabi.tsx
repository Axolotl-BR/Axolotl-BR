import { Button, Card } from 'prism'
import { Section } from '../components/Section'
import { Reveal } from '../components/Reveal'
import { NowPlaying } from './NowPlaying'
import { owner, links } from '../data/site'
import { useLang } from '../lib/i18n'
import photo from '../assets/images/fabi.jpg'

export function Fabi() {
  const { c } = useLang()
  const f = c.fabi
  return (
    <Section id="fabi" eyebrow={f.eyebrow} title={<>{f.title}</>} lead={f.lead}>
      <Reveal>
        <div className="owner-card">
          <Card as="article">
            <div className="fabi-top">
              <img
                src={photo}
                alt={f.photoAlt}
                width={96}
                height={96}
                className="fabi-photo"
                loading="lazy"
                decoding="async"
              />
              <p className="mono owner-handle">@{owner.handle}</p>
            </div>
            <ul className="owner-facts">
              {f.facts.map((fact) => (
                <li key={fact} className="owner-fact">
                  <span className="tick" aria-hidden="true" />
                  {fact}
                </li>
              ))}
            </ul>
            <div className="owner-cta">
              <Button href={links.discord} external variant="secondary" label={f.cta} />
            </div>
            <hr className="rule owner-rule" />
            <NowPlaying />
          </Card>
        </div>
      </Reveal>
    </Section>
  )
}
