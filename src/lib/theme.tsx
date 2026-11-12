import { useEffect, useState, type ReactNode } from 'react'
import { DesignSystemProvider, type PrismTheme } from 'prism'

const KEY = 'axl-theme'

function initial(): PrismTheme {
  try {
    return localStorage.getItem(KEY) === 'light' ? 'light' : 'dark'
  } catch {
    return 'dark'
  }
}

// escuro continua o padrão da marca; claro é escolha do visitante
export function ThemeShell({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<PrismTheme>(initial)

  useEffect(() => {
    // o shell fora do provider (canvas, scrollbar) lê data-scheme (ver tokens.css)
    document.documentElement.dataset.scheme = theme
    document
      .querySelector('meta[name="theme-color"]')
      ?.setAttribute('content', theme === 'light' ? '#fafafc' : '#09090d')
    try {
      localStorage.setItem(KEY, theme)
    } catch {
      /* sem storage: só não lembra a escolha */
    }
  }, [theme])

  return (
    <DesignSystemProvider theme={theme} onThemeChange={setTheme}>
      {children}
    </DesignSystemProvider>
  )
}
