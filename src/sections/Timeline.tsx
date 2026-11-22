import { Triangle } from 'trazo-stickers'
import { useEffect, useRef, useState } from 'react'
import { Badge } from 'prism'
import { Section } from '../components/Section'
import { Reveal } from '../components/Reveal'
import { useLang } from '../lib/i18n'

export function Timeline() {
  const { c } = useLang()
  const list = useRef<HTMLOListElement>(null)
  const [active, setActive] = useState(-1)

  // scroll storytelling: a linha roxa enche e o capítulo da vez acende
  useEffect(() => {
    const ol = list.current
    if (!ol) return
    let raf = 0
    const tick = () => {
      raf = 0
      const line = window.innerHeight * 0.55
      const r = ol.getBoundingClientRect()
      ol.style.setProperty('--p', String(Math.min(1, Math.max(0, (line - r.top) / r.height))))
      let idx = -1
      ol.querySelectorAll('li').forEach((li, i) => {
        if (li.getBoundingClientRect().top < line) idx = i
      })
      setActive(idx)
    }
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(tick)
    }
    tick()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      if (raf) cancelAnimationFrame(raf)
    }
  }, [c])

  return (
    <Section doodle={<Triangle size={56} color="currentColor" rotate={14} />} id="novidades" title={<>{c.timeline.title}</>}>
      <ol className="news-list" ref={list}>
        {c.timeline.items.map((item, i) => (
          <li key={`${item.kind}-${item.date}`} className={`${item.next ? 'is-next' : ''} ${i <= active ? 'is-lit' : ''} ${i === active ? 'is-now' : ''}`}>
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
