import { useEffect, useRef, useState } from 'react'

// Terminal que digita o texto quando entra na tela. O texto completo fica
// acessível para leitor de tela e aparece inteiro com reduced-motion.
type Props = { file: string; lines: string[]; speed?: number }

export function Typed({ file, lines, speed = 16 }: Props) {
  const ref = useRef<HTMLDivElement>(null)
  const total = lines.reduce((n, l) => n + l.length, 0)
  const reduce =
    typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
  const [n, setN] = useState(reduce ? total : 0)

  useEffect(() => {
    if (reduce) {
      setN(total)
      return
    }
    setN(0)
    const el = ref.current
    if (!el || typeof IntersectionObserver === 'undefined') {
      setN(total)
      return
    }
    let id = 0
    const io = new IntersectionObserver(
      (entries) => {
        if (!entries[0]?.isIntersecting) return
        io.disconnect()
        id = window.setInterval(() => {
          setN((v) => {
            if (v + 1 >= total) window.clearInterval(id)
            return Math.min(v + 1, total)
          })
        }, speed)
      },
      { threshold: 0.35 },
    )
    io.observe(el)
    return () => {
      io.disconnect()
      window.clearInterval(id)
    }
  }, [total, speed, reduce])

  let left = n
  const done = n >= total
  return (
    <div ref={ref} className="term">
      <div className="term-bar mono" aria-hidden="true">
        <span className="term-dots">
          <i />
          <i />
          <i />
        </span>
        <span>{file}</span>
      </div>
      <div className="term-body">
        <p className="mono term-prompt" aria-hidden="true">
          $ cat {file}
        </p>
        <div aria-hidden="true">
          {lines.map((l, i) => {
            const part = l.slice(0, Math.max(0, left))
            left -= l.length
            const active = !done && part.length > 0 && part.length < l.length
            return (
              <p key={i} className={`term-line ${i === 0 ? 'is-lead' : ''}`}>
                {part}
                {active || (done && i === lines.length - 1) ? <span className="term-caret" /> : null}
              </p>
            )
          })}
        </div>
        <div className="visually-hidden">
          {lines.map((l) => (
            <p key={l}>{l}</p>
          ))}
        </div>
      </div>
    </div>
  )
}
