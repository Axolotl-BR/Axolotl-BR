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

// ── hardening app-layer (DDoS volumétrico é papel do host/CDN;
// aqui: abuso, flood barato, header injection, sniffing) ──
const MAX_URL = 2048
const API_JANELA_MS = 60_000
const API_MAX_POR_IP = 30
const STATIC_JANELA_MS = 60_000
const STATIC_MAX_POR_IP = 300
const MAX_CONEXOES = 200
let conexoesAbertas = 0
const baldes = new Map() // ip -> { api:{n,reset}, static:{n,reset} }

function ipDe(req) {
  const fwd = req.headers['x-forwarded-for']
  if (typeof fwd === 'string' && fwd.length > 0) return fwd.split(',')[0].trim().slice(0, 64)
  return (req.socket && req.socket.remoteAddress ? req.socket.remoteAddress : 'desconhecido').slice(0, 64)
}

function limiteExcedido(ip,Api) {
  const agora = Date.now()
  let b = baldes.get(ip)
  if (!b) {
    b = {
      api: { n: 0, reset: agora + API_JANELA_MS },
      static: { n: 0, reset: agora + STATIC_JANELA_MS },
    }
    baldes.set(ip, b)
  }
  const slot = Api ? b.api : b.static
  const teto = Api ? API_MAX_POR_IP : STATIC_MAX_POR_IP
  const janela = Api ? API_JANELA_MS : STATIC_JANELA_MS
  if (agora > slot.reset) {
    slot.n = 0
    slot.reset = agora + janela
  }
  slot.n += 1
  if (slot.n > teto) {
    return Math.max(1, Math.ceil((slot.reset - agora) / 1000))
  }
  return 0
}

setInterval(() => {
  const agora = Date.now()
  for (const [ip, b] of baldes) {
    if (agora > b.api.reset && agora > b.static.reset) baldes.delete(ip)
  }
  if (baldes.size > 2000) {
    const chaves = [...baldes.keys()].slice(0, 500)
    for (const k of chaves) baldes.delete(k)
  }
}, 60_000).unref()

const CABECALHOS_SEG = {
  'x-content-type-options': 'nosniff',
  'x-frame-options': 'DENY',
  'referrer-policy': 'strict-origin-when-cross-origin',
  'permissions-policy': 'geolocation=(), microphone=(), camera=(), payment=()',
  'cross-origin-opener-policy': 'same-origin',
  'content-security-policy':
    "default-src 'self'; script-src 'self'; style-src 'self' https://fonts.googleapis.com 'unsafe-inline'; " +
    "font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https:; connect-src 'self'; " +
    "object-src 'none'; base-uri 'self'; form-action 'self'; frame-ancestors 'none'",
}

function comSeguranca(h) {
  return { ...CABECALHOS_SEG, ...h }
}

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
    res.writeHead(codigo, comSeguranca({ 'content-type': 'text/plain; charset=utf-8' }))
    res.end(`${codigo}\n`)
    return
  }
  res.writeHead(codigo, comSeguranca({ 'content-type': TIPOS['.html'], 'cache-control': 'no-cache' }))
  const fluxo = createReadStream(arquivo)
  fluxo.on('error', () => {
    try { res.destroy() } catch { /* cliente já foi embora */ }
  })
  fluxo.pipe(res)
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

function responderJson(res, obj, metodo) {
  const corpo = JSON.stringify(obj)
  res.writeHead(200, comSeguranca({
    'content-type': 'application/json; charset=utf-8',
    'cache-control': 'no-store',
  }))
  if (metodo === 'HEAD') return res.end()
  res.end(corpo)
}

function responderLimite(res, retryAfter) {
  res.writeHead(429, comSeguranca({
    'content-type': 'application/json; charset=utf-8',
    'cache-control': 'no-store',
    'retry-after': String(retryAfter),
  }))
  res.end(JSON.stringify({ erro: 'muitas requisições, tenta de novo já já' }))
}

