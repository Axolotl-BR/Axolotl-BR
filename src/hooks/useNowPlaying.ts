import { useEffect, useState } from 'react'

export type Track = {
  title: string
  artist: string
  image: string | null
  url: string | null
}

export type TrackState =
  | { state: 'loading' }
  | { state: 'idle' }
  | ({ state: 'playing' } & Track)
  | ({ state: 'last'; playedAt: string | null } & Track)

function toTrack(data: Record<string, unknown>): Track {
  return {
    title: String(data.title ?? 'sem título'),
    artist: String(data.artist ?? 'desconhecido'),
    image: typeof data.image === 'string' ? data.image : null,
    url: typeof data.url === 'string' ? data.url : null,
  }
}

async function fetchTrack(signal: AbortSignal): Promise<TrackState> {
  const res = await fetch('/api/now-playing', { signal })
  if (!res.ok) return { state: 'idle' }
  const data = await res.json()
  if (data?.playing === true) return { state: 'playing', ...toTrack(data) }
  if (data?.last && typeof data.last === 'object') {
    const playedAt = typeof data.last.playedAt === 'string' ? data.last.playedAt : null
    return { state: 'last', playedAt, ...toTrack(data.last) }
  }
  return { state: 'idle' }
}

const POLL_MS = 30_000

export function useNowPlaying(): TrackState {
  const [track, setTrack] = useState<TrackState>({ state: 'loading' })

  useEffect(() => {
    const ctrl = new AbortController()
    const refresh = () => {
      fetchTrack(ctrl.signal)
        .then(setTrack)
        .catch(() => {
          if (!ctrl.signal.aborted) setTrack({ state: 'idle' })
        })
    }
    refresh()
    const timer = setInterval(refresh, POLL_MS)
    return () => {
      clearInterval(timer)
      ctrl.abort()
    }
  }, [])

  return track
}
