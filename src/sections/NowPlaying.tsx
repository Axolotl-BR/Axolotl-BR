import { ArrowUpRight } from 'lucide-react'
import { Reveal } from '../components/Reveal'
import { useNowPlaying } from '../hooks/useNowPlaying'
import type { TrackState } from '../hooks/useNowPlaying'

function TrackCover({ track }: { track: Extract<TrackState, { state: 'playing' }> }) {
  if (!track.image) return null
  return (
    <img
      src={track.image}
      alt={`capa de ${track.title}`}
      width={64}
      height={64}
      className="now-cover"
      loading="lazy"
      decoding="async"
    />
  )
}

function TrackLink({ track }: { track: Extract<TrackState, { state: 'playing' }> }) {
  if (!track.url) return null
  return (
    <a
      href={track.url}
      target="_blank"
      rel="noreferrer"
      className="now-link"
      aria-label={`abrir ${track.title} no spotify`}
    >
      <ArrowUpRight size={16} />
    </a>
  )
}

function NowBox({ track }: { track: Extract<TrackState, { state: 'playing' }> }) {
  return (
    <div className="now-box panel">
      <TrackCover track={track} />
      <div className="now-info">
        <p className="now-track">{track.title}</p>
        <p className="mono now-artist">{track.artist}</p>
      </div>
      <span className="led online" aria-hidden="true" />
      <TrackLink track={track} />
    </div>
  )
}

export function NowPlaying() {
  const track = useNowPlaying()

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
          {track.state === 'loading' ? (
            <p className="mono now-idle">carregando…</p>
          ) : track.state === 'playing' ? (
            <NowBox track={track} />
          ) : (
            <p className="mono now-idle">o fabi não tá ouvindo nada agora.</p>
          )}
        </Reveal>
      </div>
    </section>
  )
}
