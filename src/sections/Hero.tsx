import { ArrowUpRight, ChevronDown } from 'lucide-react'
import { site, links, universeNodes } from '../data/site'
import { eggMessages } from '../lib/easterEggs'
import { useState } from 'react'

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
        <div className="hero-orb hero-orb-1" />
        <div className="hero-orb hero-orb-2" />
      </div>

      <div className="container hero-inner">
        <p className="hero-boot mono reveal">
          &gt; conectando ao hub
          <span className="blink">_</span>
        </p>

        <h1 className="h1 hero-title hero-title-shimmer reveal" style={{ ['--reveal-delay' as string]: '80ms' }}>
          <span className="hero-product">{site.product}</span>
        </h1>

        <p className="hero-tagline reveal" style={{ ['--reveal-delay' as string]: '160ms' }}>
          {site.tagline}
        </p>

        <div className="hero-actions reveal" style={{ ['--reveal-delay' as string]: '240ms' }}>
          <a href={links.discord} target="_blank" rel="noreferrer" className="btn btn-primary hero-cta">
            entrar na comunidade <ArrowUpRight size={15} aria-hidden="true" />
          </a>
          <a href="#universo" className="btn btn-ghost">
            explorar o universo
          </a>
        </div>

        <div className="hero-portal reveal" style={{ ['--reveal-delay' as string]: '320ms' }}>
          <div className="portal" aria-hidden="true">
            <div className="portal-ring" />
            <div className="portal-ring portal-ring-2" />
            <span className="orbit-dot" />
            <span className="orbit-dot" />
            <span className="orbit-dot" />
          </div>

          <button
            type="button"
            className="hero-mascot float"
            onClick={pokeMascot}
            aria-label="o axolote do hub (clica nele, ele gosta)"
            title="🫟"
          >
            🫟
          </button>

          <ul className="hero-nodes" aria-hidden="true">
            {universeNodes.map((n, i) => (
              <li key={n.name} className="hero-node" style={{ ['--i' as string]: i }}>
                <span className="hero-node-name mono">{n.name}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="hero-foot mono reveal" style={{ ['--reveal-delay' as string]: '420ms' }}>
          <span className="hero-status">
            <span className="led online" /> comunicando
          </span>
          <span className="hero-status">
            <span className="led warning" /> hub em construção
          </span>
          <span className="hero-status mono">🫟 build.axolotl</span>
        </div>

        <a href="#identidade" className="scroll-cue hero-scroll" aria-label="role para baixo" tabIndex={-1}>
          <span>desce</span>
          <span className="line" />
          <ChevronDown size={14} />
        </a>
      </div>
    </section>
  )
}