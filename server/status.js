// Status real pelo widget público do servidor (precisa estar ativado nas configs do Discord).
// O widget lista só quem está online, com o apelido; o ALT aparece como "> ALTx".
// Cache curto para não bater na API a cada visita.
import { respondJson } from './respond.js'

const TTL_MS = 60_000
const GUILD_ID = '994118849731506306'
const ALT_NAME = '> ALTx'
let cache = null // { view, expiresAt }

const AVATARS = 10
const CDN = 'https://cdn.discordapp.com/'
const FABI_NAME = 'fab!*'

// bots da guild pelo nome que o widget mostra (o widget não diz quem é bot).
// shortcut: lista manual tirada da guild em 2026-11-28; bot novo no servidor precisa entrar aqui.
const BOT_NAMES = new Set([
  'Axolotl', 'Axolotl SMP', '💜 Axolotl BR', 'DISBOARD', 'FreeStuff', 'GoLive', 'Jockie Music',
  'Jukebox [m!p]', 'Lofi Girl', 'Loritta', '[ + ] Lorrita', 'Mudae', '[ $ ] Mudae', 'PetPet',
  'Rio AI', '[ / ] Rio Bot', 'Sapphire', 'Statbot', '[ / ] Statbot', 'kennyy', '✦ ALT*',
])
const BOT_COUNT = 15 // os mesmos bots acima + o ALT; sai da contagem de pessoas

// H2o sempre na fileira. shortcut: hash fixo do avatar; se ele trocar a foto, a imagem some (o front esconde) e o hash precisa ser atualizado.
const H2O = { names: ['H2o', 'h2obw'], avatar: `${CDN}avatars/1009312605824897064/1092a6d938d335d6205334df2a544d9d.png?size=64` }

// convite com contagem: diz se o Discord está de pé e quantos membros tem (aproximado, vindo do próprio Discord)
async function invite() {
  try {
    const res = await fetch('https://discord.com/api/v10/invites/8WtmZTySdB?with_counts=true', {
      signal: AbortSignal.timeout(5000),
    })
    if (!res.ok) return { up: false, members: null, fabi: null }
    const data = await res.json()
    const total = data.approximate_member_count
    // o convite é do fabi: a foto dele vem daqui, sempre a atual
    const u = data.inviter
    const fabi = u && /^\d+$/.test(u.id) && /^(a_)?[0-9a-f]+$/.test(u.avatar || '') ? `${CDN}avatars/${u.id}/${u.avatar}.png?size=64` : null
    return { up: true, members: Number.isInteger(total) ? Math.max(total - BOT_COUNT, 0) : null, fabi }
  } catch {
    return { up: false, members: null, fabi: null }
  }
}

const isCdn = (u) => typeof u === 'string' && u.startsWith(CDN)

// fileira da home: ALT, H2o e gente online (sem bot), com o fabi no meio
function avatarsOf(members, fabi) {
  const alt = members.find((m) => m.username === ALT_NAME)?.avatar_url
  const skip = new Set([ALT_NAME, FABI_NAME, ...H2O.names])
  const people = members
    .filter((m) => !BOT_NAMES.has(m.username) && !skip.has(m.username))
    .map((m) => m.avatar_url)
  const row = [alt, H2O.avatar, ...people].filter(isCdn).slice(0, fabi ? AVATARS - 1 : AVATARS)
  if (isCdn(fabi)) row.splice(Math.floor(row.length / 2), 0, fabi)
  return row
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
      members,
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
    avatars: avatarsOf(w ? w.members : [], inv.fabi),
  }
}

export async function handleStatus(res, method) {
  if (!cache || cache.expiresAt <= Date.now()) {
    cache = { view: { site: true, ...(await checkDiscord()) }, expiresAt: Date.now() + TTL_MS }
  }
  respondJson(res, cache.view, method)
}
