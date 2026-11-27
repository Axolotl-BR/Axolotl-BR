// Servidor estático de produção para o site AXOLOTL BR.
//
// A ShardCloud roteia a porta 80 e só alcança o container se ele estiver
// escutando em 0.0.0.0:80. O `vite preview` não serve: sobe em
// localhost:4173, que é a causa raiz do 502.
//
// Só stdlib — nenhuma dependência nova. Lógica mora em server/.
import './server/env.js' // antes de tudo: spotify.js lê process.env ao carregar
import { createServer } from 'node:http'
import { join } from 'node:path'
import {
  HOST,
  PORT,
  ROOT,
  MAX_URL_LENGTH,
  MAX_CONNECTIONS,
  apiRateLimit,
  staticRateLimit,
} from './server/config.js'
import { clientIp, createRateLimiter, createRequestGuard } from './server/security.js'
import {
  respondJson,
  respondTooManyRequests,
  respondMethodNotAllowed,
  respondBusy,
} from './server/respond.js'
import { resolvePath, findFile, serveFile, serveError } from './server/static.js'
import { handleNowPlaying } from './server/spotify.js'
import { handleStatus } from './server/status.js'
import { handleChangelog } from './server/changelog.js'
import { handleCollect } from './server/analytics.js'

const checkApi = createRateLimiter(apiRateLimit)
const checkStatic = createRateLimiter(staticRateLimit)
const guard = createRequestGuard(MAX_CONNECTIONS)

function handleApi(req, res, route) {
  if (route !== '/api/health' && route !== '/api/now-playing' && route !== '/api/status' && route !== '/api/changelog') return false
  const wait = checkApi.check(clientIp(req))
  if (wait > 0) {
    respondTooManyRequests(res, wait)
    return true
  }
  if (route === '/api/health') respondJson(res, { ok: true }, req.method)
  else if (route === '/api/status') handleStatus(res, req.method)
  else if (route === '/api/changelog') handleChangelog(res, req.method)
  else handleNowPlaying(res, req.method)
  return true
}

function handleStatic(req, res, rawUrl) {
  const wait = checkStatic.check(clientIp(req))
  if (wait > 0) {
    respondTooManyRequests(res, wait)
    return
  }
  const target = resolvePath(rawUrl)
  if (target === null) {
    serveError(res, 400, join(ROOT, '400.html'))
    return
  }
  const file = findFile(target)
  if (!file) {
    serveError(res, 404, join(ROOT, '404.html'))
    return
  }
  serveFile(req, res, file)
}

const server = createServer((req, res) => {
  if (!guard.enter(req, res)) {
    respondBusy(res)
    try {
      req.socket.destroy()
    } catch {
      /* ignora */
    }
    return
  }
  const rawUrl = req.url || '/'
  const route = rawUrl.split('?')[0]
  // único POST do site: o contador de visitas (corpo minúsculo, ver server/analytics.js)
  if (req.method === 'POST' && route === '/api/pulse') {
    handleCollect(req, res)
    return
  }
  if (req.method !== 'GET' && req.method !== 'HEAD') {
    respondMethodNotAllowed(res)
    return
  }
  if (rawUrl.length > MAX_URL_LENGTH) {
    serveError(res, 414, join(ROOT, '404.html'))
    return
  }
  if (!handleApi(req, res, route)) handleStatic(req, res, rawUrl)
})

server.on('clientError', (err, socket) => {
  try {
    socket.end('HTTP/1.1 400 Bad Request\r\n\r\n')
  } catch {
    /* socket já foi embora */
  }
})

server.maxHeadersCount = 20
server.headersTimeout = 10_000
server.requestTimeout = 10_000
server.keepAliveTimeout = 5_000
server.listen(PORT, HOST, () => {
  console.log(`AXOLOTL BR em http://${HOST}:${PORT} servindo ${ROOT}`)
})
