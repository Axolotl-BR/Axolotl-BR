import { useEffect, useRef } from 'react'

// Canvas com partículas roxas no fundo, por trás do conteúdo. Roda pra todo mundo,
// inclusive com "reduzir movimento" ligado no sistema (decisão do dono do site).
type Dot = { x: number; y: number; r: number; a: number; vy: number; ph: number }

const PURPLE = '179,102,255'

export function Fx() {
  const bg = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const c = bg.current
    const ctx = c?.getContext('2d')
    if (!c || !ctx) return

    let w = 0
    let h = 0
    let dots: Dot[] = []
    let raf = 0

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      w = window.innerWidth
      h = window.innerHeight
      c.width = w * dpr
      c.height = h * dpr
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      const n = w < 700 ? 18 : 42
      dots = Array.from({ length: n }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        r: 0.6 + Math.random() * 1.6,
        a: 0.12 + Math.random() * 0.33,
        vy: 0.08 + Math.random() * 0.22,
        ph: Math.random() * Math.PI * 2,
      }))
    }

    const frame = (t: number) => {
      ctx.clearRect(0, 0, w, h)
      for (const d of dots) {
        d.y -= d.vy
        if (d.y < -4) {
          d.y = h + 4
          d.x = Math.random() * w
        }
        const x = d.x + Math.sin(t / 2600 + d.ph) * 10
        ctx.fillStyle = `rgba(${PURPLE},${d.a})`
        ctx.beginPath()
        ctx.arc(x, d.y, d.r, 0, Math.PI * 2)
        ctx.fill()
      }
      raf = requestAnimationFrame(frame)
    }

    const onVis = () => {
      cancelAnimationFrame(raf)
      if (!document.hidden) raf = requestAnimationFrame(frame)
    }

    resize()
    raf = requestAnimationFrame(frame)
    window.addEventListener('resize', resize)
    document.addEventListener('visibilitychange', onVis)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
      document.removeEventListener('visibilitychange', onVis)
    }
  }, [])

  return <canvas ref={bg} className="fx fx-bg" aria-hidden="true" />
}
