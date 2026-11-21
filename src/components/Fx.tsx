import { useEffect, useRef } from 'react'

// Um canvas num loop só: partículas roxas no fundo e um glow roxo que segue o
// cursor (no celular, o dedo) por trás do conteúdo. Roda pra todo mundo,
// inclusive com "reduzir movimento" ligado no sistema (decisão do dono do site).
type Dot = { x: number; y: number; r: number; a: number; vy: number; ph: number }

const PURPLE = '179,102,255'
const GLOW_R = 260

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

    const glow = { x: 0, y: 0 }
    const target = { x: 0, y: 0 }
    let alpha = 0 // fade in/out do glow
    let awake = false
    let flare = 0

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

    const follow = (x: number, y: number) => {
      target.x = x
      target.y = y
      if (!awake) {
        awake = true
        if (alpha < 0.01) {
          glow.x = x
          glow.y = y
        }
      }
    }
    const onMove = (e: PointerEvent) => follow(e.clientX, e.clientY)
    // no celular o navegador cancela o pointermove quando começa a rolar; o touchmove continua
    const onTouch = (e: TouchEvent) => {
      const t = e.touches[0]
      if (t) follow(t.clientX, t.clientY)
    }
    const onDown = (e: PointerEvent) => {
      follow(e.clientX, e.clientY)
      flare = 1
    }
    // no toque o pointerleave dispara a cada vez que solta o dedo; aí o glow fica onde está
    const onLeave = (e: PointerEvent) => {
      if (e.pointerType === 'mouse') awake = false
    }

    const drawGlow = () => {
      glow.x += (target.x - glow.x) * 0.12
      glow.y += (target.y - glow.y) * 0.12
      alpha += ((awake ? 1 : 0) - alpha) * 0.08
      flare *= 0.93
      if (alpha < 0.01) return
      const r = GLOW_R * (1 + flare * 0.25)
      const g = ctx.createRadialGradient(glow.x, glow.y, 0, glow.x, glow.y, r)
      g.addColorStop(0, `rgba(${PURPLE},${(0.18 + flare * 0.12) * alpha})`)
      g.addColorStop(1, `rgba(${PURPLE},0)`)
      ctx.fillStyle = g
      ctx.fillRect(glow.x - r, glow.y - r, r * 2, r * 2)
    }

    const frame = (t: number) => {
      ctx.clearRect(0, 0, w, h)
      drawGlow()
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
    window.addEventListener('pointermove', onMove, { passive: true })
    window.addEventListener('pointerdown', onDown, { passive: true })
    window.addEventListener('touchmove', onTouch, { passive: true })
    document.documentElement.addEventListener('pointerleave', onLeave)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
      document.removeEventListener('visibilitychange', onVis)
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerdown', onDown)
      window.removeEventListener('touchmove', onTouch)
      document.documentElement.removeEventListener('pointerleave', onLeave)
    }
  }, [])

  return <canvas ref={bg} className="fx fx-bg" aria-hidden="true" />
}
