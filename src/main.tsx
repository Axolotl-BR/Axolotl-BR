import React from 'react'
import ReactDOM from 'react-dom/client'
import { DesignSystemProvider, ToastProvider } from 'prism'
import 'prism/styles.css'
import './styles/tokens.css'
import './styles/global.css'
import './styles/animations.css'
import './styles/components.css'
import './styles/sections.css'
import { App } from './App'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    {/* tema fixo escuro — a marca não tem troca de tema; sem onThemeChange o useTheme trava */}
    <DesignSystemProvider theme="dark">
      <ToastProvider>
        <App />
      </ToastProvider>
    </DesignSystemProvider>
  </React.StrictMode>,
)
