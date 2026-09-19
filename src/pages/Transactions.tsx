import { useMemo, useState } from 'react'
import { format } from 'date-fns'
import { Plus, Trash2, Pencil, X } from 'lucide-react'
import { useTransactions, type TransactionInput } from '../hooks/useTransactions'
import { useCategories } from '../hooks/useCategories'
import { CategoryIcon } from '../lib/icons'
import type { RecurrenceFrequency, Transaction, TransactionType } from '../types'

function currency(value: number) {
  return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

const emptyForm = (): TransactionInput => ({
  description: '',
  amount: 0,
  type: 'expense',
  category_id: null,
  date: format(new Date(), 'yyyy-MM-dd'),
  status: 'confirmed',
  is_recurring: false,
  recurrence_frequency: null,
  recurrence_end_date: null,
})

export default function Transactions() {
  const { transactions, loading, createTransaction, updateTransaction, deleteTransaction } = useTransactions()
  const { categories } = useCategories()
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState<TransactionInput>(emptyForm())
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const sorted = useMemo(
    () => [...transactions].sort((a, b) => b.date.localeCompare(a.date)),
    [transactions]
  )

  const filteredCategories = categories.filter((c) => c.type === form.type || c.type === 'both')

  function startCreate() {
    setForm(emptyForm())
    setEditingId(null)
    setShowForm(true)
    setError(null)
  }

  function startEdit(tx: Transaction) {
    setForm({
      description: tx.description,
      amount: tx.amount,
      type: tx.type,
      category_id: tx.category_id,
      date: tx.date,
      status: tx.status,
      is_recurring: tx.is_recurring,
      recurrence_frequency: tx.recurrence_frequency,
      recurrence_end_date: tx.recurrence_end_date,
    })
    setEditingId(tx.id)
    setShowForm(true)
    setError(null)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.description.trim() || form.amount <= 0) {
      setError('Preencha descrição e um valor maior que zero.')
      return
    }
    setSaving(true)
    setError(null)
    const isFuture = form.date > format(new Date(), 'yyyy-MM-dd')
    const payload: TransactionInput = {
      ...form,
      status: isFuture ? 'scheduled' : 'confirmed',
    }
    const result = editingId
      ? await updateTransaction(editingId, payload)
      : await createTransaction(payload)
    setSaving(false)
    if (result.error) {
      setError(result.error)
      return
    }
    setShowForm(false)
  }

  async function handleDelete(id: string) {
    if (!confirm('Excluir este lançamento?')) return
    await deleteTransaction(id)
  }

  return (
    <div className="transactions-page">
      <div className="page-header">
        <h2>Transações</h2>
        <button className="btn btn-primary" onClick={startCreate} type="button">
          <Plus size={16} /> Novo lançamento
        </button>
      </div>

      {showForm && (
        <div className="modal-backdrop" onClick={() => setShowForm(false)}>
          <form className="modal-card" onClick={(e) => e.stopPropagation()} onSubmit={handleSubmit}>
            <div className="modal-header">
              <h3>{editingId ? 'Editar lançamento' : 'Novo lançamento'}</h3>
              <button type="button" className="btn-icon" onClick={() => setShowForm(false)}>
                <X size={18} />
              </button>
            </div>

            <div className="type-toggle">
              {(['expense', 'income'] as TransactionType[]).map((t) => (
                <button
                  key={t}
                  type="button"
                  className={form.type === t ? 'active' : ''}
                  onClick={() => setForm({ ...form, type: t, category_id: null })}
                >
                  {t === 'expense' ? 'Saída' : 'Entrada'}
                </button>
              ))}
            </div>

            <label>
              Descrição
              <input
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                placeholder="Ex: Supermercado"
                required
              />
            </label>

            <label>
              Valor (R$)
              <input
                type="number"
                min="0.01"
                step="0.01"
                value={form.amount || ''}
                onChange={(e) => setForm({ ...form, amount: parseFloat(e.target.value) || 0 })}
                required
              />
            </label>

            <label>
              Categoria
              <select
                value={form.category_id ?? ''}
                onChange={(e) => setForm({ ...form, category_id: e.target.value || null })}
              >
                <option value="">Sem categoria</option>
                {filteredCategories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </label>

            <label>
              Data
              <input
                type="date"
                value={form.date}
                onChange={(e) => setForm({ ...form, date: e.target.value })}
                required
              />
            </label>

            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={form.is_recurring}
                onChange={(e) =>
                  setForm({
                    ...form,
                    is_recurring: e.target.checked,
                    recurrence_frequency: e.target.checked ? 'monthly' : null,
                  })
                }
              />
              Repetir automaticamente (agendado)
            </label>

            {form.is_recurring && (
              <>
                <label>
                  Frequência
                  <select
                    value={form.recurrence_frequency ?? 'monthly'}
                    onChange={(e) =>
                      setForm({ ...form, recurrence_frequency: e.target.value as RecurrenceFrequency })
                    }
                  >
                    <option value="weekly">Semanal</option>
                    <option value="monthly">Mensal</option>
                    <option value="yearly">Anual</option>
                  </select>
                </label>
                <label>
                  Repetir até (opcional)
                  <input
                    type="date"
                    value={form.recurrence_end_date ?? ''}
                    onChange={(e) => setForm({ ...form, recurrence_end_date: e.target.value || null })}
                  />
                </label>
              </>
            )}

            {error && <p className="auth-error">{error}</p>}

            <button className="btn btn-primary" type="submit" disabled={saving}>
              {saving ? 'Salvando...' : 'Salvar'}
            </button>
          </form>
        </div>
      )}

      {loading ? (
        <p>Carregando...</p>
      ) : sorted.length === 0 ? (
        <p className="empty-state">Nenhum lançamento ainda. Clique em "Novo lançamento" para começar.</p>
      ) : (
        <ul className="occurrence-list">
          {sorted.map((tx) => {
            const cat = categories.find((c) => c.id === tx.category_id)
            return (
              <li key={tx.id} className="occurrence-item">
                <span className="occurrence-icon" style={{ color: cat?.color }}>
                  <CategoryIcon name={cat?.icon ?? 'circle'} />
                </span>
                <div className="occurrence-info">
                  <span className="occurrence-desc">
                    {tx.description}
                    {tx.status === 'scheduled' && <span className="badge">agendado</span>}
                    {tx.is_recurring && <span className="badge">recorrente</span>}
                  </span>
                  <span className="occurrence-date">
                    {format(new Date(`${tx.date}T00:00:00`), 'dd/MM/yyyy')}
                    {cat ? ` · ${cat.name}` : ''}
                  </span>
                </div>
                <span className={`occurrence-amount ${tx.type}`}>
                  {tx.type === 'expense' ? '-' : '+'}
                  {currency(Number(tx.amount))}
                </span>
                <div className="row-actions">
                  <button className="btn-icon" onClick={() => startEdit(tx)} type="button">
                    <Pencil size={16} />
                  </button>
                  <button className="btn-icon" onClick={() => handleDelete(tx.id)} type="button">
                    <Trash2 size={16} />
                  </button>
                </div>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}
