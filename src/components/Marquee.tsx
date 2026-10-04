import { labProjects, news } from '../data/site'

// Fita honesta estilo marquee: só o que existe de verdade no site.ts.
// Nada de logos de parceiros inventados — aqui passam projetos e novidades reais.
const items = [
  ...labProjects.map((p) => `${p.name} · ${p.status}`),
  ...news.map((n) => `${n.date} · ${n.title}`),
]

export function Marquee() {
  return (
    <div className="marquee" role="marquee" aria-label="projetos e novidades da comunidade">
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
