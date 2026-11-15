// Injeta o HTML renderizado do React em dist/index.html (crawlers sem JS veem o conteúdo real).
// Falha de prerender não derruba o deploy: o site continua funcionando como SPA.
import { readFileSync, writeFileSync, rmSync } from 'node:fs'
import { pathToFileURL } from 'node:url'
import { resolve } from 'node:path'

const page = resolve('dist/index.html')
const ssr = resolve('dist-ssr/entry-server.js')
try {
  const { render } = await import(pathToFileURL(ssr).href)
  const html = readFileSync(page, 'utf8')
  const out = html.replace(/<div id="root">[\s\S]*?<\/div>\s*(?=<script|<\/body>)/, `<div id="root">${render()}</div>\n    `)
  if (out === html) throw new Error('#root não encontrado no dist/index.html')
  writeFileSync(page, out)
  console.log('prerender ok:', out.length, 'bytes')
} catch (err) {
  console.warn('prerender falhou, seguindo como SPA:', err.message)
} finally {
  rmSync(resolve('dist-ssr'), { recursive: true, force: true })
}
