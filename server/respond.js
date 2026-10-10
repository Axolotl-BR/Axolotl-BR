// Respostas pequenas: JSON, 405, 429 e 503 — sempre com headers de segurança.
import { withSecurity } from './security.js'

export function respondJson(res, payload, method) {
  const body = JSON.stringify(payload)
  res.writeHead(200, withSecurity({
    'content-type': 'application/json; charset=utf-8',
    'cache-control': 'no-store',
  }))
  if (method === 'HEAD') return res.end()
  res.end(body)
}

export function respondTooManyRequests(res, retryAfter) {
  res.writeHead(429, withSecurity({
    'content-type': 'application/json; charset=utf-8',
    'cache-control': 'no-store',
    'retry-after': String(retryAfter),
  }))
  res.end(JSON.stringify({ erro: 'muitas requisições, tenta de novo já já' }))
}

export function respondMethodNotAllowed(res) {
  res.writeHead(405, withSecurity({ allow: 'GET, HEAD' }))
  res.end()
}

export function respondBusy(res) {
  res.writeHead(503, withSecurity({
    'content-type': 'text/plain; charset=utf-8',
    'retry-after': '5',
  }))
  res.end('ocupado, tenta de novo\n')
}
