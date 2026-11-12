import { ArrowUpRight } from 'lucide-react'
import { Badge, Button } from 'prism'
import { Reveal } from '../components/Reveal'
import { DiscordIcon } from '../components/DiscordIcon'
import { NowPlaying } from '../sections/NowPlaying'
import { links, owner } from '../data/site'
import { useLang } from '../lib/i18n'
import smpArt from '../assets/images/smp.png'
import photo from '../assets/images/fabi.jpg'

// as quatro seções viram blocos de uma grade só (bento)
export function Bento() {
  const { c } = useLang()
  const a = c.about
  const d = c.discord
  const s = c.smp
  const f = c.fabi

  return (
    <section className="section v2-bento-section">
      <div className="container v2-bento">
        <Reveal className="v2-tile v2-about">
          <div id="sobre" className="v2-anchor" />
          <p className="eyebrow mono">{a.eyebrow}</p>
          <h2 className="h2">
            {a.title[0]}
            <span className="text-accent">{a.title[1]}</span>
          </h2>
          <p className="lead">{a.p1}</p>
          <p className="community-p">{a.p2}</p>
          <p className="community-strong">{a.strong}</p>
          <ul className="v2-pills">
            {a.items.map((item) => (
              <li key={item}>
                <Badge label={item} size="sm" />
              </li>
            ))}
          </ul>
          <a href={links.discord} target="_blank" rel="noreferrer" className="community-cta">
            {a.cta} <ArrowUpRight size={14} aria-hidden="true" />
          </a>
        </Reveal>

        <Reveal delay={80} className="v2-tile v2-discord">
          <div id="discord" className="v2-anchor" />
          <span className="discord-icon">
            <DiscordIcon size={28} />
          </span>
          <h2 className="h2">{d.title}</h2>
          <p className="lead">{d.p1}</p>
          <Badge label={d.badge} tone="success" dot />
          <Button
            href={links.discord}
            external
            size="lg"
            fullWidth
            label={d.cta}
            icon={ArrowUpRight}
            iconPosition="end"
          />
          <p className="mono discord-hint">{links.discord.replace('https://', '')}</p>
        </Reveal>

        <Reveal delay={80} className="v2-tile v2-smp">
          <div id="smp" className="v2-anchor" />
          <img src={smpArt} alt={s.alt} loading="lazy" decoding="async" className="v2-smp-art" />
          <Badge label={s.state} tone="warning" dot />
          <h2 className="h2">{s.title}</h2>
          <p className="lead">{s.desc}</p>
          <ul className="v2-pills">
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

        <Reveal delay={160} className="v2-tile v2-fabi">
          <div id="fabi" className="v2-anchor" />
          <div className="v2-fabi-head">
            <img
              src={photo}
              alt={f.photoAlt}
              width={96}
              height={96}
              className="fabi-photo"
              loading="lazy"
              decoding="async"
            />
            <div>
              <p className="eyebrow mono">{f.eyebrow}</p>
              <h2 className="h2">{f.title}</h2>
              <p className="mono owner-handle">@{owner.handle}</p>
            </div>
          </div>
          <p className="lead">{f.lead}</p>
          <Button href={links.discord} external variant="secondary" label={f.cta} />
          <hr className="rule owner-rule" />
          <NowPlaying />
        </Reveal>
      </div>
    </section>
  )
}
