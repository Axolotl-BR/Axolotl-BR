import { ArrowUpRight } from 'lucide-react'
import { useState } from 'react'
import { Button } from 'prism'
import { links } from '../data/site'
import { eggMessages } from '../lib/easterEggs'
import { useLang } from '../lib/i18n'
import axolote from '../assets/images/axolote.png'

// hero em duas colunas: texto à esquerda, axolote em moldura à direita
export function HeroV2({ onEgg }: { onEgg: (msg: string) => void }) {
  const [pokes, setPokes] = useState(0)
  const { c } = useLang()
  const h = c.hero

  const poke = () => {
    const next = pokes + 1
    setPokes(next)
    if (next === 3) {
      setPokes(0)
      onEgg(eggMessages.mascot)
    }
  }

  return (
    <section id="inicio" className="v2-hero">
      <div className="container v2-hero-grid">
        <div className="v2-hero-copy">
          <p className="hero-kicker mono reveal" style={{ ['--reveal-delay' as string]: '0ms' }}>
            {h.kicker}
          </p>
          <h1 className="h1 v2-hero-title reveal" style={{ ['--reveal-delay' as string]: '100ms' }}>
            Axolotl
            <br />
            BR<span className="hero-dot" aria-hidden="true">.</span>
          </h1>
          <p className="hero-tagline reveal" style={{ ['--reveal-delay' as string]: '200ms' }}>
            {h.tagline}
          </p>
          <div className="hero-actions reveal" style={{ ['--reveal-delay' as string]: '280ms' }}>
            <Button
              href={links.discord}
              external
              size="lg"
              label={h.join}
              icon={ArrowUpRight}
              iconPosition="end"
            />
            <Button href="#sobre" size="lg" variant="secondary" label={h.about} />
          </div>
        </div>

        <div className="v2-hero-art reveal" style={{ ['--reveal-delay' as string]: '200ms' }}>
          <button type="button" className="v2-axolote" onClick={poke} aria-label={h.mascotAria}>
            <img src={axolote} alt="" width={220} height={220} loading="eager" decoding="async" />
          </button>
          <ul className="v2-chips" aria-hidden="true">
            {c.chips.map((chip, i) => (
              <li key={chip} className="v2-chip mono" style={{ ['--i' as string]: i }}>
                {chip}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}
