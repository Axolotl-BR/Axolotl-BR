import { Badge, Button } from 'prism'
import { Section } from '../components/Section'
import { Reveal } from '../components/Reveal'
import { links } from '../data/site'
import { useLang } from '../lib/i18n'
import smpArt from '../assets/images/smp.png'

export function Smp() {
  const { c } = useLang()
  const s = c.smp
  return (
    <Section id="smp" title={<>{s.title}</>} lead={s.desc} className="smp">
      <div className="smp-spot">
        <Reveal className="smp-copy">
          <div className="smp-status">
            <Badge label={s.state} tone="warning" dot />
          </div>
          <ul className="smp-feats">
            {s.features.map((feat) => (
              <li key={feat}>
                <Badge label={feat} size="sm" />
              </li>
            ))}
          </ul>
          <div className="smp-actions">
            <Button href="/wiki/" label={s.wiki} />
            <Button href={links.discord} external variant="secondary" label={s.follow} />
          </div>
          <p className="mono smp-note">{s.note}</p>
        </Reveal>
        <Reveal delay={120} className="smp-art">
          <img src={smpArt} alt={s.alt} loading="lazy" decoding="async" />
        </Reveal>
      </div>
    </Section>
  )
}
