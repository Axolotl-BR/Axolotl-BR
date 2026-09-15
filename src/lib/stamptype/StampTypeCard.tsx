import { useEffect, useRef } from 'react'
import { StampType } from './engine'
import { WORLDS } from './params'

export function StampTypeCard() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    let engine: StampType | null = null
    let onScreen = false
    let hidden = false

    const sync = () => {
      if (!engine || reduced) return
      if (onScreen && !hidden) engine.start()
      else engine.stop()
    }

    const raf = requestAnimationFrame(() => {
      if (!canvasRef.current) return
      engine = new StampType(canvas)
      if (!engine.ok) return
      if (reduced) engine.renderStill()
      else sync()

      if (document.fonts?.load) {
        const probe = document.createElement('span')
        probe.style.cssText = 'position:absolute;visibility:hidden'
        probe.style.fontFamily = 'var(--font-display)'
        probe.textContent = 'Ag'
        document.body.appendChild(probe)
        const fam = getComputedStyle(probe)
          .fontFamily.split(',')[0]
          .replace(/["']/g, '')
          .trim()
        probe.remove()
        if (fam) {
          document.fonts
            .load(`600 1em "${fam}"`)
            .then(() => engine?.setFont(`"${fam}", sans-serif`), () => {})
        }
      }
    })

    const io = new IntersectionObserver(
      (es) => {
        onScreen = es[0]?.isIntersecting ?? false
        sync()
      },
      { threshold: 0.2 },
    )
    io.observe(canvas)

    const onVis = () => {
      hidden = document.hidden
      sync()
    }
    document.addEventListener('visibilitychange', onVis)

    let rt = 0
    const onResize = () => {
      window.clearTimeout(rt)
      rt = window.setTimeout(() => engine?.resize(), 120)
    }
    window.addEventListener('resize', onResize)

    return () => {
      cancelAnimationFrame(raf)
      io.disconnect()
      document.removeEventListener('visibilitychange', onVis)
      window.removeEventListener('resize', onResize)
      window.clearTimeout(rt)
      engine?.destroy()
    }
  }, [])

  return (
    <div
      data-canvas-card
      role="img"
      aria-label="Um pôster animado de tipografia cinética. Quatro linhas de texto sobre barras de cor chapada entram voando das bordas em saltos quadrados ao longo de uma trilha, param para serem lidas e depois se espalham para fora do quadro. Toda linha que se move deixa blocos grossos de cor sólida no lugar por onde passou. Cada ciclo repete a mesma coreografia em uma nova paleta com novas palavras, e o ciclo seguinte começa antes do anterior terminar, então as trilhas se cruzam e inundam a tela de cor na troca de cena."
      style={{ backgroundColor: WORLDS[0].bg }}
      className="poster-card poster-card-stamp"
    >
      <canvas ref={canvasRef} className="poster-canvas" />
    </div>
  )
}