import type { ReactNode } from 'react'
import { Reveal } from './Reveal'
import { Scramble } from './Scramble'

type SectionProps = {
  id: string
  title: ReactNode
  eyebrow?: string
  lead?: ReactNode
  children: ReactNode
  className?: string
  doodle?: ReactNode
}

export function Section({ id, title, eyebrow, lead, children, className, doodle }: SectionProps) {
  return (
    <section id={id} className={`section ${className ?? ''}`}>
      <div className="container">
        <Reveal>
          <div className="section-head">
            {doodle ? <span className="doodle" aria-hidden="true">{doodle}</span> : null}
            {eyebrow ? <p className="eyebrow mono"><Scramble text={eyebrow} /></p> : null}
            <h2 className="h2">{title}</h2>
            {lead ? <p className="lead">{lead}</p> : null}
          </div>
        </Reveal>
        {children}
      </div>
    </section>
  )
}
