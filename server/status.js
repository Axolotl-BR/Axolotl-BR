// Status real pelo widget público do servidor (precisa estar ativado nas configs do Discord).
// O widget lista só quem está online, com o apelido; o ALT aparece como "> ALTx".
// Cache curto para não bater na API a cada visita.
import { respondJson } from './respond.js'

const TTL_MS = 60_000
const GUILD_ID = '994118849731506306'
const ALT_NAME = '> ALTx'
let cache = null // { view, expiresAt }

const AVATARS = 10

// convite com contagem: diz se o Discord está de pé e quantos membros tem (aproximado, vindo do próprio Discord)
async function invite() {
  try {
    const res = await fetch('https://discord.com/api/v10/invites/8WtmZTySdB?with_counts=true', {
      signal: AbortSignal.timeout(5000),
    })
    if (!res.ok) return { up: false, members: null }
    const data = await res.json()
    return { up: true, members: Number.isInteger(data.approximate_member_count) ? data.approximate_member_count : null }
  } catch {
    return { up: false, members: null }
  }
}

// avatares do widget: só quem está online, já anonimizados pelo Discord. Só aceita a CDN do Discord.
function avatarsOf(members) {
  return members
    .map((m) => m.avatar_url)
    .filter((u) => typeof u === 'string' && u.startsWith('https://cdn.discordapp.com/'))
    .slice(0, AVATARS)
}

async function checkWidget() {
  try {
    const res = await fetch(`https://discord.com/api/guilds/${GUILD_ID}/widget.json`, {
      signal: AbortSignal.timeout(5000),
    })
    if (!res.ok) return null
    const data = await res.json()
    const members = Array.isArray(data.members) ? data.members : []
    return {
      alt: members.some((m) => m.username === ALT_NAME),
      online: Number.isInteger(data.presence_count) ? data.presence_count : null,
      avatars: avatarsOf(members),
    }
  } catch {
    return null
  }
}

// widget desativado ou fora: o convite ainda diz se o Discord está de pé, mas o ALT fica "sem checagem"
async function checkDiscord() {
  const [w, inv] = await Promise.all([checkWidget(), invite()])
  return {
    discord: w !== null || inv.up,
    alt: w ? w.alt : null,
    online: w ? w.online : null,
    members: inv.members,
    avatars: w ? w.avatars : [],
  }
}

export async function handleStatus(res, method) {
  if (!cache || cache.expiresAt <= Date.now()) {
    cache = { view: { site: true, ...(await checkDiscord()) }, expiresAt: Date.now() + TTL_MS }
  }
  respondJson(res, cache.view, method)
}
