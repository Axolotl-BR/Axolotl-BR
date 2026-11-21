import { useEffect, useRef, useState } from 'react'
import walkGif from '../assets/images/axolote-anda.gif'
import bucketGif from '../assets/images/axolote-balde.gif'

// Axolote de pixel que anda de um lado pro outro no rodapé da tela.
// Clicou e segurou: vira balde e acompanha o mouse/dedo. Soltou: leva a velocidade
// do arrasto (dá pra jogar), cai com gravidade, quica e volta a andar quando assenta.
const SPEED = 38 // px/s
const GRAVITY = 1800 // px/s²
const MAX_V = 3000
// largura de cada GIF em pixels da arte (o balde é mais estreito e mais alto)
const WALK_W = 23
const BUCKET_W = 18

export function Mascot() {
  const [held, setHeld] = useState(false)
  const el = useRef<HTMLDivElement>(null)
  const heldRef = useRef(false)
  const ptr = useRef({ x: 0, y: 0, ox: 0, oy: 0 }) // ponteiro + onde o axolote foi agarrado
  const phys = useRef({ x: 0, y: 0, vx: 0, vy: 0 }) // y = altura acima do chão

  useEffect(() => {
    const node = el.current
    if (!node) return
    const s = phys.current
    s.x = Math.random() * (window.innerWidth - 80)
    let dir = Math.random() < 0.5 ? -1 : 1
    let last = 0
    let raf = 0
    const step = (t: number) => {
      const dt = Math.min((t - (last || t)) / 1000, 0.05) // aba em segundo plano não teleporta
      last = t
      const w = node.offsetWidth
      const h = node.offsetHeight
      const maxX = Math.max(0, window.innerWidth - w)
      const maxY = Math.max(0, window.innerHeight - h)

      if (heldRef.current) {
        const p = ptr.current
        const nx = p.x - p.ox
        const ny = window.innerHeight - p.y - p.oy
        if (dt > 0) {
          // velocidade suavizada: é ela que vira o arremesso ao soltar
          s.vx += ((nx - s.x) / dt - s.vx) * 0.35
          s.vy += ((ny - s.y) / dt - s.vy) * 0.35
        }
        s.x = nx
        s.y = ny
      } else if (s.y > 0 || Math.abs(s.vx) > 12 || s.vy !== 0) {
        s.vy -= GRAVITY * dt
        s.x += s.vx * dt
        s.y += s.vy * dt
        if (s.y <= 0) {
          s.y = 0
          s.vy = Math.abs(s.vy) > 220 ? -s.vy * 0.45 : 0
          s.vx *= Math.exp(-6 * dt) // atrito no chão
        }
        if (s.y >= maxY) {
          s.y = maxY
          s.vy = -Math.abs(s.vy) * 0.45
        }
        if (s.x <= 0 || s.x >= maxX) {
          s.x = s.x <= 0 ? 0 : maxX
          s.vx *= -0.5
        }
        if (s.y === 0 && s.vy === 0 && Math.abs(s.vx) <= 12) {
          s.vx = 0
          dir = Math.random() < 0.5 ? -1 : 1
        } else if (Math.abs(s.vx) > 30) dir = s.vx > 0 ? 1 : -1
      } else {
        s.x += dir * SPEED * dt
        if (s.x <= 0 || s.x >= maxX) dir = s.x <= 0 ? 1 : -1
      }
      s.x = Math.max(0, Math.min(s.x, maxX))
      s.y = Math.max(0, Math.min(s.y, maxY))
      // a arte olha pra esquerda; andando pra direita espelha
      node.style.transform = `translate(${s.x}px, ${-s.y}px) scaleX(${-dir})`
      raf = requestAnimationFrame(step)
    }
    raf = requestAnimationFrame(step)
    return () => cancelAnimationFrame(raf)
  }, [])

  const grab = (e: React.PointerEvent) => {
    e.preventDefault()
    e.currentTarget.setPointerCapture(e.pointerId)
    const s = phys.current
    ptr.current = {
      x: e.clientX,
      y: e.clientY,
      ox: e.clientX - s.x,
      oy: window.innerHeight - e.clientY - s.y,
    }
    s.vx = 0
    s.vy = 0
    heldRef.current = true
    setHeld(true)
  }
  const move = (e: React.PointerEvent) => {
    if (heldRef.current) {
      ptr.current.x = e.clientX
      ptr.current.y = e.clientY
    }
  }
  const drop = () => {
    const s = phys.current
    s.vx = Math.max(-MAX_V, Math.min(s.vx, MAX_V))
    s.vy = Math.max(-MAX_V, Math.min(s.vy, MAX_V))
    heldRef.current = false
    setHeld(false)
  }

  return (
    <div
      ref={el}
      className={held ? 'mascot is-held' : 'mascot'}
      style={{ width: `calc(${WALK_W}px * var(--mascot-scale))` }}
      onPointerDown={grab}
      onPointerMove={move}
      onPointerUp={drop}
      onPointerCancel={drop}
      onContextMenu={(e) => e.preventDefault()}
      aria-hidden="true"
    >
      <img
        src={held ? bucketGif : walkGif}
        style={{ width: `calc(${held ? BUCKET_W : WALK_W}px * var(--mascot-scale))` }}
        alt=""
        draggable={false}
      />
    </div>
  )
}
