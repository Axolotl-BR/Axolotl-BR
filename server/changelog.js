// Changelog = commits públicos do site e do ALT. Só entram commits com versão
// ("x.y.z - o que mudou"): o resto é ruído de trabalho. Cache de 10 min porque a
// API do GitHub sem token só dá 60 req/h por IP.
import { respondJson } from './respond.js'

const TTL_MS = 600_000
const REPOS = {
  site: 'https://api.github.com/repos/Axolotl-BR/Axolotl-BR/commits?per_page=12',
  alt: 'https://api.github.com/repositories/1174904957/commits?per_page=12',
}
const VERSIONED = /^(\d+\.\d+\.\d+)\s*-\s*(.+)$/
let cache = null // { view, expiresAt }

async function load(url) {
  try {
    const res = await fetch(url, {
      headers: { 'user-agent': 'axolotl-br-site', accept: 'application/vnd.github+json' },
      signal: AbortSignal.timeout(5000),
    })
    if (!res.ok) return []
    const list = await res.json()
    return list.flatMap((c) => {
      const m = VERSIONED.exec(String(c.commit.message).split('\n')[0])
      if (!m) return []
      return [{ version: m[1], msg: m[2].slice(0, 200), date: c.commit.author.date }]
    })
  } catch {
    return []
  }
}

export async function handleChangelog(res, method) {
  if (!cache || cache.expiresAt <= Date.now()) {
    const [site, alt] = await Promise.all([load(REPOS.site), load(REPOS.alt)])
    // falha não fica em cache por 10 min: tenta de novo em 1 min
    cache = { view: { site, alt }, expiresAt: Date.now() + (site.length || alt.length ? TTL_MS : 60_000) }
  }
  respondJson(res, cache.view, method)
}
