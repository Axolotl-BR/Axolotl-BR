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
          <Reveal delay={200}>
            <span className="chip">brasileiro</span>
          </Reveal>
          <Reveal delay={260}>
            <span className="chip">desde 2020</span>
          </Reveal>
          <Reveal delay={320}>
            <span className="chip">de player para player</span>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
