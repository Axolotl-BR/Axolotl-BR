import { useEffect, useRef, useState } from 'react'
import { useLang } from '../lib/i18n'

type Entry = { version: string; msg: string; date: string }

// Commits reais do site (via /api/changelog). Ao passar o mouse, um cursor de
// "presença" com o nome Fabi segue o ponteiro, no estilo dos cursores de colaborador.
// Sem dado, nada aparece: melhor nada do que commit inventado.
export function FabiCommits() {
  const { c, lang } = useLang()
  const [rows, setRows] = useState<Entry[]>([])
  const list = useRef<HTMLDivElement>(null)
  const cursor = useRef<HTMLDivElement>(null)

  useEffect(() => {
    let alive = true
    fetch('/api/changelog')
      .then((r) => (r.ok ? r.json() : null))
      .then((d: { site?: Entry[] } | null) => {
        if (alive && d?.site) setRows(d.site.slice(0, 4))
      })
      .catch(() => {})
    return () => {
      alive = false
    }
  }, [])

  if (!rows.length) return null

  const move = (e: React.PointerEvent) => {
    if (e.pointerType !== 'mouse' || !list.current || !cursor.current) return
    const r = list.current.getBoundingClientRect()
    cursor.current.style.transform = `translate(${e.clientX - r.left}px,${e.clientY - r.top}px)`
    cursor.current.classList.add('is-on')
  }
  const leave = () => cursor.current?.classList.remove('is-on')

  const fmt = new Intl.DateTimeFormat(lang === 'en' ? 'en-US' : 'pt-BR', { day: '2-digit', month: 'short' })
  const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1)

  return (
    <div className="fabi-commits">
      <p className="mono fabi-commits-head">{c.fabi.commits}</p>
      <div ref={list} className="commit-wrap" onPointerMove={move} onPointerLeave={leave}>
        <ul className="commit-list">
        {rows.map((r) => (
          <li key={r.version} className="commit-row">
            <span className="mono commit-ver">v{r.version}</span>
            <span className="commit-msg">{cap(r.msg)}</span>
            <time className="mono commit-date" dateTime={r.date}>
              {fmt.format(new Date(r.date))}
            </time>
          </li>
        ))}
        </ul>
        <div ref={cursor} className="presence" aria-hidden="true">
          <svg width="18" height="20" viewBox="0 0 18 20" fill="none">
            <path d="M1 1l6.5 17 2.4-7.1L17 8.5 1 1z" fill="currentColor" stroke="#fff" strokeWidth="1.5" strokeLinejoin="round" />
          </svg>
          <span className="presence-name">Fabi</span>
        </div>
      </div>
    </div>
  )
}
