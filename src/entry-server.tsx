import { renderToString } from 'react-dom/server'
import { DesignSystemProvider, ToastProvider } from 'prism'
import { App } from './App'
import { LangProvider } from './lib/i18n'

// Usado só no build (scripts/prerender.mjs): gera o HTML que o crawler recebe.
export function render() {
  return renderToString(
    <DesignSystemProvider theme="dark">
      <ToastProvider>
        <LangProvider>
          <App />
        </LangProvider>
      </ToastProvider>
    </DesignSystemProvider>,
  )
}
