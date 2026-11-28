import { ArrowUpRight } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Button } from 'prism'
import { SparklesSticker } from 'stick-it-up'
import { site, links } from '../data/site'
import { useLang } from '../lib/i18n'
import { eggMessages } from '../lib/easterEggs'
import axolote from '../assets/images/axolote.png'

type Members = { count: number; avatars: string[] }

// contagem real do convite do Discord + avatares de quem está online (widget). Sem dado, não mostra nada.
function useMembers(): Members | null {
  const [m, setM] = useState<Members | null>(null)
  useEffect(() => {
    let alive = true
    fetch('/api/status')
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        if (alive && d && Number.isInteger(d.members) && d.members > 0)
          setM({ count: d.members, avatars: Array.isArray(d.avatars) ? d.avatars : [] })
      })
      .catch(() => {})
    return () => {
      alive = false
    }
  }, [])
  return m
}

type HeroProps = {
  onEgg: (msg: string) => void
}

export function Hero({ onEgg }: HeroProps) {
  const [pokes, setPokes] = useState(0)
  const { c, lang } = useLang()
  const h = c.hero
  const members = useMembers()

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
          <SparklesSticker className="hero-sticker" size={40} aria-hidden="true" />
        </button>

        <p className="hero-kicker mono reveal" style={{ ['--reveal-delay' as string]: '40ms' }}>
          <span className="hero-hello">&gt; {h.hello}</span>
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

        {members && (
          <div className="hero-members">
            {members.avatars.length > 0 && (
              <ul className="hero-avatars" aria-label={h.membersAria}>
                {members.avatars.map((src) => (
                  <li key={src}>
                    <img src={src} alt="" width={32} height={32} loading="lazy" decoding="async" referrerPolicy="no-referrer" onError={(e) => e.currentTarget.closest('li')?.setAttribute('hidden', '')} />
                  </li>
                ))}
              </ul>
            )}
            <p>{h.members(members.count.toLocaleString(lang === 'pt' ? 'pt-BR' : 'en-US'))}</p>
          </div>
        )}

        <a href="#sobre" className="scroll-cue hero-scroll" aria-label={h.scrollAria}>
          <span>{h.scroll}</span>
          <span className="line" />
        </a>
      </div>
    </section>
  )
}
