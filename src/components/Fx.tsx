import { useEffect, useRef } from 'react'

// Dois canvases num loop só: partículas roxas no fundo e bolhas que sobem do cursor
// (axolote vive na água). Nada roda com reduced-motion; bolhas só com mouse.
type Dot = { x: number; y: number; r: number; a: number; vy: number; ph: number }
type Bubble = { x: number; y: number; r: number; vy: number; ph: number; born: number; life: number }

const PURPLE = '179,102,255'

export function Fx() {
  const bg = useRef<HTMLCanvasElement>(null)
  const fg = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const bgc = bg.current
    const fgc = fg.current
    if (!bgc || !fgc) return
    const bctx = bgc.getContext('2d')
    const fctx = fgc.getContext('2d')
    if (!bctx || !fctx) return
    const mouse = window.matchMedia('(hover: hover) and (pointer: fine)').matches

    let w = 0
    let h = 0
    let dots: Dot[] = []
    const bubbles: Bubble[] = []
    let raf = 0

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      w = window.innerWidth
      h = window.innerHeight
      for (const c of [bgc, fgc]) {
        c.width = w * dpr
        c.height = h * dpr
      }
      bctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      fctx.setTransform(dpr, 0, 0, dpr, 0, 0)
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

    const spawn = (x: number, y: number) => {
      if (bubbles.length > 60) return
      bubbles.push({
        x: x + (Math.random() - 0.5) * 8,
        y,
        r: 2.5 + Math.random() * 6,
        vy: 0.35 + Math.random() * 0.8,
        ph: Math.random() * Math.PI * 2,
        born: performance.now(),
        life: 900 + Math.random() * 900,
      })
    }

    let lx = -1
    let ly = -1
    const onMove = (e: PointerEvent) => {
      if (lx < 0 || Math.hypot(e.clientX - lx, e.clientY - ly) > 22) {
        spawn(e.clientX, e.clientY)
        lx = e.clientX
        ly = e.clientY
      }
    }
    const onDown = (e: PointerEvent) => {
      for (let i = 0; i < 6; i++) spawn(e.clientX, e.clientY)
    }

    const frame = (t: number) => {
      bctx.clearRect(0, 0, w, h)
      for (const d of dots) {
        d.y -= d.vy
        if (d.y < -4) {
          d.y = h + 4
          d.x = Math.random() * w
        }
        const x = d.x + Math.sin(t / 2600 + d.ph) * 10
        bctx.fillStyle = `rgba(${PURPLE},${d.a})`
        bctx.beginPath()
        bctx.arc(x, d.y, d.r, 0, Math.PI * 2)
        bctx.fill()
      }

      fctx.clearRect(0, 0, w, h)
      const now = performance.now()
      for (let i = bubbles.length - 1; i >= 0; i--) {
        const b = bubbles[i]
        const k = (now - b.born) / b.life
        if (k >= 1.12) {
          bubbles.splice(i, 1)
          continue
        }
        b.y -= b.vy
        const x = b.x + Math.sin(now / 380 + b.ph) * 4
        if (k < 1) {
          // corpo da bolha: aro + brilho pequeno, sem preenchimento chamativo
          fctx.strokeStyle = `rgba(${PURPLE},${0.75 * (1 - k)})`
          fctx.fillStyle = `rgba(${PURPLE},${0.07 * (1 - k)})`
          fctx.lineWidth = 1.2
          fctx.beginPath()
          fctx.arc(x, b.y, b.r, 0, Math.PI * 2)
          fctx.fill()
          fctx.stroke()
          fctx.strokeStyle = `rgba(255,255,255,${0.7 * (1 - k)})`
          fctx.beginPath()
          fctx.arc(x, b.y, b.r * 0.6, Math.PI * 1.15, Math.PI * 1.5)
          fctx.stroke()
        } else {
          // estoura: aro abre e some
          const p = (k - 1) / 0.12
          fctx.strokeStyle = `rgba(${PURPLE},${0.6 * (1 - p)})`
          fctx.lineWidth = 1
          fctx.beginPath()
          fctx.arc(x, b.y, b.r * (1 + p * 0.7), 0, Math.PI * 2)
          fctx.stroke()
        }
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
    if (mouse) {
      window.addEventListener('pointermove', onMove, { passive: true })
      window.addEventListener('pointerdown', onDown, { passive: true })
    }
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
      document.removeEventListener('visibilitychange', onVis)
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerdown', onDown)
    }
  }, [])

  return (
    <>
      <canvas ref={bg} className="fx fx-bg" aria-hidden="true" />
      <canvas ref={fg} className="fx fx-fg" aria-hidden="true" />
    </>
  )
}
