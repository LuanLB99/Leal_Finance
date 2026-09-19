import { useMemo, useState } from 'react'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts'
import { useTransactions } from '../hooks/useTransactions'
import { useCategories } from '../hooks/useCategories'
import { expandOccurrences, periodRange } from '../lib/occurrences'
import { CategoryIcon } from '../lib/icons'
import PeriodSelector from '../components/PeriodSelector'
import type { Period } from '../types'

function currency(value: number) {
  return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

export default function Dashboard() {
  const { transactions, loading } = useTransactions()
  const { categories } = useCategories()
  const [period, setPeriod] = useState<Period>('month')
  const [reference, setReference] = useState(new Date())

  const { start, end } = useMemo(() => periodRange(period, reference), [period, reference])
  const occurrences = useMemo(() => expandOccurrences(transactions, start, end), [transactions, start, end])

  const today = format(new Date(), 'yyyy-MM-dd')
  const realized = occurrences.filter((o) => o.occurrence_date <= today)
  const upcoming = occurrences.filter((o) => o.occurrence_date > today)

  const income = realized.filter((o) => o.type === 'income').reduce((s, o) => s + Number(o.amount), 0)
  const expense = realized.filter((o) => o.type === 'expense').reduce((s, o) => s + Number(o.amount), 0)
  const balance = income - expense

  const categoryMap = useMemo(() => new Map(categories.map((c) => [c.id, c])), [categories])

  const byCategory = useMemo(() => {
    const totals = new Map<string, number>()
    for (const o of realized) {
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
  }, [realized, categoryMap])

  if (loading) return <p>Carregando...</p>

  return (
    <div className="dashboard">
      <PeriodSelector period={period} reference={reference} onPeriodChange={setPeriod} onReferenceChange={setReference} />

      <div className="summary-cards">
        <div className="summary-card income">
          <span className="summary-label">Entradas</span>
          <span className="summary-value">{currency(income)}</span>
        </div>
        <div className="summary-card expense">
          <span className="summary-label">Saídas</span>
          <span className="summary-value">{currency(expense)}</span>
        </div>
        <div className={`summary-card balance ${balance >= 0 ? 'positive' : 'negative'}`}>
          <span className="summary-label">Saldo</span>
          <span className="summary-value">{currency(balance)}</span>
        </div>
      </div>

      <div className="dashboard-grid">
        <div className="panel">
          <h3>Gastos por categoria</h3>
          {byCategory.length === 0 ? (
            <p className="empty-state">Nenhum gasto neste período.</p>
          ) : (
            <div className="chart-with-legend">
              <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                  <Pie data={byCategory} dataKey="value" nameKey="name" innerRadius={50} outerRadius={80}>
                    {byCategory.map((entry) => (
                      <Cell key={entry.categoryId} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(v) => currency(Number(v))} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

        <div className="panel">
          <h3>Agendados / futuros neste período</h3>
          {upcoming.length === 0 ? (
            <p className="empty-state">Nada agendado.</p>
          ) : (
            <ul className="occurrence-list">
              {upcoming.map((o) => {
                const cat = o.category_id ? categoryMap.get(o.category_id) : undefined
                return (
                  <li key={`${o.id}-${o.occurrence_date}`} className="occurrence-item">
                    <span className="occurrence-icon" style={{ color: cat?.color }}>
                      <CategoryIcon name={cat?.icon ?? 'circle'} />
                    </span>
                    <div className="occurrence-info">
                      <span className="occurrence-desc">{o.description}</span>
                      <span className="occurrence-date">
                        {format(new Date(`${o.occurrence_date}T00:00:00`), "d 'de' MMM", { locale: ptBR })}
                        {o.is_recurring ? ' · recorrente' : ''}
                      </span>
                    </div>
                    <span className={`occurrence-amount ${o.type}`}>
                      {o.type === 'expense' ? '-' : '+'}
                      {currency(Number(o.amount))}
                    </span>
                  </li>
                )
              })}
            </ul>
          )}
        </div>
      </div>

      <div className="panel">
        <h3>Lançamentos do período</h3>
        {realized.length === 0 ? (
          <p className="empty-state">Nenhum lançamento neste período.</p>
        ) : (
          <ul className="occurrence-list">
            {realized.map((o) => {
              const cat = o.category_id ? categoryMap.get(o.category_id) : undefined
              return (
                <li key={`${o.id}-${o.occurrence_date}`} className="occurrence-item">
                  <span className="occurrence-icon" style={{ color: cat?.color }}>
                    <CategoryIcon name={cat?.icon ?? 'circle'} />
                  </span>
                  <div className="occurrence-info">
                    <span className="occurrence-desc">{o.description}</span>
                    <span className="occurrence-date">
                      {format(new Date(`${o.occurrence_date}T00:00:00`), "d 'de' MMM", { locale: ptBR })}
                      {cat ? ` · ${cat.name}` : ''}
                    </span>
                  </div>
                  <span className={`occurrence-amount ${o.type}`}>
                    {o.type === 'expense' ? '-' : '+'}
                    {currency(Number(o.amount))}
                  </span>
                </li>
              )
            })}
          </ul>
        )}
      </div>
    </div>
  )
}
