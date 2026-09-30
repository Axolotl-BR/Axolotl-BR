import { ArrowUpRight, ChevronDown } from 'lucide-react'
import { site, links } from '../data/site'
import { eggMessages } from '../lib/easterEggs'
import { useState } from 'react'
import banner from '../assets/banner.png'

type HeroProps = {
  onEgg: (msg: string) => void
}

export function Hero({ onEgg }: HeroProps) {
  const [mascotClicks, setMascotClicks] = useState(0)

  const pokeMascot = () => {
    const next = mascotClicks + 1
    setMascotClicks(next)
    if (next === 3) {
      setMascotClicks(0)
      onEgg(eggMessages.mascot)
    }
  }

  return (
    <section className="hero">
      <div className="hero-bg" aria-hidden="true">
        <div className="hero-bg-banner" style={{ backgroundImage: `url(${banner})` }} />
      </div>

      <div className="container hero-inner">
        <h1 className="h1 hero-title reveal" style={{ ['--reveal-delay' as string]: '80ms' }}>
          <span className="hero-product">{site.product}</span>
        </h1>

        <p className="hero-tagline reveal" style={{ ['--reveal-delay' as string]: '160ms' }}>
          {site.tagline}
        </p>

        <div className="hero-actions reveal" style={{ ['--reveal-delay' as string]: '240ms' }}>
          <a href={links.discord} target="_blank" rel="noreferrer" className="btn btn-primary hero-cta">
            entrar na comunidade <ArrowUpRight size={15} aria-hidden="true" />
          </a>
          <a href="#comunidade" className="btn btn-ghost">
            ver a comunidade
          </a>
        </div>

        <button
          type="button"
          className="hero-mascot reveal"
          style={{ ['--reveal-delay' as string]: '400ms' }}
          onClick={pokeMascot}
          aria-label="o axolote (clica nele, ele gosta)"
          title="🫟"
        >
          🫟
        </button>

        <a href="#identidade" className="scroll-cue hero-scroll" aria-label="role para baixo" tabIndex={-1}>
          <span>desce</span>
          <span className="line" />
          <ChevronDown size={14} />
        </a>
      </div>
    </section>
  )
}
