import { Section } from '../components/Section'
import { Reveal } from '../components/Reveal'
import { news } from '../data/site'

export function News() {
  return (
    <Section
      id="novidades"
      eyebrow="novidades"
      title={<>o que já rolou.</>}
    >
      <ol className="news-list">
        {news.map((item, i) => (
          <li key={`${item.kind}-${item.date}`}>
            <Reveal delay={i * 70}>
              <article className="news-item">
                <div className="news-meta">
                  <span className="tag" data-kind={item.kind}>
                    {item.kind}
                  </span>
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

      <Reveal delay={400}>
        <div className="news-foot mono">
          <span className="text-faint">// continua.</span>
        </div>
      </Reveal>
    </Section>
  )
}
