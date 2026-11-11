import { ArrowUpRight } from 'lucide-react'
import { useState } from 'react'
import { Button } from 'prism'
import { site, links } from '../data/site'
import { useLang } from '../lib/i18n'
import { eggMessages } from '../lib/easterEggs'
import axolote from '../assets/images/axolote.png'

type HeroProps = {
  onEgg: (msg: string) => void
}

export function Hero({ onEgg }: HeroProps) {
  const [pokes, setPokes] = useState(0)
  const { c } = useLang()
  const h = c.hero

  const pokeAxolote = () => {
    const next = pokes + 1
    setPokes(next)
    if (next === 3) {
      setPokes(0)
      onEgg(eggMessages.mascot)
    }
  }

  return (
    <section className="hero">
      <div className="container hero-inner">
        <button
          type="button"
          className="hero-axolote reveal"
          style={{ ['--reveal-delay' as string]: '0ms' }}
          onClick={pokeAxolote}
          aria-label={h.mascotAria}
        >
          <img src={axolote} alt="" width={88} height={88} loading="eager" decoding="async" />
        </button>

        <p className="hero-kicker mono reveal" style={{ ['--reveal-delay' as string]: '40ms' }}>
          {h.kicker}
        </p>

        <h1 className="h1 hero-title reveal" style={{ ['--reveal-delay' as string]: '120ms' }}>
          {site.product}
          <span className="hero-dot" aria-hidden="true">.</span>
        </h1>

        <p className="hero-tagline reveal" style={{ ['--reveal-delay' as string]: '220ms' }}>
          {h.tagline}
        </p>

        <div className="hero-actions reveal" style={{ ['--reveal-delay' as string]: '300ms' }}>
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

        <a href="#sobre" className="scroll-cue hero-scroll" aria-label={h.scrollAria}>
          <span>{h.scroll}</span>
          <span className="line" />
        </a>
      </div>
    </section>
  )
}
