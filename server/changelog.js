// Changelog do ALT = commits públicos do repo dele (mensagens "x.y.z - o que mudou").
// Cache de 10 min: a API do GitHub sem token só dá 60 req/h por IP.
import { respondJson } from './respond.js'

const TTL_MS = 600_000
const URL = 'https://api.github.com/repositories/1174904957/commits?per_page=8'
let cache = null // { view, expiresAt }

async function load() {
  try {
    const res = await fetch(URL, {
      headers: { 'user-agent': 'axolotl-br-site', accept: 'application/vnd.github+json' },
      signal: AbortSignal.timeout(5000),
    })
    if (!res.ok) return []
    const list = await res.json()
    return list.map((c) => ({
      msg: String(c.commit.message).split('\n')[0].slice(0, 200),
      date: c.commit.author.date,
    }))
  } catch {
    return []
  }
}

export async function handleChangelog(res, method) {
  if (!cache || cache.expiresAt <= Date.now()) {
    const items = await load()
    // falha não fica em cache por 10 min: tenta de novo em 1 min
    cache = { view: { items }, expiresAt: Date.now() + (items.length ? TTL_MS : 60_000) }
  }
  respondJson(res, cache.view, method)
}
