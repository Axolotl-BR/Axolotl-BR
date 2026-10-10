// Constantes do servidor: rede, limites, tipos e headers.
// Nada de segredo aqui — credenciais vêm de env (ver spotify.js).
import { resolve } from 'node:path'

export const ROOT = resolve('dist')
export const PORT = 80
export const HOST = '0.0.0.0'

export const MAX_URL_LENGTH = 2048
export const MAX_CONNECTIONS = 200
export const MAX_TRACKED_IPS = 2000

export const apiRateLimit = { windowMs: 60_000, max: 30 }
export const staticRateLimit = { windowMs: 60_000, max: 300 }

export const ASSET_MAX_AGE = 31536000 // 1 ano — /assets tem hash no nome

export const COMPRESSIBLE = new Set(['.html', '.js', '.css', '.svg', '.json', '.txt'])

export const MIME_TYPES = {
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

export const SECURITY_HEADERS = {
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
