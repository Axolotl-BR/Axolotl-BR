// Visitas do site, somadas aqui e mandadas ao Axolotl Lab a cada minuto (POST /hooks/site).
// O navegador manda o evento pra cá (/api/pulse); IP e user-agent só servem pra limitar
// abuso e separar robô/celular, e nunca são guardados nem repassados. O Lab recebe só número.
// Sem LAB_URL e LAB_INGEST_TOKEN no ambiente, nada é contado.
import { clientIp, createRateLimiter, withSecurity } from './security.js'

const LAB_URL = (process.env.LAB_URL || '').replace(/\/+$/, '')
const TOKEN = process.env.LAB_INGEST_TOKEN || ''
const FLUSH_MS = 60_000
const MAX_BODY = 1024
const MAX_KEYS = 100 // o Lab recusa mais que isso por envio
const PATH = /^\/[A-Za-z0-9._/-]{0,99}$/
const BOT = /bot|crawl|spider|slurp|lighthouse|headless|preview|facebookexternalhit|embed|monitor/i
const MOBILE = /mobi|android|iphone|ipad/i
const HOSTS = [
  [/(^|\.)google\./, 'google'],
  [/(^|\.)bing\.com$/, 'bing'],
  [/(^|\.)duckduckgo\.com$/, 'duckduckgo'],
  [/(^|\.)(discord\.com|discord\.gg|discordapp\.com)$/, 'discord'],
  [/(^|\.)(youtube\.com|youtu\.be)$/, 'youtube'],
  [/(^|\.)tiktok\.com$/, 'tiktok'],
  [/(^|\.)instagram\.com$/, 'instagram'],
  [/(^|\.)(x\.com|twitter\.com|t\.co)$/, 'x'],
  [/(^|\.)github\.com$/, 'github'],
  [/(^|\.)reddit\.com$/, 'reddit'],
  [/(^|\.)whatsapp\.com$/, 'whatsapp'],
]

const limiter = createRateLimiter({ windowMs: 60_000, max: 20 })
const empty = () => ({ pageviews: 0, sessions: 0, discord_clicks: 0, mobile: 0, desktop: 0, pages: new Map(), sources: new Map() })
let acc = empty()
let beats = [] // horários de pageview/sinal no último minuto = abas abertas

export const enabled = Boolean(LAB_URL && TOKEN)

// texto livre (utm) vira slug curto; vazio se não sobrar nada
export const slug = (v) =>
  String(v || '').toLowerCase().replace(/[^a-z0-9._-]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 40)

// de onde veio a sessão: utm manda; senão o domínio do referrer; sem referrer = direto
export function sourceOf(referrer, ownHost, utm) {
  if (slug(utm)) return slug(utm)
  if (!referrer) return 'direct'
  let host
  try {
    host = new URL(referrer).hostname.toLowerCase()
  } catch {
    return 'direct'
  }
  if (host === ownHost) return 'direct'
  const known = HOSTS.find(([re]) => re.test(host))
  return known ? known[1] : slug(host.replace(/^www\./, '')) || 'direct'
}

const bump = (map, key, n = 1) => {
  if (map.has(key) || map.size < MAX_KEYS) map.set(key, (map.get(key) || 0) + n)
}

export function record(evt, { ua = '', host = '' } = {}, now = Date.now()) {
  if (!evt || typeof evt !== 'object' || BOT.test(ua)) return
  if (evt.t === 'on') beats.push(now)
  else if (evt.t === 'ck') acc.discord_clicks += 1
  else if (evt.t === 'pv') {
    beats.push(now)
    acc.pageviews += 1
    const path = typeof evt.p === 'string' && PATH.test(evt.p) ? evt.p : '/outra'
    bump(acc.pages, path)
    if (evt.s === 1) {
      acc.sessions += 1
      acc[MOBILE.test(ua) ? 'mobile' : 'desktop'] += 1
      bump(acc.sources, `${sourceOf(String(evt.r || ''), host, evt.u)}|${slug(evt.c)}`)
    }
  }
  if (beats.length > 100_000) beats = beats.slice(-50_000)
}

// o que vai pro Lab agora; zera o acumulado (volta com merge se o envio falhar)
export function take(now = Date.now()) {
  beats = beats.filter((t) => now - t < FLUSH_MS)
  const batch = acc
  acc = empty()
  return {
    batch,
    body: {
      pageviews: batch.pageviews,
      sessions: batch.sessions,
      discord_clicks: batch.discord_clicks,
      mobile: batch.mobile,
      desktop: batch.desktop,
      online: beats.length,
      pages: Object.fromEntries(batch.pages),
      sources: [...batch.sources].map(([k, sessions]) => {
        const [source, campaign] = k.split('|')
        return { source, campaign, sessions }
      }),
    },
  }
}

function merge(batch) {
  for (const k of ['pageviews', 'sessions', 'discord_clicks', 'mobile', 'desktop']) acc[k] += batch[k]
  for (const [k, n] of batch.pages) bump(acc.pages, k, n)
  for (const [k, n] of batch.sources) bump(acc.sources, k, n)
}

async function flush() {
  const { batch, body } = take()
  try {
    const res = await fetch(`${LAB_URL}/hooks/site`, {
      method: 'POST',
      headers: { 'content-type': 'application/json', authorization: `Bearer ${TOKEN}` },
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(10_000),
    })
    // 4xx = token errado ou envio recusado: reenviar não resolve, então descarta e avisa
    if (res.status >= 500) throw new Error(`HTTP ${res.status}`)
    if (!res.ok) console.warn(`[analytics] Lab recusou o envio: HTTP ${res.status}`)
  } catch (err) {
    merge(batch) // Lab fora do ar: tenta de novo no próximo minuto
    console.warn(`[analytics] envio ao Lab falhou: ${err.message}`)
  }
}

if (enabled) setInterval(flush, FLUSH_MS).unref()

export function handleCollect(req, res) {
  const done = () => {
    res.writeHead(204, withSecurity({ 'cache-control': 'no-store' }))
    res.end()
  }
  if (!enabled || limiter.check(clientIp(req)) > 0) {
    req.resume()
    return done()
  }
  let size = 0
  const chunks = []
  req.on('data', (c) => {
    size += c.length
    if (size > MAX_BODY) req.destroy()
    else chunks.push(c)
  })
  req.on('end', () => {
    try {
      const host = String(req.headers.host || '').split(':')[0].toLowerCase()
      record(JSON.parse(Buffer.concat(chunks).toString('utf8')), { ua: String(req.headers['user-agent'] || ''), host })
    } catch {
      /* corpo inválido: ignora */
    }
    done()
  })
}
