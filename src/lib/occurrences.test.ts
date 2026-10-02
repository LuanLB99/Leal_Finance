import { describe, expect, it } from 'vitest'
import { expandOccurrences, periodRange } from './occurrences'
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

describe('expandOccurrences', () => {
  it('inclui uma transação não recorrente quando a data cai dentro do intervalo', () => {
    const tx = makeTransaction({ date: '2026-01-15' })
    const result = expandOccurrences([tx], new Date(2026, 0, 1), new Date(2026, 0, 31))
    expect(result).toHaveLength(1)
    expect(result[0].occurrence_date).toBe('2026-01-15')
    expect(result[0].is_virtual).toBe(false)
  })

  it('exclui uma transação não recorrente fora do intervalo', () => {
    const tx = makeTransaction({ date: '2026-02-01' })
    const result = expandOccurrences([tx], new Date(2026, 0, 1), new Date(2026, 0, 31))
    expect(result).toHaveLength(0)
  })

  it('mantém a data local exata na ocorrência, sem deslocar por fuso (UTC)', () => {
    const tx = makeTransaction({ date: '2026-01-31', is_recurring: true, recurrence_frequency: 'monthly' })
    const result = expandOccurrences([tx], new Date(2026, 1, 1), new Date(2026, 2, 31))
    expect(result.map((o) => o.occurrence_date)).toContain('2026-02-28')
  })

  it('expande uma recorrência mensal em múltiplas ocorrências dentro do intervalo', () => {
    const tx = makeTransaction({
      date: '2026-01-05',
      is_recurring: true,
      recurrence_frequency: 'monthly',
    })
    const result = expandOccurrences([tx], new Date(2026, 0, 1), new Date(2026, 3, 30))
    expect(result.map((o) => o.occurrence_date)).toEqual(['2026-01-05', '2026-02-05', '2026-03-05', '2026-04-05'])
    expect(result[0].is_virtual).toBe(false)
    expect(result.slice(1).every((o) => o.is_virtual)).toBe(true)
  })

  it('para de gerar ocorrências após recurrence_end_date (cancelamento de recorrência)', () => {
    const tx = makeTransaction({
      date: '2026-01-05',
      is_recurring: true,
      recurrence_frequency: 'monthly',
      recurrence_end_date: '2026-02-10',
    })
    const result = expandOccurrences([tx], new Date(2026, 0, 1), new Date(2026, 3, 30))
    expect(result.map((o) => o.occurrence_date)).toEqual(['2026-01-05', '2026-02-05'])
  })

  it('não gera ocorrências recorrentes além do guard de segurança (evita loop infinito)', () => {
    const tx = makeTransaction({
      date: '2000-01-01',
      is_recurring: true,
      recurrence_frequency: 'weekly',
    })
    const result = expandOccurrences([tx], new Date(2000, 0, 1), new Date(2100, 0, 1))
    expect(result.length).toBeLessThanOrEqual(500)
  })

  it('ordena o resultado final por occurrence_date crescente', () => {
    const txA = makeTransaction({ id: 'a', date: '2026-01-20' })
    const txB = makeTransaction({ id: 'b', date: '2026-01-05' })
    const result = expandOccurrences([txA, txB], new Date(2026, 0, 1), new Date(2026, 0, 31))
    expect(result.map((o) => o.id)).toEqual(['b', 'a'])
  })
})

describe('periodRange', () => {
  it('calcula o intervalo do mês inteiro', () => {
    const { start, end } = periodRange('month', new Date(2026, 1, 15))
    expect(start).toEqual(new Date(2026, 1, 1))
    expect(end).toEqual(new Date(2026, 1, 28))
  })

  it('calcula o intervalo do ano inteiro', () => {
    const { start, end } = periodRange('year', new Date(2026, 5, 10))
    expect(start).toEqual(new Date(2026, 0, 1))
    expect(end).toEqual(new Date(2026, 11, 31))
  })

  it('calcula o intervalo da semana (domingo a sábado)', () => {
    const { start, end } = periodRange('week', new Date(2026, 8, 17)) // quinta-feira
    expect(start.getDay()).toBe(0)
    expect(end.getDay()).toBe(6)
  })
})
