import PeriodSelector from '../PeriodSelector'
import SummaryCards from './SummaryCards'
import CategoryPieChart from './CategoryPieChart'
import OccurrenceList from '../OccurrenceList'
import type { CategoryTotal } from '../../hooks/useDashboardMetrics'
import type { Category, Occurrence, Period } from '../../types'

interface Props {
  period: Period
  reference: Date
  onPeriodChange: (period: Period) => void
  onReferenceChange: (date: Date) => void
  income: number
  expense: number
  balance: number
  byCategory: CategoryTotal[]
  upcoming: Occurrence[]
  realized: Occurrence[]
  categoryMap: Map<string, Category>
}

export default function DesktopDashboardView({
  period,
  reference,
  onPeriodChange,
  onReferenceChange,
  income,
  expense,
  balance,
  byCategory,
  upcoming,
  realized,
  categoryMap,
}: Props) {
  return (
    <div className="desktop-dashboard">
      <PeriodSelector period={period} reference={reference} onPeriodChange={onPeriodChange} onReferenceChange={onReferenceChange} />

      <SummaryCards income={income} expense={expense} balance={balance} />

      <div className="dashboard-grid">
        <div className="panel">
          <h3>Gastos por categoria</h3>
          {byCategory.length === 0 ? (
            <p className="empty-state">Nenhum gasto neste período.</p>
          ) : (
            <CategoryPieChart data={byCategory} showLegend />
          )}
        </div>

        <div className="panel">
          <h3>Agendados / futuros neste período</h3>
          <OccurrenceList items={upcoming} categoryMap={categoryMap} emptyMessage="Nada agendado." />
        </div>
      </div>

      <div className="panel">
        <h3>Lançamentos do período</h3>
        <OccurrenceList items={realized} categoryMap={categoryMap} emptyMessage="Nenhum lançamento neste período." />
      </div>
    </div>
  )
}
