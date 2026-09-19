import OccurrenceRow from './OccurrenceRow'
import type { Category, Occurrence } from '../types'

interface Props {
  items: Occurrence[]
  categoryMap: Map<string, Category>
  emptyMessage: string
  limit?: number
  compact?: boolean
}

export default function OccurrenceList({ items, categoryMap, emptyMessage, limit, compact }: Props) {
  const visible = limit ? items.slice(0, limit) : items

  if (visible.length === 0) {
    return <p className="empty-state">{emptyMessage}</p>
  }

  return (
    <ul className={`occurrence-list ${compact ? 'compact' : ''}`}>
      {visible.map((o) => (
        <OccurrenceRow key={`${o.id}-${o.occurrence_date}`} occurrence={o} categoryMap={categoryMap} />
      ))}
    </ul>
  )
}
