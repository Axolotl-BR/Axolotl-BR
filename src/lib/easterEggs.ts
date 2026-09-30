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
    `%c🫟 %caxolotl.online%c
// você achou o primeiro easter egg.
// tem mais coisa por aí. digita "axolote" e descobre.`,
    'font-size:28px',
    'color:#a45dff;font-weight:700;font-size:16px',
    'color:#7c7398;font-family:monospace;font-size:12px',
  )
}

export const eggMessages = {
  typing: '🫟 o axolote sentiu isso. continue digitando… na verdade não, você já achou.',
  mascot: '🫟 é sério que você ficou clicando no axolote? tá. agora ele é seu amigo.',
  logo: '⚙️ axolotl br v1.0.0 — build.axolotl · nenhum axolote foi movido durante a compilação.',
  footer: '🐛 /dev/log: segura esse axolote e presta atenção. nada vai acontecer. ou vai.',
} as const