async function tocandoAgora(res, metodo) {
  if (!SPOTIFY.id || !SPOTIFY.secret || !SPOTIFY.refresh) {
    responderJson(res, { playing: false }, metodo)
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
      responderJson(res, { playing: false }, metodo)
      return
    }
    const data = await r.json()
    const item = data && data.item
    if (!data || data.is_playing !== true || !item) {
      responderJson(res, { playing: false }, metodo)
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
    }, metodo)
  } catch {
    responderJson(res, { playing: false }, metodo)
  }
}

const servidor = createServer((req, res) => {
  conexoesAbertas += 1
  if (conexoesAbertas > MAX_CONEXOES) {
    conexoesAbertas -= 1
    res.writeHead(503, comSeguranca({ 'content-type': 'text/plain; charset=utf-8', 'retry-after': '5' }))
    res.end('ocupado, tenta de novo\n')
    try { req.socket.destroy() } catch { /* ignora */ }
    return
  }
  res.on('finish', () => { conexoesAbertas -= 1 })
  res.on('close', () => {
    // finish já descontou na maioria dos casos; garante sem negativar
    if (conexoesAbertas > 0 && res.writableEnded === false) conexoesAbertas -= 1
  })
  req.on('aborted', () => { try { res.destroy() } catch { /* ignora */ } })

  if (req.method !== 'GET' && req.method !== 'HEAD') {
    res.writeHead(405, comSeguranca({ allow: 'GET, HEAD' }))
    res.end()
    return
  }

  const urlCrua = req.url || '/'
  if (urlCrua.length > MAX_URL) {
    responderErro(res, 414, join(RAIZ, '404.html'))
    return
  }

  const rota = urlCrua.split('?')[0]
  const ehApi = rota === '/api/now-playing' || rota === '/api/health'
  const espera = limiteExcedido(ipDe(req), ehApi)
  if (espera > 0) {
    responderLimite(res, espera)
    return
  }

  if (rota === '/api/health') {
    responderJson(res, { ok: true }, req.method)
    return
  }
  if (rota === '/api/now-playing') {
    tocandoAgora(res, req.method)
    return
  }

  const alvo = resolver(urlCrua)
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
  const cabecalhos = comSeguranca({
    'content-type': TIPOS[ext] || 'application/octet-stream',
  })
  cabecalhos['cache-control'] = ehAsset
    ? `public, max-age=${MAX_AGE_ASSET}, immutable`
    : 'public, max-age=0, must-revalidate'

  const aceitaGzip = /\bgzip\b/.test(req.headers['accept-encoding'] || '')

  const enviarArquivo = (comGzip) => {
    if (comGzip) {
      cabecalhos['content-encoding'] = 'gzip'
      cabecalhos.vary = 'Accept-Encoding'
    }
    res.writeHead(200, cabecalhos)
    if (req.method === 'HEAD') return res.end()
    const fluxo = createReadStream(encontrado)
    const saida = comGzip ? createGzip() : null
    const quebrou = () => {
      try { fluxo.destroy() } catch { /* ignora */ }
      try { if (saida) saida.destroy() } catch { /* ignora */ }
      try { res.destroy() } catch { /* ignora */ }
    }
    fluxo.on('error', quebrou)
    if (saida) {
      saida.on('error', quebrou)
      fluxo.pipe(saida).pipe(res)
    } else {
      fluxo.pipe(res)
    }
  }

  if (aceitaGzip && COMPRIMIR.has(ext)) {
    enviarArquivo(true)
    return
  }

  enviarArquivo(false)
})

servidor.maxHeadersCount = 20
servidor.headersTimeout = 10_000
servidor.requestTimeout = 10_000
servidor.keepAliveTimeout = 5_000
servidor.listen(PORTA, HOST, () => {
  console.log(`AXOLOTL BR em http://${HOST}:${PORTA} servindo ${RAIZ}`)
})
