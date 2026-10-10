import { useEffect } from 'react'

const DISMISS_MS = 3_800

export function useToastTimer(
  message: string | null,
  dismiss: () => void,
): void {
  useEffect(() => {
    if (!message) return
    const timer = setTimeout(dismiss, DISMISS_MS)
    return () => clearTimeout(timer)
  }, [message, dismiss])
}
