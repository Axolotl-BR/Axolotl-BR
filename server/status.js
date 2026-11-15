// Status real pelo widget público do servidor (precisa estar ativado nas configs do Discord).
// O widget lista só quem está online, com o apelido; o ALT aparece como "> ALTx".
// Cache curto para não bater na API a cada visita.
import { respondJson } from './respond.js'

const TTL_MS = 60_000
const GUILD_ID = '994118849731506306'
const ALT_NAME = '> ALTx'
let cache = null // { view, expiresAt }

// widget desativado ou fora: o convite ainda diz se o Discord está de pé, mas o ALT fica "sem checagem"
async function inviteUp() {
  try {
    const res = await fetch('https://discord.com/api/v10/invites/AxolotlBR', {
      signal: AbortSignal.timeout(5000),
    })
    return res.ok
  } catch {
    return false
  }
}

async function checkDiscord() {
  try {
    const res = await fetch(`https://discord.com/api/guilds/${GUILD_ID}/widget.json`, {
      signal: AbortSignal.timeout(5000),
    })
    if (!res.ok) return { discord: await inviteUp(), alt: null, online: null }
    const data = await res.json()
    const members = Array.isArray(data.members) ? data.members : []
    return {
      discord: true,
      alt: members.some((m) => m.username === ALT_NAME),
      online: Number.isInteger(data.presence_count) ? data.presence_count : null,
    }
  } catch {
    return { discord: await inviteUp(), alt: null, online: null }
  }
}

export async function handleStatus(res, method) {
  if (!cache || cache.expiresAt <= Date.now()) {
    cache = { view: { site: true, ...(await checkDiscord()) }, expiresAt: Date.now() + TTL_MS }
  }
  respondJson(res, cache.view, method)
}
