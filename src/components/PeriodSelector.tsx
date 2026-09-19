import { ChevronLeft, ChevronRight } from 'lucide-react'
import type { Period } from '../types'
import { addDays, addMonths, addYears, format } from 'date-fns'
import { ptBR } from 'date-fns/locale'

interface Props {
  period: Period
  reference: Date
  onPeriodChange: (p: Period) => void
  onReferenceChange: (d: Date) => void
}

export default function PeriodSelector({ period, reference, onPeriodChange, onReferenceChange }: Props) {
  function shift(delta: number) {
    if (period === 'week') onReferenceChange(addDays(reference, delta * 7))
    else if (period === 'month') onReferenceChange(addMonths(reference, delta))
    else onReferenceChange(addYears(reference, delta))
  }

  const label =
    period === 'week'
      ? `Semana de ${format(reference, "d 'de' MMM", { locale: ptBR })}`
      : period === 'month'
        ? format(reference, 'MMMM yyyy', { locale: ptBR })
        : format(reference, 'yyyy')

  return (
    <div className="period-selector">
      <div className="period-tabs">
        {(['week', 'month', 'year'] as Period[]).map((p) => (
          <button
            key={p}
            className={p === period ? 'active' : ''}
            onClick={() => onPeriodChange(p)}
            type="button"
          >
            {p === 'week' ? 'Semana' : p === 'month' ? 'Mês' : 'Ano'}
          </button>
        ))}
      </div>
      <div className="period-nav">
        <button className="btn-icon" onClick={() => shift(-1)} type="button">
          <ChevronLeft size={18} />
        </button>
        <span className="period-label">{label}</span>
        <button className="btn-icon" onClick={() => shift(1)} type="button">
          <ChevronRight size={18} />
        </button>
      </div>
    </div>
  )
}
