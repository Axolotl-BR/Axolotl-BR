import { Badge } from 'prism'
import { Reveal } from '../components/Reveal'

export function Manifesto() {
  return (
    <section id="identidade" className="section manifesto">
      <div className="container">
        <Reveal>
          <span className="eyebrow">quem somos</span>
        </Reveal>

        <Reveal delay={80}>
          <p className="manifesto-line">
            Um <em>canto da internet</em> pra quem joga, cria e programa.
          </p>
        </Reveal>

        <Reveal delay={160}>
          <p className="manifesto-sub">
            O Axolotl BR começou em 2020 como um grupo de amigos no Discord. Hoje é Discord,
            Minecraft, bots e código · e você entra por qualquer uma dessas portas.
          </p>
        </Reveal>

        <div className="manifesto-chips">
          {['brasileiro', 'desde 2020', 'de player para player'].map((label, i) => (
            <Reveal key={label} delay={200 + i * 60}>
              <Badge label={label} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
