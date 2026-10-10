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
          <p className="mono smp-status">
            <span className="led warning" aria-hidden="true" />
            {smp.state}
          </p>
          <ul className="smp-feats">
            {smp.features.map((feat) => (
              <li key={feat} className="chip">
                {feat}
              </li>
            ))}
          </ul>
          <div className="smp-actions">
            <a href="/wiki/" className="btn btn-primary">
              abrir a wiki
            </a>
            <a
              href={links.discord}
              target="_blank"
              rel="noreferrer"
              className="btn btn-ghost"
            >
              acompanhar no discord
            </a>
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
