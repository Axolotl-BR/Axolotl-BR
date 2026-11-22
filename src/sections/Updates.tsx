import { Asterisk } from 'trazo-stickers'
import { useEffect, useState } from 'react'
import { ArrowUpRight } from 'lucide-react'
import { Badge } from 'prism'
import { Section } from '../components/Section'
import { Reveal } from '../components/Reveal'
import { useLang } from '../lib/i18n'

type Entry = { version: string; msg: string; date: string }
type Row = Entry & { source: 'site' | 'alt' }

// Atualizações reais: commits versionados do site e do ALT (via /api/changelog).
// Sem dado, a seção some: melhor nada do que atividade inventada.
export function Updates() {
  const { c, lang } = useLang()
  const u = c.updates
  const [rows, setRows] = useState<Row[]>([])

  useEffect(() => {
    let alive = true
    fetch('/api/changelog')
      .then((r) => (r.ok ? r.json() : null))
      .then((d: { site?: Entry[]; alt?: Entry[] } | null) => {
        if (!alive || !d) return
        const all: Row[] = [
          ...(d.site ?? []).slice(0, 3).map((e) => ({ ...e, source: 'site' as const })),
          ...(d.alt ?? []).slice(0, 3).map((e) => ({ ...e, source: 'alt' as const })),
        ]
        all.sort((a, b) => b.date.localeCompare(a.date))
        setRows(all)
      })
      .catch(() => {})
    return () => {
      alive = false
    }
  }, [])

  if (!rows.length) return null
  const fmt = new Intl.DateTimeFormat(lang === 'en' ? 'en-US' : 'pt-BR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
  const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1)

  return (
    <Section doodle={<Asterisk size={60} color="currentColor" rotate={12} />} id="atualizacoes" className="updates" eyebrow={u.eyebrow} title={<>{u.title}</>} lead={u.lead}>
      <ol className="upd-list">
        {rows.map((r, i) => (
          <li key={`${r.source}-${r.version}`}>
            <Reveal delay={i * 70}>
              <article className="upd-item">
                <div className="upd-meta">
                  <Badge label={r.source === 'alt' ? u.alt : u.site} tone={r.source === 'alt' ? 'brand' : 'neutral'} size="sm" />
                  <span className="mono upd-ver">v{r.version}</span>
                </div>
                <p className="upd-msg">{cap(r.msg)}</p>
                <time className="mono upd-date" dateTime={r.date}>
                  {fmt.format(new Date(r.date))}
                </time>
              </article>
            </Reveal>
          </li>
        ))}
      </ol>
      <a className="proj-link upd-more" href="https://github.com/Axolotl-BR" target="_blank" rel="noreferrer">
        {u.more} <ArrowUpRight size={14} aria-hidden="true" />
      </a>
    </Section>
  )
}
