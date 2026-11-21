import react from '@vitejs/plugin-react'
import { defineConfig, type Plugin } from 'vite'

// O site mostra as animações pra todo mundo, mesmo com "reduzir movimento" ligado
// no sistema. O prism zera tudo com !important nesse caso (CSS) e no toast (hook),
// então a media query dele vira "not all", que nunca casa.
const ignorePrismReducedMotion: Plugin = {
  name: 'ignore-prism-reduced-motion',
  enforce: 'pre',
  transform(code, id) {
    if (!id.includes('/node_modules/prism/') || !code.includes('prefers-reduced-motion: reduce')) return
    return { code: code.replaceAll('(prefers-reduced-motion: reduce)', 'not all'), map: null }
  },
}

export default defineConfig({
  plugins: [ignorePrismReducedMotion, react()],
  // base absoluta: host próprio na raiz (estilo duneco.gg), sem subpasta
  base: '/',
  server: {
    port: 5173,
    open: true,
  },
  preview: {
    // O preview herda `server.open` por padrão. Num container não existe
    // navegador, então o vite spawna `xdg-open` e morre com ENOENT.
    open: false,
  },
  // prerender: o SSR precisa empacotar o prism (css/ESM) em vez de importar do node_modules
  ssr: { noExternal: ['prism', 'stick-it-up', 'lucide-react'] },
  build: {
    // teto de aviso do bundle; falha o build se estourar
    chunkSizeWarningLimit: 800,
  },
})
