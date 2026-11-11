import { ArrowUpRight } from 'lucide-react'
import { Badge, Skeleton } from 'prism'
import { useNowPlaying } from '../hooks/useNowPlaying'
import type { Track } from '../hooks/useNowPlaying'
import { useLang } from '../lib/i18n'
import type { Copy } from '../data/copy'

function ago(iso: string | null, f: Copy['fabi']): string {
  if (!iso) return ''
  const min = Math.floor((Date.now() - new Date(iso).getTime()) / 60_000)
  if (!Number.isFinite(min) || min < 1) return f.justNow
  if (min < 60) return f.ago(min, 'min')
  const h = Math.floor(min / 60)
  return h < 24 ? f.ago(h, 'h') : f.ago(Math.floor(h / 24), 'd')
}

function TrackRow({ track, live, when, f }: { track: Track; live: boolean; when?: string; f: Copy['fabi'] }) {
  return (
    <div className="now-box">
      {track.image ? (
        <img
          src={track.image}
          alt={f.coverAlt(track.title)}
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
        label={live ? f.badgePlaying : when || f.badgeLast}
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
          aria-label={f.openAria(track.title)}
        >
          <ArrowUpRight size={16} aria-hidden="true" />
        </a>
      ) : null}
    </div>
  )
}

// vive dentro do card do fabi (sem seção própria)
export function NowPlaying() {
  const track = useNowPlaying()
  const { c } = useLang()
  const f = c.fabi

  return (
    <div className="now-section">
      <p className="eyebrow mono">{f.spotify}</p>
      <h3 className="now-title">{track.state === 'playing' ? f.playing : f.last}</h3>
      <div className="now-slot" aria-live="polite">
        {track.state === 'loading' ? (
          <Skeleton shape="block" />
        ) : track.state === 'playing' ? (
          <TrackRow track={track} live f={f} />
        ) : track.state === 'last' ? (
          <TrackRow track={track} live={false} when={ago(track.playedAt, f)} f={f} />
        ) : (
          <p className="mono now-idle">{f.idle}</p>
        )}
      </div>
    </div>
  )
}
