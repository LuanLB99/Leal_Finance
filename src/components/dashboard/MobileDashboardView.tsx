import GreetingHeader from './GreetingHeader'
import HeroCard from './HeroCard'
import SummaryCards from './SummaryCards'
import OccurrenceList from '../OccurrenceList'
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
  realized: Occurrence[]
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
  realized,
  categoryMap,
}: Props) {
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
        <h3>Últimos lançamentos</h3>
        <OccurrenceList items={realized} categoryMap={categoryMap} emptyMessage="Nenhum lançamento neste período." limit={8} />
      </div>
    </div>
  )
}
