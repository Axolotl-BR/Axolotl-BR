import { ArrowUpRight } from 'lucide-react'
import { Badge, Button } from 'prism'
import { Reveal } from '../components/Reveal'
import { links } from '../data/site'

export function DiscordSection() {
  return (
    <section id="discord" className="section discord">
      <div className="container">
        <Reveal>
          <div className="discord-door">
            <div className="discord-inner">
              <div className="discord-info">
                <span className="eyebrow">discord</span>
                <h2 className="h2 discord-title">o ponto de encontro.</h2>
                <p className="lead discord-desc">
                  É onde tudo acontece: conversa, eventos e os avisos do servidor. Se você vai
                  entrar em um lugar só, entra aqui.
                </p>
              </div>

              <div className="discord-enter">
                <Badge label="aberto pra todo mundo" tone="success" dot />
                <Button
                  href={links.discord}
                  external
                  size="lg"
                  fullWidth
                  label="entrar no discord"
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
