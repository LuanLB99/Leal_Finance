import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { ListTree } from 'lucide-react'
import GreetingHeader from './GreetingHeader'
import HeroCard from './HeroCard'
import SummaryCards from './SummaryCards'
import OccurrenceList from '../OccurrenceList'
import CategoryFilterMenu, { ALL_CATEGORIES } from '../CategoryFilterMenu'
import type { CategoryTotal } from '../../hooks/useDashboardMetrics'
import type { Category, Occurrence, Period } from '../../types'

interface Props {
  period: Period
  onPeriodChange: (period: Period) => void
  income: number
  expense: number
  balance: number
  byCategory: CategoryTotal[]
  upcoming: Occurrence[]
  recentFirst: Occurrence[]
  categoryMap: Map<string, Category>
}

export default function MobileDashboardView({
  period,
  onPeriodChange,
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
    <div className="mobile-dashboard">
      <GreetingHeader />

      <HeroCard
        period={period}
        onPeriodChange={onPeriodChange}
        balance={balance}
        byCategory={byCategory}
        upcoming={upcoming}
        categoryMap={categoryMap}
      />

      <SummaryCards income={income} expense={expense} />

      <div className="panel">
        <div className="panel-header-row">
          <h3>Últimas transações</h3>
          <div className="panel-header-icons">
            <Link to="/transacoes" className="panel-filter-btn" title="Ver todas as transações">
              <ListTree size={16} />
            </Link>
            <CategoryFilterMenu
              categories={Array.from(categoryMap.values())}
              value={categoryFilter}
              onChange={setCategoryFilter}
            />
          </div>
        </div>
        <OccurrenceList items={filteredTransactions} categoryMap={categoryMap} emptyMessage="Nenhuma transação encontrada." limit={8} />
      </div>
    </div>
  )
}
