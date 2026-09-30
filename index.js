// Servidor estático de produção para o site AXOLOTL BR.
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

// ── spotify: "tocando agora" ─────────────────────
// Credenciais só por variável de ambiente — nunca commitar segredo.
// SPOTIFY_CLIENT_ID / SPOTIFY_CLIENT_SECRET / SPOTIFY_REFRESH_TOKEN.
// Sem elas, a API responde { playing: false } e o site mostra o fallback.
const SPOTIFY = {
  id: process.env.SPOTIFY_CLIENT_ID || '',
  secret: process.env.SPOTIFY_CLIENT_SECRET || '',
  refresh: process.env.SPOTIFY_REFRESH_TOKEN || '',
}

let tokenCache = null // { access, expiresAt }

async function spotifyAccess() {
  if (tokenCache && tokenCache.expiresAt > Date.now() + 30000) return tokenCache.access
  const basic = Buffer.from(`${SPOTIFY.id}:${SPOTIFY.secret}`).toString('base64')
  const corpo = new URLSearchParams({ grant_type: 'refresh_token', refresh_token: SPOTIFY.refresh })
  const r = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: { Authorization: `Basic ${basic}`, 'content-type': 'application/x-www-form-urlencoded' },
    body: corpo,
  })
  if (!r.ok) throw new Error(`spotify token: ${r.status}`)
  const data = await r.json()
  tokenCache = { access: data.access_token, expiresAt: Date.now() + (data.expires_in || 3600) * 1000 }
  return tokenCache.access
}

function responderJson(res, obj) {
  const corpo = JSON.stringify(obj)
  res.writeHead(200, {
    'content-type': 'application/json; charset=utf-8',
    'cache-control': 'no-store',
  })
  res.end(corpo)
}

async function tocandoAgora(res) {
  if (!SPOTIFY.id || !SPOTIFY.secret || !SPOTIFY.refresh) {
    responderJson(res, { playing: false })
    return
  }
  try {
    const tocar = async (access) =>
      fetch('https://api.spotify.com/v1/me/player/currently-playing', {
        headers: { Authorization: `Bearer ${access}` },
      })
    let r = await tocar(await spotifyAccess())
    if (r.status === 401) {
      tokenCache = null
      r = await tocar(await spotifyAccess())
    }
    if (r.status === 204 || !r.ok) {
      responderJson(res, { playing: false })
      return
    }
    const data = await r.json()
    const item = data && data.item
    if (!data || data.is_playing !== true || !item) {
      responderJson(res, { playing: false })
      return
    }
    const ehEpisodio = item.type === 'episode'
    const artist = ehEpisodio
      ? (item.show && item.show.name) || 'podcast'
      : (item.artists || []).map((a) => a.name).join(', ') || 'desconhecido'
    const image = (item.album && item.album.images && item.album.images[1]) ||
      (item.images && item.images[1]) || null
    responderJson(res, {
      playing: true,
      title: item.name || 'sem título',
      artist,
      image: image ? image.url : null,
      url: (item.external_urls && item.external_urls.spotify) || null,
    })
  } catch {
    responderJson(res, { playing: false })
  }
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

  const rota = (req.url || '/').split('?')[0]
  if (rota === '/api/now-playing') {
    tocandoAgora(res)
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
  console.log(`AXOLOTL BR em http://${HOST}:${PORTA} servindo ${RAIZ}`)
})
