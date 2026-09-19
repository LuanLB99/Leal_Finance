import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { CategoryIcon } from '../lib/icons'
import { formatCurrency } from '../lib/format'
import type { Category, Occurrence } from '../types'

interface Props {
  occurrence: Occurrence
  categoryMap: Map<string, Category>
}

export default function OccurrenceRow({ occurrence, categoryMap }: Props) {
  const category = occurrence.category_id ? categoryMap.get(occurrence.category_id) : undefined

  return (
    <li className="occurrence-item">
      <span className="occurrence-icon" style={{ color: category?.color }}>
        <CategoryIcon name={category?.icon ?? 'circle'} />
      </span>
      <div className="occurrence-info">
        <span className="occurrence-desc">{occurrence.description}</span>
        <span className="occurrence-date">
          {format(new Date(`${occurrence.occurrence_date}T00:00:00`), "d 'de' MMM", { locale: ptBR })}
          {category ? ` · ${category.name}` : ''}
          {occurrence.is_recurring ? ' · recorrente' : ''}
        </span>
      </div>
      <span className={`occurrence-amount ${occurrence.type}`}>
        {occurrence.type === 'expense' ? '-' : '+'}
        {formatCurrency(Number(occurrence.amount))}
      </span>
    </li>
  )
}
