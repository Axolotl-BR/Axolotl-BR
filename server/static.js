// Arquivos estáticos: resolver sem traversal, achar e servir com gzip.
import { createReadStream, existsSync, statSync } from 'node:fs'
import { extname, join, resolve, sep } from 'node:path'
import { createGzip } from 'node:zlib'
import { ROOT, MIME_TYPES, COMPRESSIBLE, ASSET_MAX_AGE } from './config.js'
import { withSecurity } from './security.js'

export function resolvePath(rawUrl) {
  let path = rawUrl.split('?')[0].split('#')[0]
  try {
    path = decodeURIComponent(path)
  } catch {
    return null
  }
  if (path === '/' || path === '') path = '/index.html'
  const target = resolve(join(ROOT, path))
  if (target !== ROOT && !target.startsWith(ROOT + sep)) return null
  return target
}

export function findFile(target) {
  if (!existsSync(target)) return null
  const stats = statSync(target)
  if (stats.isDirectory()) {
    const index = join(target, 'index.html')
    return existsSync(index) ? index : null
  }
  return stats.isFile() ? target : null
}

export function serveError(res, code, file) {
  if (!file || !existsSync(file)) {
    res.writeHead(code, withSecurity({ 'content-type': 'text/plain; charset=utf-8' }))
    res.end(`${code}\n`)
    return
  }
  res.writeHead(code, withSecurity({ 'content-type': MIME_TYPES['.html'], 'cache-control': 'no-cache' }))
  streamFile(res, file, false)
}

function streamFile(res, file, gzip) {
  const source = createReadStream(file)
  const output = gzip ? createGzip() : null
  const destroy = () => {
    try {
      source.destroy()
    } catch {
      /* ignora */
    }
    try {
      if (output) output.destroy()
    } catch {
      /* ignora */
    }
    try {
      res.destroy()
    } catch {
      /* ignora */
    }
  }
  source.on('error', destroy)
  if (output) {
    output.on('error', destroy)
    source.pipe(output).pipe(res)
    return
  }
  source.pipe(res)
}

function cacheHeaders(file) {
  const hashed = file.includes(`${sep}assets${sep}`)
  return hashed
    ? `public, max-age=${ASSET_MAX_AGE}, immutable`
    : 'public, max-age=0, must-revalidate'
}

export function serveFile(req, res, file) {
  const ext = extname(file).toLowerCase()
  const useGzip = /\bgzip\b/.test(req.headers['accept-encoding'] || '') && COMPRESSIBLE.has(ext)
  const headers = withSecurity({ 'content-type': MIME_TYPES[ext] || 'application/octet-stream' })
  headers['cache-control'] = cacheHeaders(file)
  if (useGzip) {
    headers['content-encoding'] = 'gzip'
    headers.vary = 'Accept-Encoding'
  }
  res.writeHead(200, headers)
  if (req.method === 'HEAD') return res.end()
  streamFile(res, file, useGzip)
}
