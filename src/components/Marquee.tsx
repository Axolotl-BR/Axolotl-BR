import { news } from '../data/site'

// Fita honesta estilo marquee: só novidade real do site.ts.
// Passa duas vezes pra costurar o loop infinito.
const items = news.map((n) => `${n.date} · ${n.title}`)

export function Marquee() {
  return (
    <div className="marquee" role="marquee" aria-label="novidades da comunidade">
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
