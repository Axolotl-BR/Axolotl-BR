import { useCallback, useEffect, useRef, useState } from 'react'

// Texto que embaralha caracteres antes de revelar a palavra.
// on="view": roda uma vez ao entrar na tela. on="hover": roda ao passar o mouse no pai.
const GLYPHS = '!<>-_/[]{}=+*^?#01'

type Props = { text: string; on?: 'view' | 'hover' }

export function Scramble({ text, on = 'view' }: Props) {
  const ref = useRef<HTMLSpanElement>(null)
  const timer = useRef(0)
  const [shown, setShown] = useState(text)

  const run = useCallback(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    window.clearInterval(timer.current)
    const start = performance.now()
    timer.current = window.setInterval(() => {
      const t = performance.now() - start
      let done = true
      let out = ''
      for (let i = 0; i < text.length; i++) {
        const ch = text[i]
        if (ch === ' ' || t > 260 + i * 38) out += ch
        else {
          done = false
          out += GLYPHS[Math.floor(Math.random() * GLYPHS.length)]
        }
      }
      setShown(out)
      if (done) window.clearInterval(timer.current)
    }, 40)
  }, [text])

  useEffect(() => {
    setShown(text)
    const el = ref.current
    if (!el) return
    if (on === 'hover') {
      const host = el.closest('a, button') ?? el.parentElement
      host?.addEventListener('pointerenter', run)
      return () => {
        host?.removeEventListener('pointerenter', run)
        window.clearInterval(timer.current)
      }
    }
    if (typeof IntersectionObserver === 'undefined') return
    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          run()
          io.disconnect()
        }
      },
      { threshold: 0.6 },
    )
    io.observe(el)
    return () => {
      io.disconnect()
      window.clearInterval(timer.current)
    }
  }, [text, on, run])

  return (
    <span ref={ref}>
      <span aria-hidden="true">{shown}</span>
      <span className="visually-hidden">{text}</span>
    </span>
  )
}
