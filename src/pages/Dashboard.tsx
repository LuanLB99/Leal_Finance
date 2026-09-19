import { useState } from 'react'
import { useTransactions } from '../hooks/useTransactions'
import { useCategories } from '../hooks/useCategories'
import { useDashboardMetrics } from '../hooks/useDashboardMetrics'
import MobileDashboardView from '../components/dashboard/MobileDashboardView'
import DesktopDashboardView from '../components/dashboard/DesktopDashboardView'
import type { Period } from '../types'

export default function Dashboard() {
  const { transactions, loading: loadingTransactions } = useTransactions()
  const { categories, loading: loadingCategories } = useCategories()
  const [period, setPeriod] = useState<Period>('month')
  const [reference, setReference] = useState(new Date())

  const metrics = useDashboardMetrics(transactions, categories, period, reference)

  if (loadingTransactions || loadingCategories) return <p>Carregando...</p>

  return (
    <div className="dashboard">
      <MobileDashboardView period={period} onPeriodChange={setPeriod} {...metrics} />
      <DesktopDashboardView
        period={period}
        reference={reference}
        onPeriodChange={setPeriod}
        onReferenceChange={setReference}
        {...metrics}
      />
    </div>
  )
}
