import { useMemo } from 'react'
import { buildProjection } from '../lib/projection'
import type { Period, Transaction } from '../types'

export function useProjection(
  transactions: Transaction[],
  period: Period,
  periodsAhead: number,
  startingBalance: number,
  referenceDate?: Date
) {
  // referenceDate é opcional e, quando informado pelo chamador, costuma ser um
  // `new Date()` recriado a cada render — usar sua identidade como dependência
  // do useMemo invalidaria o cache em todo render. Deriva-se um valor primitivo
  // estável (timestamp ou undefined) para servir de dependência real.
  const referenceTime = referenceDate?.getTime()

  return useMemo(
    () =>
      buildProjection(
        transactions,
        period,
        periodsAhead,
        startingBalance,
        referenceTime !== undefined ? new Date(referenceTime) : undefined
      ),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [transactions, period, periodsAhead, startingBalance, referenceTime]
  )
}
