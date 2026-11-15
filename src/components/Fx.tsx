import { useEffect, useRef } from 'react'

// Dois canvases num loop só: partículas roxas no fundo e um axolote em pixel
// que nada atrás do cursor (corpo em segmentos que seguem o líder, guelras que
// abanam). Nada roda com reduced-motion; o axolote só existe com mouse.
type Dot = { x: number; y: number; r: number; a: number; vy: number; ph: number }

const PURPLE = '179,102,255'
const BODY = '#f7a8c4'
const GILL = '#e0608f'
const EYE = '#1b1020'
const G = 3 // grade do pixel
const SEGS = 12
const GAP = 10

const snap = (v: number) => Math.round(v / G) * G

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
    let raf = 0

    // axolote: seg[0] é a cabeça
    const seg = Array.from({ length: SEGS }, () => ({ x: 0, y: 0 }))
    const target = { x: 0, y: 0 }
    let awake = false
    let flare = 0

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

    const onMove = (e: PointerEvent) => {
      target.x = e.clientX
      target.y = e.clientY
      if (!awake) {
        awake = true
        for (const s of seg) {
          s.x = e.clientX - 40
          s.y = e.clientY + 30
        }
      }
    }
    const onDown = () => {
      flare = 1
    }
    const onLeave = () => {
      awake = false
    }

    const drawAxolotl = (t: number) => {
      // cabeça nada até ficar a ~38px do cursor, devagar e sem colar nele
      const dx = target.x - seg[0].x
      const dy = target.y - seg[0].y
      const dist = Math.hypot(dx, dy)
      const speed = dist > 38 ? Math.min((dist - 38) * 0.07, 6) : 0
      if (dist > 0) {
        seg[0].x += (dx / dist) * speed
        seg[0].y += (dy / dist) * speed
      }
      for (let i = 1; i < SEGS; i++) {
        const ex = seg[i - 1].x - seg[i].x
        const ey = seg[i - 1].y - seg[i].y
        const d = Math.hypot(ex, ey) || 1
        seg[i].x = seg[i - 1].x - (ex / d) * GAP
        seg[i].y = seg[i - 1].y - (ey / d) * GAP
      }
      const swim = 1.4 + speed * 0.7 // ondulação cresce com a velocidade
      flare *= 0.94

      // posições com ondulação perpendicular ao corpo
      const pts = seg.map((s, i) => {
        const prev = seg[Math.max(i - 1, 0)]
        const next = seg[Math.min(i + 1, SEGS - 1)]
        const ang = Math.atan2(prev.y - next.y, prev.x - next.x)
        const wob = Math.sin(t / 170 - i * 0.75) * swim * (i / SEGS + 0.25)
        return { x: s.x - Math.sin(ang) * wob, y: s.y + Math.cos(ang) * wob, ang }
      })

      // corpo: do rabo para a cabeça, quadrados chapados que afinam
      for (let i = SEGS - 1; i >= 0; i--) {
        const size = i === 0 ? 15 : Math.max(G, snap(12 - i * 0.75))
        fctx.fillStyle = BODY
        fctx.fillRect(snap(pts[i].x - size / 2), snap(pts[i].y - size / 2), size, size)
      }

      // guelras: 3 de cada lado da cabeça
      const hd = pts[0]
      const px = -Math.sin(hd.ang)
      const py = Math.cos(hd.ang)
      const fx = Math.cos(hd.ang)
      const fy = Math.sin(hd.ang)
      fctx.fillStyle = GILL
      for (const side of [-1, 1]) {
        for (let k = 0; k < 3; k++) {
          const along = -2 + k * 4
          const out = 12 + k * 3 + Math.sin(t / 140 + k + side) * 2 + flare * 5
          const gx = hd.x + fx * along * -1 + px * side * out
          const gy = hd.y + fy * along * -1 + py * side * out
          fctx.fillRect(snap(gx) - 1, snap(gy) - 1, G, G)
          fctx.fillRect(snap(hd.x + px * side * (9 + k * 1.5)) - 1, snap(hd.y + py * side * (9 + k * 1.5)) - 1, G, G)
        }
      }

      // olhos
      fctx.fillStyle = EYE
      for (const side of [-1, 1]) {
        fctx.fillRect(snap(hd.x + fx * 3 + px * side * 3) - 1, snap(hd.y + fy * 3 + py * side * 3) - 1, G, G)
      }
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
      if (mouse && awake) drawAxolotl(t)
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
      document.documentElement.addEventListener('pointerleave', onLeave)
    }
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
      document.removeEventListener('visibilitychange', onVis)
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerdown', onDown)
      document.documentElement.removeEventListener('pointerleave', onLeave)
    }
  }, [])

  return (
    <>
      <canvas ref={bg} className="fx fx-bg" aria-hidden="true" />
      <canvas ref={fg} className="fx fx-fg" aria-hidden="true" />
    </>
  )
}
