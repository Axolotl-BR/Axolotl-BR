import type { ReactNode } from 'react'
import { Reveal } from './Reveal'

type SectionProps = {
  id: string
  title: ReactNode
  eyebrow?: string
  lead?: ReactNode
  children: ReactNode
  className?: string
}

export function Section({ id, title, eyebrow, lead, children, className }: SectionProps) {
  return (
    <section id={id} className={`section ${className ?? ''}`}>
      <div className="container">
        <Reveal>
          <div className="section-head">
            {eyebrow ? <p className="eyebrow mono">{eyebrow}</p> : null}
            <h2 className="h2">{title}</h2>
            {lead ? <p className="lead">{lead}</p> : null}
          </div>
        </Reveal>
        {children}
      </div>
    </section>
  )
}
