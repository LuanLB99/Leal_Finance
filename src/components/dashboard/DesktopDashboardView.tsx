import { useMemo, useState } from 'react'
import PeriodSelector from '../PeriodSelector'
import SummaryCards from './SummaryCards'
import CategoryPieChart from './CategoryPieChart'
import OccurrenceList from '../OccurrenceList'
import CategoryFilterMenu, { ALL_CATEGORIES } from '../CategoryFilterMenu'
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
  recentFirst: Occurrence[]
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
  recentFirst,
  categoryMap,
}: Props) {
  const [categoryFilter, setCategoryFilter] = useState(ALL_CATEGORIES)

  const filteredTransactions = useMemo(() => {
    if (categoryFilter === ALL_CATEGORIES) return recentFirst
    return recentFirst.filter((o) => o.category_id === categoryFilter)
  }, [recentFirst, categoryFilter])

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
            <CategoryPieChart data={byCategory} />
          )}
        </div>

        <div className="panel">
          <h3>Agendados / futuros neste período</h3>
          <OccurrenceList items={upcoming} categoryMap={categoryMap} emptyMessage="Nada agendado." />
        </div>
      </div>

      <div className="panel">
        <div className="panel-header-row">
          <h3>Transações do período</h3>
          <CategoryFilterMenu
            categories={Array.from(categoryMap.values())}
            value={categoryFilter}
            onChange={setCategoryFilter}
          />
        </div>
        <OccurrenceList items={filteredTransactions} categoryMap={categoryMap} emptyMessage="Nenhuma transação encontrada." />
      </div>
    </div>
  )
}
