import { formatCurrency } from '../../lib/format'
import type { ProjectionPoint } from '../../lib/projection'

const TIGHT_BALANCE_THRESHOLD = 200

export default function ProjectionPeriodRow({ point }: { point: ProjectionPoint }) {
  const isTight = point.periodBalance < TIGHT_BALANCE_THRESHOLD

  return (
    <li className={`projection-row ${isTight ? 'tight' : ''}`}>
      <div className="projection-row-main">
        <span className="projection-row-label">{point.label}</span>
        <span className="projection-row-detail">
          +{formatCurrency(point.income)} · -{formatCurrency(point.expense)}
        </span>
      </div>
      <span className={`projection-row-balance ${isTight ? 'tight' : 'positive'}`}>
        {point.periodBalance >= 0 ? '+' : ''}
        {formatCurrency(point.periodBalance)}
      </span>
    </li>
  )
}
