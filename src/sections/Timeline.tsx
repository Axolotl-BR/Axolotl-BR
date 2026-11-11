import { Badge } from 'prism'
import { Section } from '../components/Section'
import { Reveal } from '../components/Reveal'
import { useLang } from '../lib/i18n'

export function Timeline() {
  const { c } = useLang()
  return (
    <Section id="novidades" title={<>{c.timeline.title}</>}>
      <ol className="news-list">
        {c.timeline.items.map((item, i) => (
          <li key={`${item.kind}-${item.date}`} className={item.next ? 'is-next' : undefined}>
            <Reveal delay={i * 70}>
              <article className="news-item">
                <div className="news-meta">
                  <Badge
                    label={item.kind}
                    tone={item.kind === 'UPDATE' || item.next ? 'brand' : 'neutral'}
                    size="sm"
                  />
                  <span className="mono news-date">{item.date}</span>
                </div>
                <div className="news-body">
                  <h3 className="news-title">{item.title}</h3>
                  <p className="news-desc">{item.desc}</p>
                </div>
              </article>
            </Reveal>
          </li>
        ))}
      </ol>
    </Section>
  )
}
