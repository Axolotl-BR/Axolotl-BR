// Spotify "tocando agora": token via refresh + cache curto anti-stampede.
// Sem credencial (env), responde { playing: false } e o site mostra o fallback.
import { respondJson } from './respond.js'

const credentials = {
  id: process.env.SPOTIFY_CLIENT_ID || '',
  secret: process.env.SPOTIFY_CLIENT_SECRET || '',
  refresh: process.env.SPOTIFY_REFRESH_TOKEN || '',
}

const TRACK_TTL_MS = 20_000

let tokenCache = null // { access, expiresAt }
let trackCache = null // { view, expiresAt }

export function hasCredentials() {
  return Boolean(credentials.id && credentials.secret && credentials.refresh)
}

async function refreshAccessToken() {
  if (tokenCache && tokenCache.expiresAt > Date.now() + 30_000) return tokenCache.access
  const basic = Buffer.from(`${credentials.id}:${credentials.secret}`).toString('base64')
  const body = new URLSearchParams({ grant_type: 'refresh_token', refresh_token: credentials.refresh })
  const res = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: { Authorization: `Basic ${basic}`, 'content-type': 'application/x-www-form-urlencoded' },
    body,
  })
  if (!res.ok) throw new Error(`spotify token: ${res.status}`)
  const data = await res.json()
  tokenCache = { access: data.access_token, expiresAt: Date.now() + (data.expires_in || 3600) * 1000 }
  return tokenCache.access
}

async function fetchPlayerState(access) {
  return fetch('https://api.spotify.com/v1/me/player/currently-playing', {
    headers: { Authorization: `Bearer ${access}` },
  })
}

function toTrackView(data) {
  const item = data && data.item
  if (!data || data.is_playing !== true || !item) return { playing: false }
  const artist = item.type === 'episode'
    ? (item.show && item.show.name) || 'podcast'
    : (item.artists || []).map((a) => a.name).join(', ') || 'desconhecido'
  const cover = (item.album && item.album.images && item.album.images[1])
    || (item.images && item.images[1]) || null
  return {
    playing: true,
    title: item.name || 'sem título',
    artist,
    image: cover ? cover.url : null,
    url: (item.external_urls && item.external_urls.spotify) || null,
  }
}

async function loadNowPlaying() {
  if (trackCache && trackCache.expiresAt > Date.now()) return trackCache.view
  let res = await fetchPlayerState(await refreshAccessToken())
  if (res.status === 401) {
    tokenCache = null
    res = await fetchPlayerState(await refreshAccessToken())
  }
  const view = res.status === 204 || !res.ok ? { playing: false } : toTrackView(await res.json())
  trackCache = { view, expiresAt: Date.now() + TRACK_TTL_MS }
  return view
}

export async function handleNowPlaying(res, method) {
  if (!hasCredentials()) {
    respondJson(res, { playing: false }, method)
    return
  }
  try {
    respondJson(res, await loadNowPlaying(), method)
  } catch {
    respondJson(res, { playing: false }, method)
  }
}
