import { useMemo, useState } from 'react'
import { useTransactions } from '../hooks/useTransactions'
import { useProjection } from '../hooks/useProjection'
import { expandOccurrences } from '../lib/occurrences'
import MobileProjectionView from '../components/projection/MobileProjectionView'
import DesktopProjectionView from '../components/projection/DesktopProjectionView'
import type { Period } from '../types'

const HISTORY_START = new Date(2000, 0, 1)

export default function Projection() {
  const { transactions, loading } = useTransactions()
  const [period, setPeriod] = useState<Period>('month')
  const [periodsAhead, setPeriodsAhead] = useState(6)

  const startingBalance = useMemo(() => {
    const history = expandOccurrences(transactions, HISTORY_START, new Date())
    return history.reduce((sum, o) => sum + (o.type === 'income' ? Number(o.amount) : -Number(o.amount)), 0)
  }, [transactions])

  const points = useProjection(transactions, period, periodsAhead, startingBalance)

  if (loading) return <p>Carregando...</p>

  return (
    <div className="projection-page">
      <MobileProjectionView
        period={period}
        periodsAhead={periodsAhead}
        onPeriodChange={setPeriod}
        onPeriodsAheadChange={setPeriodsAhead}
        points={points}
      />
      <DesktopProjectionView
        period={period}
        periodsAhead={periodsAhead}
        startingBalance={startingBalance}
        onPeriodChange={setPeriod}
        onPeriodsAheadChange={setPeriodsAhead}
        points={points}
      />
    </div>
  )
}
