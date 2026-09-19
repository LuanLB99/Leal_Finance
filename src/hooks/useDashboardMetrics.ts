import { useMemo } from 'react'
import { format } from 'date-fns'
import { expandOccurrences, periodRange } from '../lib/occurrences'
import type { Category, Occurrence, Period, Transaction } from '../types'

export interface CategoryTotal {
  categoryId: string
  name: string
  color: string
  value: number
}

export function useDashboardMetrics(transactions: Transaction[], categories: Category[], period: Period, reference: Date) {
  const { start, end } = useMemo(() => periodRange(period, reference), [period, reference])
  const occurrences = useMemo(() => expandOccurrences(transactions, start, end), [transactions, start, end])

  const today = format(new Date(), 'yyyy-MM-dd')
  const realized = useMemo(() => occurrences.filter((o) => o.occurrence_date <= today), [occurrences, today])
  const upcoming = useMemo(() => occurrences.filter((o) => o.occurrence_date > today), [occurrences, today])

  const income = useMemo(() => sumByType(realized, 'income'), [realized])
  const expense = useMemo(() => sumByType(realized, 'expense'), [realized])
  const balance = income - expense

  const categoryMap = useMemo(() => new Map(categories.map((c) => [c.id, c])), [categories])

  const byCategory = useMemo(() => groupExpensesByCategory(realized, categoryMap), [realized, categoryMap])

  // `realized` vem em ordem crescente (útil para os cálculos acima). Para exibição,
  // a transação mais recente (pela data em que ocorreu) deve aparecer primeiro.
  const recentFirst = useMemo(
    () => [...realized].sort((a, b) => b.occurrence_date.localeCompare(a.occurrence_date)),
    [realized]
  )

  return { realized, recentFirst, upcoming, income, expense, balance, byCategory, categoryMap }
}

function sumByType(occurrences: Occurrence[], type: 'income' | 'expense') {
  return occurrences.filter((o) => o.type === type).reduce((sum, o) => sum + Number(o.amount), 0)
}

function groupExpensesByCategory(occurrences: Occurrence[], categoryMap: Map<string, Category>): CategoryTotal[] {
  const totals = new Map<string, number>()
  for (const o of occurrences) {
    if (o.type !== 'expense') continue
    const key = o.category_id ?? 'sem-categoria'
    totals.set(key, (totals.get(key) ?? 0) + Number(o.amount))
  }
  return Array.from(totals.entries())
    .map(([categoryId, value]) => ({
      categoryId,
      name: categoryMap.get(categoryId)?.name ?? 'Sem categoria',
      color: categoryMap.get(categoryId)?.color ?? '#6b7280',
      value,
    }))
    .sort((a, b) => b.value - a.value)
}
