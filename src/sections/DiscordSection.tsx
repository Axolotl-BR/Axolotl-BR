import { ArrowUpRight } from 'lucide-react'
import { Badge, Button } from 'prism'
import { Reveal } from '../components/Reveal'
import { DiscordIcon } from '../components/DiscordIcon'
import { links } from '../data/site'
import { useLang } from '../lib/i18n'

export function DiscordSection() {
  const { c } = useLang()
  const d = c.discord
  return (
    <section id="discord" className="section discord">
      <div className="container">
        <Reveal>
          <div className="discord-door">
            <div className="discord-inner">
              <div className="discord-info">
                <span className="discord-icon">
                  <DiscordIcon size={28} />
                </span>
                <p className="eyebrow mono">{d.eyebrow}</p>
                <h2 className="h2 discord-title">{d.title}</h2>
                <p className="lead discord-desc">{d.p1}</p>
                <p className="lead discord-desc">{d.p2}</p>
              </div>

              <div className="discord-enter">
                <Badge label={d.badge} tone="success" dot />
                <p className="discord-strong">{d.strong}</p>
                <Button
                  href={links.discord}
                  external
                  size="lg"
                  fullWidth
                  label={d.cta}
                  icon={ArrowUpRight}
                  iconPosition="end"
                />
                <p className="mono discord-hint">{links.discord.replace('https://', '')}</p>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
