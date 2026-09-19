import {
  addWeeks, addMonths, addYears, isAfter, isBefore, isEqual, startOfDay,
} from 'date-fns'
import type { Occurrence, Period, Transaction } from '../types'

function addByFrequency(date: Date, frequency: NonNullable<Transaction['recurrence_frequency']>) {
  if (frequency === 'weekly') return addWeeks(date, 1)
  if (frequency === 'monthly') return addMonths(date, 1)
  return addYears(date, 1)
}

/** Expande transações (incluindo recorrentes) em ocorrências dentro de [rangeStart, rangeEnd]. */
export function expandOccurrences(
  transactions: Transaction[],
  rangeStart: Date,
  rangeEnd: Date
): Occurrence[] {
  const start = startOfDay(rangeStart)
  const end = startOfDay(rangeEnd)
  const result: Occurrence[] = []

  for (const tx of transactions) {
    const anchor = startOfDay(new Date(`${tx.date}T00:00:00`))

    if (!tx.is_recurring || !tx.recurrence_frequency) {
      if (!isBefore(anchor, start) && !isAfter(anchor, end)) {
        result.push({ ...tx, occurrence_date: tx.date, is_virtual: false })
      }
      continue
    }

    const recurrenceEnd = tx.recurrence_end_date
      ? startOfDay(new Date(`${tx.recurrence_end_date}T00:00:00`))
      : null

    let cursor = anchor
    let guard = 0
    while (!isAfter(cursor, end) && guard < 500) {
      guard += 1
      if (recurrenceEnd && isAfter(cursor, recurrenceEnd)) break

      if (!isBefore(cursor, start)) {
        result.push({
          ...tx,
          occurrence_date: cursor.toISOString().slice(0, 10),
          is_virtual: !isEqual(cursor, anchor),
        })
      }
      cursor = addByFrequency(cursor, tx.recurrence_frequency)
    }
  }

  return result.sort((a, b) => a.occurrence_date.localeCompare(b.occurrence_date))
}

export function periodRange(period: Period, reference: Date): { start: Date; end: Date } {
  const ref = startOfDay(reference)
  if (period === 'week') {
    const day = ref.getDay()
    const start = new Date(ref)
    start.setDate(ref.getDate() - day)
    const end = new Date(start)
    end.setDate(start.getDate() + 6)
    return { start, end }
  }
  if (period === 'month') {
    const start = new Date(ref.getFullYear(), ref.getMonth(), 1)
    const end = new Date(ref.getFullYear(), ref.getMonth() + 1, 0)
    return { start, end }
  }
  const start = new Date(ref.getFullYear(), 0, 1)
  const end = new Date(ref.getFullYear(), 11, 31)
  return { start, end }
}
