// Servidor estático de produção para o AXOLOTL HUB.
//
// A ShardCloud roteia a porta 80 e só alcança o container se ele estiver
// escutando em 0.0.0.0:80. O `vite preview` não serve: sobe em
// localhost:4173, que é a causa raiz do 502.
//
// Só stdlib — nenhuma dependência nova.

import { createReadStream, existsSync, statSync } from 'node:fs'
import { createServer } from 'node:http'
import { extname, join, resolve, sep } from 'node:path'
import { createGzip } from 'node:zlib'

const RAIZ = resolve('dist')
const PORTA = 80
const HOST = '0.0.0.0'
const MAX_AGE_ASSET = 31536000 // 1 ano — filenames de /assets têm hash
const COMPRIMIR = new Set(['.html', '.js', '.css', '.svg', '.json', '.txt'])

const TIPOS = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.avif': 'image/avif',
  '.ico': 'image/x-icon',
  '.json': 'application/json; charset=utf-8',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
  '.txt': 'text/plain; charset=utf-8',
  '.webmanifest': 'application/manifest+json',
  '.xml': 'application/xml; charset=utf-8',
}

/**
 * Resolve o caminho pedido dentro de RAIZ.
 * Retorna null se tentar escapar da raiz (path traversal).
 */
function resolver(caminho) {
  let bruto = caminho.split('?')[0].split('#')[0]
  try {
    bruto = decodeURIComponent(bruto)
  } catch {
    return null
  }
  if (bruto === '/' || bruto === '') bruto = '/index.html'

  const alvo = resolve(join(RAIZ, bruto))
  if (alvo !== RAIZ && !alvo.startsWith(RAIZ + sep)) return null
  return alvo
}

function arquivoValido(alvo) {
  if (!existsSync(alvo)) return null
  const st = statSync(alvo)
  if (st.isDirectory()) {
    const indice = join(alvo, 'index.html')
    return existsSync(indice) ? indice : null
  }
  return st.isFile() ? alvo : null
}

function responderErro(res, codigo, arquivo) {
  if (!arquivo || !existsSync(arquivo)) {
    res.writeHead(codigo, { 'content-type': 'text/plain; charset=utf-8' })
    res.end(`${codigo}\n`)
    return
  }
  res.writeHead(codigo, { 'content-type': TIPOS['.html'], 'cache-control': 'no-cache' })
  createReadStream(arquivo).pipe(res)
}

createServer((req, res) => {
  if (req.method !== 'GET' && req.method !== 'HEAD') {
    res.writeHead(405, { allow: 'GET, HEAD' })
    res.end()
    return
  }

  const alvo = resolver(req.url || '/')
  if (alvo === null) {
    responderErro(res, 400, join(RAIZ, '400.html'))
    return
  }

  const encontrado = arquivoValido(alvo)
  if (!encontrado) {
    // SPA: cai no 404.html que o Vite gera, que recarrega a home.
    responderErro(res, 404, join(RAIZ, '404.html'))
    return
  }

  const ext = extname(encontrado).toLowerCase()
  const ehAsset = encontrado.includes(`${sep}assets${sep}`)
  const cabecalhos = {
    'content-type': TIPOS[ext] || 'application/octet-stream',
    'x-content-type-options': 'nosniff',
    'referrer-policy': 'strict-origin-when-cross-origin',
  }
  cabecalhos['cache-control'] = ehAsset
    ? `public, max-age=${MAX_AGE_ASSET}, immutable`
    : 'public, max-age=0, must-revalidate'

  const aceitaGzip = /\bgzip\b/.test(req.headers['accept-encoding'] || '')

  if (aceitaGzip && COMPRIMIR.has(ext)) {
    cabecalhos['content-encoding'] = 'gzip'
    cabecalhos.vary = 'Accept-Encoding'
    res.writeHead(200, cabecalhos)
    if (req.method === 'HEAD') return res.end()
    createReadStream(encontrado).pipe(createGzip()).pipe(res)
    return
  }

  res.writeHead(200, cabecalhos)
  if (req.method === 'HEAD') return res.end()
  createReadStream(encontrado).pipe(res)
}).listen(PORTA, HOST, () => {
  console.log(`AXOLOTL HUB em http://${HOST}:${PORTA} servindo ${RAIZ}`)
})
