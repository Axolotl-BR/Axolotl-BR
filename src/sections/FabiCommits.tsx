import { useEffect, useRef, useState } from 'react'
import { Asterisk, CurlyArrow, SparkleFour } from 'trazo-stickers'
import { useLang } from '../lib/i18n'

const WEEKS = 18
type Cell = { key: string; n: number; future: boolean }

const iso = (d: Date) => d.toISOString().slice(0, 10)

// Heatmap com os commits reais do site (via /api/changelog). Um cursor "Fabi"
// passeia sozinho pela tabela e, quando o visitante passa o mouse, aparece o "você".
// Sem dado, o bloco some: melhor nada do que atividade inventada.
export function FabiCommits() {
  const { c, lang } = useLang()
  const [days, setDays] = useState<Record<string, number> | null>(null)
  const grid = useRef<HTMLDivElement>(null)
  const fabi = useRef<HTMLDivElement>(null)
  const me = useRef<HTMLDivElement>(null)
  const [tip, setTip] = useState<{ text: string; x: number; y: number } | null>(null)

  useEffect(() => {
    let alive = true
    fetch('/api/changelog')
      .then((r) => (r.ok ? r.json() : null))
      .then((d: { days?: Record<string, number> } | null) => {
        if (alive && d?.days && Object.keys(d.days).length) setDays(d.days)
      })
      .catch(() => {})
    return () => {
      alive = false
    }
  }, [])

  // o Fabi anda de célula em célula
  useEffect(() => {
    if (!days) return
    const move = () => {
      const g = grid.current
      const f = fabi.current
      if (!g || !f) return
      const cells = g.querySelectorAll<HTMLElement>('.hm-cell:not(.is-future)')
      const el = cells[Math.floor(Math.random() * cells.length)]
      if (!el) return
      const gr = g.getBoundingClientRect()
      const er = el.getBoundingClientRect()
      f.style.transform = `translate(${er.left - gr.left + er.width / 2}px,${er.top - gr.top + er.height / 2}px)`
    }
    move()
    const id = window.setInterval(move, 2200)
    return () => window.clearInterval(id)
  }, [days])

  if (!days) return null

  const today = new Date()
  const start = new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate()))
  start.setUTCDate(start.getUTCDate() - start.getUTCDay() - (WEEKS - 1) * 7) // domingo da primeira semana
  const todayKey = iso(today)
  const cells: Cell[] = Array.from({ length: WEEKS * 7 }, (_, i) => {
    const d = new Date(start)
    d.setUTCDate(start.getUTCDate() + i)
    const key = iso(d)
    return { key, n: days[key] ?? 0, future: key > todayKey }
  })
  const level = (n: number) => (n === 0 ? 0 : n < 2 ? 1 : n < 4 ? 2 : n < 7 ? 3 : 4)
  const total = cells.reduce((a, x) => a + x.n, 0)
  const fmt = new Intl.DateTimeFormat(lang === 'en' ? 'en-US' : 'pt-BR', { day: '2-digit', month: 'short', timeZone: 'UTC' })
  const dow = lang === 'en' ? ['Mon', 'Wed', 'Fri'] : ['seg', 'qua', 'sex']

  const onMove = (e: React.PointerEvent) => {
    if (e.pointerType !== 'mouse' || !grid.current || !me.current) return
    const r = grid.current.getBoundingClientRect()
    const x = e.clientX - r.left
    const y = e.clientY - r.top
    me.current.style.transform = `translate(${x}px,${y}px)`
    me.current.classList.add('is-on')
    const key = (e.target as HTMLElement).dataset?.key
    const cell = key ? cells.find((k) => k.key === key) : undefined
    setTip(
      cell && !cell.future
        ? { text: `${cell.n} ${cell.n === 1 ? c.fabi.commit : c.fabi.commitsN} · ${fmt.format(new Date(cell.key))}`, x, y }
        : null,
    )
  }
  const onLeave = () => {
    me.current?.classList.remove('is-on')
    setTip(null)
  }

  return (
    <div className="fabi-commits">
      <p className="mono fabi-commits-head">
        {c.fabi.commits} · {total}
      </p>
      <div className="hm-row">
      <div className="hm">
        <div className="hm-days mono" aria-hidden="true">
          <span style={{ gridRow: 2 }}>{dow[0]}</span>
          <span style={{ gridRow: 4 }}>{dow[1]}</span>
          <span style={{ gridRow: 6 }}>{dow[2]}</span>
        </div>
        <div
          ref={grid}
          className="hm-grid"
          onPointerMove={onMove}
          onPointerLeave={onLeave}
          role="img"
          aria-label={`${c.fabi.commits}: ${total}`}
        >
          {cells.map((x) => (
            <span key={x.key} data-key={x.key} className={`hm-cell l${level(x.n)}${x.future ? ' is-future' : ''}`} />
          ))}
          <div ref={fabi} className="presence presence-fabi is-on" aria-hidden="true">
            <Arrow />
            <span className="presence-name" data-name="Fabi">Fabi</span>
          </div>
          <div ref={me} className="presence presence-me" aria-hidden="true">
            <Arrow />
            <span className="presence-name" data-name={c.fabi.you}>{c.fabi.you}</span>
          </div>
          {tip ? (
            <span className="hm-tip mono" style={{ transform: `translate(${tip.x}px,${tip.y}px)` }}>
              {tip.text}
            </span>
          ) : null}
        </div>
      </div>
      <div className="hm-doodles" aria-hidden="true">
        <CurlyArrow size={40} color="currentColor" rotate={-20} />
        <SparkleFour size={26} color="currentColor" rotate={8} />
        <Asterisk size={22} color="currentColor" rotate={14} />
      </div>
      </div>
    </div>
  )
}

function Arrow() {
  return (
    <svg width="18" height="20" viewBox="0 0 18 20" fill="none">
      <path d="M1 1l6.5 17 2.4-7.1L17 8.5 1 1z" fill="currentColor" stroke="#fff" strokeWidth="1.5" strokeLinejoin="round" />
    </svg>
  )
}
