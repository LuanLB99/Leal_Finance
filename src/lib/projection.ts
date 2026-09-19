import { addWeeks, addMonths, addYears, format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { expandOccurrences, periodRange } from './occurrences'
import type { Period, Transaction } from '../types'

export interface ProjectionPoint {
  periodStart: Date
  periodEnd: Date
  label: string
  income: number
  expense: number
  periodBalance: number
  cumulativeBalance: number
}

function advance(date: Date, period: Period): Date {
  if (period === 'week') return addWeeks(date, 1)
  if (period === 'month') return addMonths(date, 1)
  return addYears(date, 1)
}

function buildLabel(period: Period, start: Date): string {
  if (period === 'week') return `Semana de ${format(start, "d 'de' MMM", { locale: ptBR })}`
  if (period === 'year') return format(start, 'yyyy', { locale: ptBR })
  return format(start, 'MMM yyyy', { locale: ptBR })
}

export function buildProjection(
  transactions: Transaction[],
  period: Period,
  periodsAhead: number,
  startingBalance: number,
  referenceDate: Date = new Date()
): ProjectionPoint[] {
  const currentRange = periodRange(period, referenceDate)

  // A projeção começa no período seguinte ao atual: o período corrente já é
  // "presente" (parte do saldo real informado em startingBalance), não futuro.
  let cursorStart = advance(currentRange.start, period)
  let cumulativeBalance = startingBalance

  const points: ProjectionPoint[] = []

  for (let i = 0; i < periodsAhead; i += 1) {
    const { start, end } = periodRange(period, cursorStart)
    const occurrences = expandOccurrences(transactions, start, end)

    let income = 0
    let expense = 0
    for (const occurrence of occurrences) {
      const amount = Number(occurrence.amount)
      if (occurrence.type === 'income') income += amount
      else expense += amount
    }

    const periodBalance = income - expense
    cumulativeBalance += periodBalance

    points.push({
      periodStart: start,
      periodEnd: end,
      label: buildLabel(period, start),
      income,
      expense,
      periodBalance,
      cumulativeBalance,
    })

    cursorStart = advance(cursorStart, period)
  }

  return points
}
