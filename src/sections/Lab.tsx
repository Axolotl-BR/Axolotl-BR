import { ArrowUpRight, FolderKanban } from 'lucide-react'
import { Section } from '../components/Section'
import { Reveal } from '../components/Reveal'
import { labProjects, type LabStatus } from '../data/site'

const statusLed: Record<LabStatus, string> = {
  'em desenvolvimento': 'warning',
  'em breve': '',
  online: 'online',
  planejado: 'warning',
}

export function Lab() {
  const friday = labProjects[0]

  return (
    <Section
      id="projetos"
      eyebrow="projetos"
      title={
        <>
          o que a gente <span className="text-accent">tá construindo.</span>
        </>
      }
      lead="Ferramenta, bot e código aberto — feito pela comunidade, em público."
      className="lab"
    >
      <Reveal>
        <div className="friday panel">
          <div className="friday-head">
            <div className="friday-id">
              <FolderKanban size={20} aria-hidden="true" />
              <div>
                <h3 className="friday-name mono">F.R.I.D.A.Y.</h3>
                <p className="friday-concept mono">{friday.concept}</p>
              </div>
            </div>
            <span className="tag" data-kind="PROJECT">
              {friday.status}
            </span>
          </div>

          <h4 className="friday-role">{friday.role}</h4>
          <p className="friday-desc">{friday.desc}</p>

          <ul className="friday-tags">
            {friday.tags.map((t) => (
              <li key={t} className="chip">
                {t}
              </li>
            ))}
          </ul>
        </div>
      </Reveal>

      <div className="lab-grid">
        {labProjects.slice(1).map((p, i) => (
          <Reveal key={p.name} delay={i * 90} className="lab-cell">
            <article className="lab-project panel">
              <div className="lab-project-top">
                <span className="lab-project-name mono">{p.name}</span>
                <span className={`led ${statusLed[p.status]}`} aria-hidden="true" />
              </div>
              <p className="lab-project-role">{p.role}</p>
              <p className="lab-project-desc">{p.desc}</p>
              <div className="lab-project-bottom">
                <ul className="lab-project-tags">
                  {p.tags.map((t) => (
                    <li key={t} className="chip">
                      {t}
                    </li>
                  ))}
                </ul>
                {p.href ? (
                  <a
                    href={p.href}
                    target="_blank"
                    rel="noreferrer"
                    className="lab-project-link"
                    aria-label={`abrir ${p.name} no github`}
                  >
                    <ArrowUpRight size={16} />
                  </a>
                ) : null}
              </div>
            </article>
          </Reveal>
        ))}
      </div>
    </Section>
  )
}
