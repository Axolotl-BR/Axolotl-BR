import { Section } from '../components/Section'
import { Reveal } from '../components/Reveal'
import { site, owner, servers, labProjects, githubRepos, stateLabel } from '../data/site'

// Contadores honestos: tudo derivado do site.ts, nada chutado.
// Sem "players online" fake — o SMP ainda está em desenvolvimento.
const anos = site.year - Number(owner.since)

const numbers = [
  { value: String(anos), label: 'anos de comunidade', sub: `desde ${owner.since}` },
  { value: String(labProjects.length), label: 'projetos no lab', sub: 'feito em público' },
  {
    value: String(servers.length),
    label: 'servidor smp',
    sub: stateLabel[servers[0].state].toLowerCase(),
  },
  { value: String(githubRepos.length), label: 'repos abertos', sub: 'código pra ver' },
] as const

export function Numbers() {
  return (
    <Section
      id="numeros"
      eyebrow="números"
      title={
        <>
          o que dá <span className="text-accent">pra contar.</span>
        </>
      }
      lead="Sem número falso: só o que existe de verdade."
      className="numbers"
    >
      <dl className="numbers-strip">
        {numbers.map((n, i) => (
          <Reveal key={n.label} delay={i * 70}>
            <div className="numbers-row">
              <dt className="numbers-value">{n.value}</dt>
              <dd className="numbers-label mono">{n.label}</dd>
              <dd className="numbers-sub mono">{n.sub}</dd>
            </div>
          </Reveal>
        ))}
      </dl>
    </Section>
  )
}
