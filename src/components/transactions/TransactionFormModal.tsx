import { useState } from 'react'
import { format } from 'date-fns'
import { X } from 'lucide-react'
import CurrencyInput from '../CurrencyInput'
import type { TransactionInput } from '../../hooks/useTransactions'
import type { Category, RecurrenceFrequency, TransactionType } from '../../types'

export function emptyTransactionForm(): TransactionInput {
  return {
    description: '',
    amount: 0,
    type: 'expense',
    category_id: null,
    date: format(new Date(), 'yyyy-MM-dd'),
    status: 'confirmed',
    is_recurring: false,
    recurrence_frequency: null,
    recurrence_end_date: null,
  }
}

interface Props {
  mode: 'create' | 'edit'
  initialValues: TransactionInput
  categories: Category[]
  onSubmit: (values: TransactionInput) => Promise<{ error: string | null }>
  onClose: () => void
}

export default function TransactionFormModal({ mode, initialValues, categories, onSubmit, onClose }: Props) {
  const [form, setForm] = useState<TransactionInput>(initialValues)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const filteredCategories = categories.filter((c) => c.type === form.type || c.type === 'both')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.description.trim() || form.amount <= 0) {
      setError('Preencha descrição e um valor maior que zero.')
      return
    }
    setSaving(true)
    setError(null)
    const result = await onSubmit(form)
    setSaving(false)
    if (result.error) setError(result.error)
  }

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <form className="modal-card" onClick={(e) => e.stopPropagation()} onSubmit={handleSubmit}>
        <div className="modal-header">
          <h3>{mode === 'edit' ? 'Editar transação' : 'Nova transação'}</h3>
          <button type="button" className="btn-icon" onClick={onClose}>
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
          Valor
          <CurrencyInput value={form.amount} onChange={(amount) => setForm({ ...form, amount })} />
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
                onChange={(e) => setForm({ ...form, recurrence_frequency: e.target.value as RecurrenceFrequency })}
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
  )
}
