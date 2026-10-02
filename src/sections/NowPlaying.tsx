import { useEffect, useState } from 'react'
import { ArrowUpRight } from 'lucide-react'
import { Reveal } from '../components/Reveal'

type NowPlaying =
  | { state: 'loading' }
  | { state: 'idle' }
  | {
      state: 'playing'
      title: string
      artist: string
      image: string | null
      url: string | null
    }

async function fetchNowPlaying(signal: AbortSignal): Promise<NowPlaying> {
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

export function NowPlaying() {
  const [now, setNow] = useState<NowPlaying>({ state: 'loading' })

  useEffect(() => {
    const ctrl = new AbortController()
    fetchNowPlaying(ctrl.signal).then(setNow).catch(() => setNow({ state: 'idle' }))
    const t = setInterval(() => {
      fetchNowPlaying(ctrl.signal).then(setNow).catch(() => setNow({ state: 'idle' }))
    }, 30000)
    return () => {
      clearInterval(t)
      ctrl.abort()
    }
  }, [])

  return (
    <section id="ouvindo" className="section now-section">
      <div className="container">
        <Reveal>
          <span className="eyebrow">spotify</span>
        </Reveal>
        <Reveal delay={80}>
          <h2 className="h2 now-title">tocando agora.</h2>
        </Reveal>
        <Reveal delay={160}>
          {now.state === 'loading' ? (
            <p className="mono now-idle">carregando…</p>
          ) : now.state === 'playing' ? (
            <div className="now-box panel">
              {now.image ? (
                <img src={now.image} alt={`capa de ${now.title}`} width={64} height={64} className="now-cover" />
              ) : null}
              <div className="now-info">
                <p className="now-track">{now.title}</p>
                <p className="mono now-artist">{now.artist}</p>
              </div>
              <span className="led online" aria-hidden="true" />
              {now.url ? (
                <a
                  href={now.url}
                  target="_blank"
                  rel="noreferrer"
                  className="now-link"
                  aria-label={`abrir ${now.title} no spotify`}
                >
                  <ArrowUpRight size={16} />
                </a>
              ) : null}
            </div>
          ) : (
            <p className="mono now-idle">o fabi não tá ouvindo nada agora.</p>
          )}
        </Reveal>
      </div>
    </section>
  )
}
