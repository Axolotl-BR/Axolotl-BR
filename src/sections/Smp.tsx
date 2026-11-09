import { Badge, Button } from 'prism'
import { Section } from '../components/Section'
import { Reveal } from '../components/Reveal'
import { smp, links } from '../data/site'
import smpArt from '../assets/images/smp.png'

export function Smp() {
  return (
    <Section
      id="smp"
      eyebrow="minecraft"
      title={<>axolotl smp.</>}
      lead={smp.desc}
      className="smp"
    >
      <div className="smp-spot">
        <Reveal className="smp-copy">
          <div className="smp-status">
            <Badge label={smp.state} tone="warning" dot />
          </div>
          <ul className="smp-feats">
            {smp.features.map((feat) => (
              <li key={feat}>
                <Badge label={feat} size="sm" />
              </li>
            ))}
          </ul>
          <div className="smp-actions">
            <Button href="/wiki/" label="abrir a wiki" />
            <Button
              href={links.discord}
              external
              variant="secondary"
              label="acompanhar no discord"
            />
          </div>
          <p className="mono smp-note">{smp.note}</p>
        </Reveal>
        <Reveal delay={120} className="smp-art">
          <img
            src={smpArt}
            alt="axolote pixelado do Axolotl SMP"
            loading="lazy"
            decoding="async"
          />
        </Reveal>
      </div>
    </Section>
  )
}
