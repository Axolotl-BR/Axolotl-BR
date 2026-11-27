import { useEffect, useRef } from 'react'

// Céu ASCII roxo no fundo das seções (o hero é opaco e cobre o começo).
// Nuvens de caracteres que andam com o vento + estrelas piscando no céu aberto.
// Inspirado em unvalley/ascii-sky (MIT), implementação própria e bem mais leve.
// Roda pra todo mundo, inclusive com "reduzir movimento" (decisão do dono do site).

const RAMP = ' .:+*ox%#@'
const CELL_W = 10
const CELL_H = 16
const FPS = 20
// Lavender #C085FF no escuro, #7A00DB no claro (paleta canônica do Prism)
const COLOR = { dark: '192,133,255', light: '122,0,219' }

// hash inteiro -> [0,1)
const hash = (x: number, y: number) => {
  let h = (x * 374761393 + y * 668265263) | 0
  h = Math.imul(h ^ (h >>> 13), 1274126177)
  return ((h ^ (h >>> 16)) >>> 0) / 4294967296
}
const fade = (t: number) => t * t * t * (t * (t * 6 - 15) + 10)
const lerp = (a: number, b: number, t: number) => a + (b - a) * t

// value noise 2D suave em [0,1]
const noise = (x: number, y: number) => {
  const xi = Math.floor(x)
  const yi = Math.floor(y)
  const u = fade(x - xi)
  const v = fade(y - yi)
  return lerp(
    lerp(hash(xi, yi), hash(xi + 1, yi), u),
    lerp(hash(xi, yi + 1), hash(xi + 1, yi + 1), u),
    v,
  )
}

// densidade da nuvem em [0,1]: duas oitavas, vento pra direita, deformação lenta
const cloud = (c: number, r: number, t: number) => {
  const x = c * 0.045 - t * 0.35
  const y = r * 0.11 + Math.sin(t * 0.07) * 0.4
  const n = noise(x, y) * 0.67 + noise(x * 2.1 + t * 0.05, y * 2.1) * 0.33
  return Math.min(1, Math.max(0, (n - 0.5) * 2.6))
}

export function Fx() {
  const bg = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const cv = bg.current
    const ctx = cv?.getContext('2d')
    if (!cv || !ctx) return

    const root = document.documentElement
    let w = 0
    let h = 0
    let cols = 0
    let rows = 0
    let raf = 0
    let last = 0
    const t0 = performance.now()

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      w = window.innerWidth
      h = window.innerHeight
      cv.width = w * dpr
      cv.height = h * dpr
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      cols = Math.ceil(w / CELL_W)
      rows = Math.ceil(h / CELL_H) + 1
    }

    const draw = (now: number) => {
      const t = (now - t0) / 1000
      const light = root.getAttribute('data-theme') === 'light'
      const peak = light ? 0.22 : 0.3
      ctx.clearRect(0, 0, w, h)
      ctx.font = `600 ${CELL_H - 4}px ui-monospace, SFMono-Regular, Menlo, Consolas, monospace`
      ctx.textBaseline = 'top'
      ctx.fillStyle = `rgb(${light ? COLOR.light : COLOR.dark})`
      // céu preso à página, não à tela: desloca as linhas pelo scroll
      const sy = window.scrollY
      const r0 = Math.floor(sy / CELL_H)
      const off = sy - r0 * CELL_H
      for (let i = 0; i < rows; i++) {
        const r = i + r0
        for (let c = 0; c < cols; c++) {
          const d = cloud(c, r, t)
          let ch = ''
          let a = 0
          if (d > 0.04) {
            ch = RAMP[Math.min(RAMP.length - 1, 1 + Math.floor(d * (RAMP.length - 1)))]
            a = peak * (0.35 + 0.65 * d)
          } else if (hash(c + 7, r + 3) > 0.993) {
            // estrela: pisca no próprio ritmo
            const tw = 0.5 + 0.5 * Math.sin(t * (1 + hash(c, r) * 2) + hash(r, c) * 6.28)
            ch = tw > 0.8 ? '+' : '.'
            a = peak * (0.3 + 0.7 * tw)
          }
          if (!ch) continue
          ctx.globalAlpha = a
          ctx.fillText(ch, c * CELL_W, i * CELL_H - off)
        }
      }
      ctx.globalAlpha = 1
    }

    const frame = (now: number) => {
      raf = requestAnimationFrame(frame)
      if (now - last < 1000 / FPS) return
      last = now
      draw(now)
    }

    const onVis = () => {
      cancelAnimationFrame(raf)
      if (!document.hidden) raf = requestAnimationFrame(frame)
    }

    resize()
    draw(t0)
    raf = requestAnimationFrame(frame)
    const onScroll = () => draw(performance.now())
    window.addEventListener('resize', resize)
    window.addEventListener('scroll', onScroll, { passive: true })
    document.addEventListener('visibilitychange', onVis)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
      window.removeEventListener('scroll', onScroll)
      document.removeEventListener('visibilitychange', onVis)
    }
  }, [])

  return <canvas ref={bg} className="fx fx-bg" aria-hidden="true" />
}
