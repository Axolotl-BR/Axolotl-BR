import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [react()],
  // base absoluta: host próprio na raiz (estilo duneco.gg), sem subpasta
  base: '/',
  // data de geração (pt-BR) pra colophon honesto no rodapé
  define: {
    __BUILD_DATE__: JSON.stringify(
      new Date().toLocaleDateString('pt-BR', { timeZone: 'America/Sao_Paulo' }),
    ),
  },
  server: {
    port: 5173,
    open: true,
  },
  preview: {
    // O preview herda `server.open` por padrão. Num container não existe
    // navegador, então o vite spawna `xdg-open` e morre com ENOENT.
    open: false,
  },
  build: {
    // teto de aviso do bundle; falha o build se estourar
    chunkSizeWarningLimit: 800,
  },
})
