import { ArrowUpRight } from 'lucide-react'
import { Badge, Card, Skeleton } from 'prism'
import { Reveal } from '../components/Reveal'
import { useNowPlaying } from '../hooks/useNowPlaying'
import type { Track } from '../hooks/useNowPlaying'

function ago(iso: string | null): string {
  if (!iso) return ''
  const min = Math.floor((Date.now() - new Date(iso).getTime()) / 60_000)
  if (!Number.isFinite(min) || min < 1) return 'agora há pouco'
  if (min < 60) return `há ${min} min`
  const h = Math.floor(min / 60)
  return h < 24 ? `há ${h} h` : `há ${Math.floor(h / 24)} d`
}

function TrackRow({ track, live, when }: { track: Track; live: boolean; when?: string }) {
  return (
    <Card variant="compact">
      <div className="now-box">
        {track.image ? (
          <img
            src={track.image}
            alt={`capa de ${track.title}`}
            width={64}
            height={64}
            className="now-cover"
            loading="lazy"
            decoding="async"
          />
        ) : null}
        <div className="now-info">
          <p className="now-track">{track.title}</p>
          <p className="mono now-artist">{track.artist}</p>
        </div>
        <Badge
          label={live ? 'tocando' : when || 'última'}
          tone={live ? 'success' : 'neutral'}
          size="sm"
          dot={live}
        />
        {track.url ? (
          <a
            href={track.url}
            target="_blank"
            rel="noopener noreferrer"
            className="now-link"
            aria-label={`abrir ${track.title} no spotify`}
          >
            <ArrowUpRight size={16} aria-hidden="true" />
          </a>
        ) : null}
      </div>
    </Card>
  )
}

export function NowPlaying() {
  const track = useNowPlaying()
  const title = track.state === 'last' ? 'última que tocou.' : 'tocando agora.'

  return (
    <section id="ouvindo" className="section now-section">
      <div className="container">
        <Reveal>
          <span className="eyebrow">spotify do fabi</span>
        </Reveal>
        <Reveal delay={80}>
          <h2 className="h2 now-title">{title}</h2>
        </Reveal>
        <Reveal delay={160}>
          <div className="now-slot" aria-live="polite">
            {track.state === 'loading' ? (
              <Skeleton shape="block" />
            ) : track.state === 'playing' ? (
              <TrackRow track={track} live />
            ) : track.state === 'last' ? (
              <TrackRow track={track} live={false} when={ago(track.playedAt)} />
            ) : (
              <p className="mono now-idle">nada tocando agora.</p>
            )}
          </div>
        </Reveal>
      </div>
    </section>
  )
}
