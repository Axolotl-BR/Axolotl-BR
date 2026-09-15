import { Section } from '../components/Section'
import { Reveal } from '../components/Reveal'
import { StampTypeCard } from '../lib/stamptype/StampTypeCard'
import { RushTypeCard } from '../lib/rush-type/RushTypeCard'

export function PosterLab() {
  return (
    <Section
      id="posters"
      eyebrow="poster lab"
      title={
        <>
          arte cinética feita <span className="text-gradient">em canvas.</span>
        </>
      }
      lead="Dois experimentos de tipografia em movimento, gerados em tempo real no navegador. zero vídeo, puro canvas: o lab imprime pôsteres vivos."
    >
      <div className="poster-grid">
        <Reveal>
          <StampTypeCard />
        </Reveal>
        <Reveal delay={120}>
          <RushTypeCard />
        </Reveal>
      </div>
    </Section>
  )
}