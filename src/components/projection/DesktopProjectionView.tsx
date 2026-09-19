import ProjectionEditMenu from './ProjectionEditMenu'
import ProjectionTrendChart from './ProjectionTrendChart'
import { formatCurrency } from '../../lib/format'
import { PERIOD_LABEL_PLURAL, PERIOD_LABEL_SINGULAR } from '../../lib/periodLabels'
import type { ProjectionPoint } from '../../lib/projection'
import type { Period } from '../../types'

interface Props {
  period: Period
  periodsAhead: number
  startingBalance: number
  onPeriodChange: (period: Period) => void
  onPeriodsAheadChange: (periodsAhead: number) => void
  points: ProjectionPoint[]
}

export default function DesktopProjectionView({
  period,
  periodsAhead,
  startingBalance,
  onPeriodChange,
  onPeriodsAheadChange,
  points,
}: Props) {
  return (
    <div className="desktop-projection">
      <div className="page-header">
        <h2>Projeção financeira</h2>
        <div className="period-tabs">
          {(Object.keys(PERIOD_LABEL_SINGULAR) as Period[]).map((p) => (
            <button key={p} type="button" className={p === period ? 'active' : ''} onClick={() => onPeriodChange(p)}>
              {PERIOD_LABEL_SINGULAR[p]}
            </button>
          ))}
        </div>
      </div>

      <div className="panel-header-row">
        <span className="projection-subtitle">
          Projetando os próximos <b>{periodsAhead}</b> {PERIOD_LABEL_PLURAL[period]}, a partir do saldo atual de{' '}
          <b className={startingBalance >= 0 ? 'text-income' : 'text-expense'}>{formatCurrency(startingBalance)}</b>
        </span>
        <ProjectionEditMenu
          period={period}
          periodsAhead={periodsAhead}
          onPeriodChange={onPeriodChange}
          onPeriodsAheadChange={onPeriodsAheadChange}
          showPeriodOptions={false}
          triggerLabel="Ajustar período ▾"
        />
      </div>

      <div className="panel">
        <ProjectionTrendChart points={points} height={160} />
      </div>

      <div className="panel">
        <div className="projection-table-header">
          <span>Período</span>
          <span>Entradas</span>
          <span>Saídas</span>
          <span>Saldo acumulado</span>
        </div>
        <div className="projection-table">
          {points.map((point) => (
            <div key={point.label} className={`projection-table-row ${point.periodBalance < 200 ? 'tight' : ''}`}>
              <span className="projection-table-label">{point.label}</span>
              <span className="text-income">+{formatCurrency(point.income)}</span>
              <span className="text-expense">-{formatCurrency(point.expense)}</span>
              <span className="projection-table-balance">{formatCurrency(point.cumulativeBalance)}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
