import React, { useEffect, useState } from 'react'
import ReactDOM from 'react-dom/client'
import { DesignSystemProvider, ToastProvider, type PrismTheme } from 'prism'
import 'prism/styles.css'
import './styles/tokens.css'
import './styles/global.css'
import './styles/animations.css'
import './styles/components.css'
import './styles/sections.css'
import { App } from './App'
import { LangProvider } from './lib/i18n'

// mesma chave que public/theme.js lê antes do React montar (evita piscar o tema errado)
const THEME_KEY = 'axl-theme'

function initialTheme(): PrismTheme {
  try {
    return localStorage.getItem(THEME_KEY) === 'light' ? 'light' : 'dark'
  } catch {
    return 'dark'
  }
}

function Root() {
  const [theme, setTheme] = useState<PrismTheme>(initialTheme)

  useEffect(() => {
    // o provider só pinta o wrapper; o html (shell, scrollbar, barra do navegador) segue aqui
    document.documentElement.dataset.theme = theme
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', theme === 'light' ? '#fafafc' : '#09090d')
    try {
      localStorage.setItem(THEME_KEY, theme)
    } catch {
      /* sem storage: só não lembra a escolha */
    }
  }, [theme])

  return (
    <DesignSystemProvider theme={theme} onThemeChange={setTheme}>
      <ToastProvider>
        <LangProvider>
          <App />
        </LangProvider>
      </ToastProvider>
    </DesignSystemProvider>
  )
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Root />
  </React.StrictMode>,
)
