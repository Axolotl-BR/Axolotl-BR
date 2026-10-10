import { ArrowUpRight } from 'lucide-react'
import { useState } from 'react'
import { site, links } from '../data/site'
import { eggMessages } from '../lib/easterEggs'
import axolote from '../assets/images/axolote.png'

type HeroProps = {
  onEgg: (msg: string) => void
}

export function Hero({ onEgg }: HeroProps) {
  const [pokes, setPokes] = useState(0)

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
          aria-label="o axolote da comunidade (ele gosta de atenção)"
        >
          <img src={axolote} alt="" width={88} height={88} loading="eager" decoding="async" />
        </button>

        <p className="hero-kicker mono reveal" style={{ ['--reveal-delay' as string]: '40ms' }}>
          de player para player · desde 2020
        </p>

        <h1 className="h1 hero-title reveal" style={{ ['--reveal-delay' as string]: '120ms' }}>
          {site.product}
          <span className="hero-dot" aria-hidden="true">.</span>
        </h1>

        <p className="hero-tagline reveal" style={{ ['--reveal-delay' as string]: '220ms' }}>
          {site.tagline}
        </p>

        <div className="hero-actions reveal" style={{ ['--reveal-delay' as string]: '300ms' }}>
          <a href={links.discord} target="_blank" rel="noreferrer" className="btn btn-primary hero-cta">
            entrar na comunidade <ArrowUpRight size={15} aria-hidden="true" />
          </a>
          <a href="#comunidade" className="btn btn-ghost">
            ver a comunidade
          </a>
        </div>

        <a href="#identidade" className="scroll-cue hero-scroll" aria-label="role para baixo">
          <span>desce</span>
          <span className="line" />
        </a>
      </div>
    </section>
  )
}
