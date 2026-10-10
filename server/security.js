// Defesa app-layer: IP, rate limit, teto de requisições e headers.
// DDoS volumétrico é papel do host/CDN — aqui seguramos abuso e flood barato.
import { SECURITY_HEADERS, MAX_TRACKED_IPS } from './config.js'

export function clientIp(req) {
  const forwarded = req.headers['x-forwarded-for']
  if (typeof forwarded === 'string' && forwarded.length > 0) {
    return forwarded.split(',')[0].trim().slice(0, 64)
  }
  const direct = req.socket && req.socket.remoteAddress
  return String(direct || 'unknown').slice(0, 64)
}

export function withSecurity(headers) {
  return { ...SECURITY_HEADERS, ...headers }
}

function sweepBuckets(buckets, windowMs) {
  const now = Date.now()
  for (const [ip, bucket] of buckets) {
    if (now > bucket.reset) buckets.delete(ip)
  }
  if (buckets.size <= MAX_TRACKED_IPS) return
  const oldest = [...buckets.keys()].slice(0, 500)
  for (const ip of oldest) buckets.delete(ip)
}

export function createRateLimiter({ windowMs, max }) {
  const buckets = new Map()
  setInterval(() => sweepBuckets(buckets, windowMs), windowMs).unref()

  function check(ip) {
    const now = Date.now()
    let bucket = buckets.get(ip)
    if (!bucket || now > bucket.reset) {
      bucket = { count: 0, reset: now + windowMs }
      buckets.set(ip, bucket)
    }
    bucket.count += 1
    if (bucket.count <= max) return 0
    return Math.max(1, Math.ceil((bucket.reset - now) / 1000))
  }

  return { check }
}

export function createRequestGuard(max) {
  let open = 0

  function enter(req, res) {
    open += 1
    if (open > max) {
      open -= 1
      return false
    }
    res.once('finish', () => {
      open -= 1
    })
    res.once('close', () => {
      if (!res.writableEnded && open > 0) open -= 1
    })
    req.once('aborted', () => {
      try {
        res.destroy()
      } catch {
        /* cliente já foi embora */
      }
    })
    return true
  }

  return { enter }
}
