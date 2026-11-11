import { useLang } from '../lib/i18n'

// Fita honesta: só a linha do tempo real do copy.ts.
// Passa duas vezes pra costurar o loop infinito.
export function Marquee() {
  const { c } = useLang()
  const items = c.timeline.items.map((n) => `${n.next ? 'NEXT — ' : ''}${n.date} · ${n.title}`)
  return (
    <div className="marquee" role="marquee" aria-label={c.marqueeAria}>
      <div className="marquee-track">
        {[0, 1].map((copy) => (
          <div key={copy} className="marquee-chunk" aria-hidden={copy === 1}>
            {items.map((item) => (
              <span key={`${copy}-${item}`} className="marquee-item mono">
                {item} <span className="marquee-sep">◆</span>
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}
