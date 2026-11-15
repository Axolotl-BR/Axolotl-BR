// Status real do Discord: o convite resolve? Cache curto para não bater na API a cada visita.
import { respondJson } from './respond.js'

const TTL_MS = 60_000
let cache = null // { view, expiresAt }

async function checkDiscord() {
  try {
    const res = await fetch('https://discord.com/api/v10/invites/AxolotlBR', {
      signal: AbortSignal.timeout(5000),
    })
    return res.ok
  } catch {
    return false
  }
}

export async function handleStatus(res, method) {
  if (!cache || cache.expiresAt <= Date.now()) {
    cache = { view: { site: true, discord: await checkDiscord() }, expiresAt: Date.now() + TTL_MS }
  }
  respondJson(res, cache.view, method)
}
