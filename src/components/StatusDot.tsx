import type { StatusState } from '../data/site'
import { stateLabel } from '../data/site'

const ledClass: Record<StatusState, string> = {
  online: 'led online',
  offline: 'led offline',
  maintenance: 'led warning',
  development: 'led warning',
}

export function StatusDot({ state }: { state: StatusState }) {
  return (
    <span
      className={ledClass[state]}
      role="img"
      aria-label={stateLabel[state]}
      title={stateLabel[state]}
    />
  )
}
