import React from 'react'
import ReactDOM from 'react-dom/client'
import { ToastProvider } from 'prism'
import 'prism/styles.css'
import './styles/tokens.css'
import './styles/global.css'
import './styles/animations.css'
import './styles/components.css'
import './styles/sections.css'
import { App } from './App'
import { LangProvider } from './lib/i18n'
import { ThemeShell } from './lib/theme'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ThemeShell>
      <ToastProvider>
        <LangProvider>
          <App />
        </LangProvider>
      </ToastProvider>
    </ThemeShell>
  </React.StrictMode>,
)
