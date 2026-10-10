import { useEffect, useRef } from 'react'

// detector de easter egg por teclado:
// digite o segredo em qualquer lugar do site e veja o que acontece
export function useTypingEgg(secret: string, onTrigger: () => void): void {
  const buffer = useRef('')
  const cb = useRef(onTrigger)
  cb.current = onTrigger

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key.length !== 1) return
      const target = e.target as HTMLElement | null
      if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA')) return
      buffer.current = (buffer.current + e.key.toLowerCase()).slice(-secret.length)
      if (buffer.current === secret) {
        buffer.current = ''
        cb.current()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [secret])
}

export function consoleNote(): void {
  console.log(
    `%cAXOLOTL BR%c
// você achou o primeiro easter egg.
// tem mais coisa por aí. digita "axolote" e descobre.
// psst: digita cicada() aqui mesmo no console.`,
    'color:#a845ff;font-weight:800;font-size:16px',
    'color:#7c7398;font-family:monospace;font-size:12px',
  )
}

export function cicadaNote(): void {
  console.log(
    `%c3301%c
// a cigarra cantou.
// poucos notam. menos ainda procuram.`,
    'color:#a845ff;font-weight:800;font-size:22px',
    'color:#7c7398;font-family:monospace;font-size:12px',
  )
}

declare global {
  interface Window {
    cicada?: () => string
  }
}

// arma o easter egg do console: digitar cicada() mostra a mensagem.
// (3301 puro o navegador avalia como número — por isso o atalho é a função.)
export function armCicadaConsole(onTrigger: () => void): () => void {
  const previous = window.cicada
  window.cicada = () => {
    cicadaNote()
    onTrigger()
    return '3301'
  }
  return () => {
    if (previous === undefined) delete window.cicada
    else window.cicada = previous
  }
}

export const eggMessages = {
  typing: 'achou. o axolote sentiu isso.',
  mascot: 'é sério que você ficou cutucando o axolote? tá. agora ele é seu amigo.',
  cicada: 'cicada · 3301',
} as const
