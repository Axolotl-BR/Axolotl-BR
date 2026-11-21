import { useEffect, useRef, useState } from 'react'
import walkGif from '../assets/images/axolote-anda.gif'
import bucketGif from '../assets/images/axolote-balde.gif'

// Axolote de pixel que anda de um lado pro outro no rodapé da tela.
// Clicou e segurou: vai pro balde e para; soltou: volta a andar.
const SPEED = 38 // px/s
// largura de cada GIF em pixels da arte (o balde é mais estreito e mais alto)
const WALK_W = 23
const BUCKET_W = 18

export function Mascot() {
  const [held, setHeld] = useState(false)
  const el = useRef<HTMLDivElement>(null)
  const heldRef = useRef(false)

  useEffect(() => {
    const node = el.current
    if (!node) return
    let x = Math.random() * (window.innerWidth - 80)
    let dir = Math.random() < 0.5 ? -1 : 1
    let last = 0
    let raf = 0
    const step = (t: number) => {
      const dt = Math.min((t - (last || t)) / 1000, 0.1) // aba em segundo plano não teleporta
      last = t
      const max = window.innerWidth - node.offsetWidth
      if (!heldRef.current) {
        x += dir * SPEED * dt
        if (x <= 0 || x >= max) dir = x <= 0 ? 1 : -1
      }
      x = Math.max(0, Math.min(x, max))
      // a arte olha pra esquerda; andando pra direita espelha
      node.style.transform = `translateX(${x}px) scaleX(${-dir})`
      raf = requestAnimationFrame(step)
    }
    raf = requestAnimationFrame(step)
    return () => cancelAnimationFrame(raf)
  }, [])

  const grab = (e: React.PointerEvent) => {
    e.preventDefault()
    e.currentTarget.setPointerCapture(e.pointerId)
    heldRef.current = true
    setHeld(true)
  }
  const drop = () => {
    heldRef.current = false
    setHeld(false)
  }

  return (
    <div
      ref={el}
      className={held ? 'mascot is-held' : 'mascot'}
      style={{ width: `calc(${WALK_W}px * var(--mascot-scale))` }}
      onPointerDown={grab}
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
