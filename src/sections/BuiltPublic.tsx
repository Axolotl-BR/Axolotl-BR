import { ArrowUpRight } from 'lucide-react'
import { Section } from '../components/Section'
import { Reveal } from '../components/Reveal'
import { githubRepos, links } from '../data/site'

export function BuiltPublic() {
  return (
    <Section
      id="codigo"
      eyebrow="código"
      title={
        <>
          tudo aberto <span className="text-accent">no github.</span>
        </>
      }
      lead="Nada de código fechado. O que a gente faz, publica."
    >
      <div className="built-grid">
        {githubRepos.map((repo, i) => (
          <Reveal key={repo.name} delay={i * 70}>
            <a
              href={repo.href}
              target="_blank"
              rel="noreferrer"
              className="built-repo"
            >
              <span className="built-repo-index" aria-hidden="true">
                {String(i + 1).padStart(2, '0')}
              </span>
              <h3 className="built-repo-name">{repo.name}</h3>
              <span className="built-repo-top">
                <ArrowUpRight size={16} aria-hidden="true" />
              </span>
              <p className="built-repo-desc">{repo.desc}</p>
              <span className="built-repo-lang mono">{repo.lang}</span>
            </a>
          </Reveal>
        ))}
      </div>

      <Reveal delay={280}>
        <div className="built-more">
          <a href={links.githubOrg} target="_blank" rel="noreferrer" className="btn btn-ghost">
            ver tudo no github <ArrowUpRight size={14} aria-hidden="true" />
          </a>
        </div>
      </Reveal>
    </Section>
  )
}
