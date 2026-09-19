import { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { format } from 'date-fns'
import { Plus, X } from 'lucide-react'
import { useTransactions, type TransactionInput } from '../hooks/useTransactions'
import { useCategories } from '../hooks/useCategories'
import UserMenu from '../components/UserMenu'
import TransactionFormModal, { emptyTransactionForm } from '../components/transactions/TransactionFormModal'
import TransactionRow from '../components/transactions/TransactionRow'
import type { Transaction } from '../types'

type ModalState = { mode: 'create' } | { mode: 'edit'; transaction: Transaction }

function toFormInput(tx: Transaction): TransactionInput {
  const { id: _id, user_id: _userId, created_at: _createdAt, ...rest } = tx
  return rest
}

export default function Transactions() {
  const { transactions, loading, createTransaction, updateTransaction, deleteTransaction } = useTransactions()
  const { categories } = useCategories()
  const [searchParams, setSearchParams] = useSearchParams()
  const query = searchParams.get('q') ?? ''
  const [modal, setModal] = useState<ModalState | null>(null)

  const sorted = useMemo(() => {
    const list = [...transactions].sort((a, b) => b.date.localeCompare(a.date))
    if (!query.trim()) return list
    const q = query.trim().toLowerCase()
    return list.filter((tx) => tx.description.toLowerCase().includes(q))
  }, [transactions, query])

  useEffect(() => {
    if (searchParams.get('new') === '1') {
      setModal({ mode: 'create' })
      const next = new URLSearchParams(searchParams)
      next.delete('new')
      setSearchParams(next, { replace: true })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams])

  async function handleSave(values: TransactionInput) {
    const isFuture = values.date > format(new Date(), 'yyyy-MM-dd')
    const payload: TransactionInput = { ...values, status: isFuture ? 'scheduled' : 'confirmed' }
    const result =
      modal?.mode === 'edit' ? await updateTransaction(modal.transaction.id, payload) : await createTransaction(payload)
    if (!result.error) setModal(null)
    return result
  }

  async function handleDelete(id: string) {
    if (!confirm('Excluir este lançamento?')) return
    await deleteTransaction(id)
  }

  return (
    <div className="transactions-page">
      <div className="page-header">
        <h2>Transações</h2>
        <div className="page-header-actions">
          <button className="btn btn-primary" onClick={() => setModal({ mode: 'create' })} type="button">
            <Plus size={16} /> Novo lançamento
          </button>
          <div className="mobile-only-avatar">
            <UserMenu />
          </div>
        </div>
      </div>

      {query && (
        <div className="active-filter">
          Filtrando por "{query}"
          <button type="button" onClick={() => setSearchParams({})}>
            <X size={14} /> limpar
          </button>
        </div>
      )}

      {modal && (
        <TransactionFormModal
          mode={modal.mode}
          initialValues={modal.mode === 'edit' ? toFormInput(modal.transaction) : emptyTransactionForm()}
          categories={categories}
          onSubmit={handleSave}
          onClose={() => setModal(null)}
        />
      )}

      {loading ? (
        <p>Carregando...</p>
      ) : sorted.length === 0 ? (
        <p className="empty-state">Nenhum lançamento ainda. Clique em "Novo lançamento" para começar.</p>
      ) : (
        <ul className="occurrence-list">
          {sorted.map((tx) => (
            <TransactionRow
              key={tx.id}
              transaction={tx}
              category={categories.find((c) => c.id === tx.category_id)}
              onEdit={() => setModal({ mode: 'edit', transaction: tx })}
              onDelete={() => handleDelete(tx.id)}
            />
          ))}
        </ul>
      )}
    </div>
  )
}
