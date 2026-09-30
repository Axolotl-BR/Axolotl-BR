import { ArrowUpRight } from 'lucide-react'
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
                <div className="discord-status">
                  <span className="led online" /> comunidade ativa
                </div>
                <a
                  href={links.discord}
                  target="_blank"
                  rel="noreferrer"
                  className="btn btn-primary discord-cta"
                >
                  entrar no discord <ArrowUpRight size={16} aria-hidden="true" />
                </a>
                <p className="mono discord-hint">discord.gg/AxolotlBR</p>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
