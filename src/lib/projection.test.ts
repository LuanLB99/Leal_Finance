import { describe, expect, it } from 'vitest'
import { buildProjection } from './projection'
import type { Transaction } from '../types'

function makeTransaction(overrides: Partial<Transaction> = {}): Transaction {
  return {
    id: 'tx-1',
    user_id: 'user-1',
    category_id: null,
    description: 'Teste',
    amount: 100,
    type: 'expense',
    date: '2026-01-15',
    status: 'confirmed',
    is_recurring: false,
    recurrence_frequency: null,
    recurrence_end_date: null,
    created_at: '2026-01-01T00:00:00Z',
    ...overrides,
  }
}

describe('buildProjection', () => {
  const reference = new Date(2026, 8, 19) // 19 de setembro de 2026

  it('começa no próximo período, não no período corrente', () => {
    const points = buildProjection([], 'month', 3, 0, reference)
    expect(points).toHaveLength(3)
    expect(points[0].label).toBe('out 2026')
    expect(points[1].label).toBe('nov 2026')
    expect(points[2].label).toBe('dez 2026')
  })

  it('acumula o saldo a partir do startingBalance informado', () => {
    const salary = makeTransaction({
      type: 'income',
      amount: 1000,
      date: '2026-01-05',
      is_recurring: true,
      recurrence_frequency: 'monthly',
    })
    const points = buildProjection([salary], 'month', 3, 500, reference)
    expect(points[0].income).toBe(1000)
    expect(points[0].periodBalance).toBe(1000)
    expect(points[0].cumulativeBalance).toBe(1500)
    expect(points[1].cumulativeBalance).toBe(2500)
    expect(points[2].cumulativeBalance).toBe(3500)
  })

  it('soma entradas e saídas separadamente por período', () => {
    const salary = makeTransaction({
      type: 'income',
      amount: 1000,
      date: '2026-01-05',
      is_recurring: true,
      recurrence_frequency: 'monthly',
    })
    const rent = makeTransaction({
      id: 'tx-2',
      type: 'expense',
      amount: 400,
      date: '2026-01-10',
      is_recurring: true,
      recurrence_frequency: 'monthly',
    })
    const points = buildProjection([salary, rent], 'month', 1, 0, reference)
    expect(points[0].income).toBe(1000)
    expect(points[0].expense).toBe(400)
    expect(points[0].periodBalance).toBe(600)
  })

  it('respeita recurrence_end_date: transação cancelada some da projeção futura', () => {
    const subscription = makeTransaction({
      type: 'expense',
      amount: 50,
      date: '2026-01-20',
      is_recurring: true,
      recurrence_frequency: 'monthly',
      recurrence_end_date: '2026-09-19',
    })
    const points = buildProjection([subscription], 'month', 3, 0, reference)
    expect(points.every((p) => p.expense === 0)).toBe(true)
  })
})
