import { useEffect, useState } from 'react'

export type TrackState =
  | { state: 'loading' }
  | { state: 'idle' }
  | {
      state: 'playing'
      title: string
      artist: string
      image: string | null
      url: string | null
    }

async function fetchTrack(signal: AbortSignal): Promise<TrackState> {
  const res = await fetch('/api/now-playing', { signal })
  if (!res.ok) return { state: 'idle' }
  const data = await res.json()
  if (!data || data.playing !== true) return { state: 'idle' }
  return {
    state: 'playing',
    title: String(data.title ?? 'sem título'),
    artist: String(data.artist ?? 'desconhecido'),
    image: typeof data.image === 'string' ? data.image : null,
    url: typeof data.url === 'string' ? data.url : null,
  }
}

const POLL_MS = 30_000

export function useNowPlaying(): TrackState {
  const [track, setTrack] = useState<TrackState>({ state: 'loading' })

  useEffect(() => {
    const ctrl = new AbortController()
    const refresh = () => {
      fetchTrack(ctrl.signal)
        .then(setTrack)
        .catch(() => setTrack({ state: 'idle' }))
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
