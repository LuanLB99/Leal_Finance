import UserMenu from '../UserMenu'
import ProjectionEditMenu from './ProjectionEditMenu'
import ProjectionTrendChart from './ProjectionTrendChart'
import ProjectionPeriodRow from './ProjectionPeriodRow'
import { formatCurrency } from '../../lib/format'
import { PERIOD_LABEL_PLURAL } from '../../lib/periodLabels'
import type { ProjectionPoint } from '../../lib/projection'
import type { Period } from '../../types'

interface Props {
  period: Period
  periodsAhead: number
  onPeriodChange: (period: Period) => void
  onPeriodsAheadChange: (periodsAhead: number) => void
  points: ProjectionPoint[]
}

export default function MobileProjectionView({ period, periodsAhead, onPeriodChange, onPeriodsAheadChange, points }: Props) {
  const last = points[points.length - 1]

  return (
    <div className="mobile-projection">
      <div className="page-header">
        <h2>Projeção</h2>
        <UserMenu />
      </div>

      <div className="projection-toolbar">
        <span>
          Próximos <b>{periodsAhead}</b> {PERIOD_LABEL_PLURAL[period]}
        </span>
        <ProjectionEditMenu
          period={period}
          periodsAhead={periodsAhead}
          onPeriodChange={onPeriodChange}
          onPeriodsAheadChange={onPeriodsAheadChange}
        />
      </div>

      <div className="hero-card">
        <p className="hero-eyebrow">Saldo projetado em {last?.label}</p>
        <p className={`hero-value ${last && last.cumulativeBalance < 0 ? 'negative' : ''}`}>
          {last ? formatCurrency(last.cumulativeBalance) : '—'}
        </p>
        <ProjectionTrendChart points={points} height={80} />
      </div>

      <div className="panel">
        <h3>{period === 'week' ? 'Semana a semana' : period === 'year' ? 'Ano a ano' : 'Mês a mês'}</h3>
        <ul className="projection-list">
          {points.map((point) => (
            <ProjectionPeriodRow key={point.label} point={point} />
          ))}
        </ul>
      </div>
    </div>
  )
}
