import { Badge } from 'prism'
import { Reveal } from '../components/Reveal'
import { useLang } from '../lib/i18n'

// linha do tempo na horizontal: cartões que rolam de lado
export function TimelineV2() {
  const { c } = useLang()
  return (
    <section id="novidades" className="section v2-time">
      <div className="container">
        <Reveal>
          <div className="section-head">
            <h2 className="h2">{c.timeline.title}</h2>
          </div>
        </Reveal>
      </div>
      <ol className="v2-rail" tabIndex={0} aria-label={c.timeline.title}>
        {c.timeline.items.map((item) => (
          <li key={`${item.kind}-${item.date}`} className={`v2-card ${item.next ? 'is-next' : ''}`}>
            <div className="news-meta">
              <Badge
                label={item.kind}
                tone={item.kind === 'UPDATE' || item.next ? 'brand' : 'neutral'}
                size="sm"
              />
              <span className="mono news-date">{item.date}</span>
            </div>
            <h3 className="news-title">{item.title}</h3>
            <p className="news-desc">{item.desc}</p>
          </li>
        ))}
      </ol>
    </section>
  )
}
