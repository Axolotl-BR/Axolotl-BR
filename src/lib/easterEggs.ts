import { useEffect, useRef } from 'react'

// detector de easter egg por teclado:
// digite "axolote" em qualquer lugar do site e veja o que acontece
const SECRET = 'axolote'

export function useTypingEgg(onTrigger: () => void): void {
  const buffer = useRef('')
  const cb = useRef(onTrigger)
  cb.current = onTrigger

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key.length !== 1) return
      const target = e.target as HTMLElement | null
      if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA')) return
      buffer.current = (buffer.current + e.key.toLowerCase()).slice(-SECRET.length)
      if (buffer.current === SECRET) {
        buffer.current = ''
        cb.current()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])
}

export function consoleNote(): void {
  console.log(
    `%cAXOLOTL BR%c
// você achou o primeiro easter egg.
// tem mais coisa por aí. digita "axolote" e descobre.`,
    'color:#a45dff;font-weight:800;font-size:16px',
    'color:#7c7398;font-family:monospace;font-size:12px',
  )
}

export const eggMessages = {
  typing: 'achou. o axolote sentiu isso.',
  mascot: 'é sério que você ficou cutucando o axolote? tá. agora ele é seu amigo.',
} as const