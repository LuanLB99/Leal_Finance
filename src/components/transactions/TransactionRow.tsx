import { format } from 'date-fns'
import { CalendarX2, Pencil, Trash2 } from 'lucide-react'
import { CategoryIcon } from '../../lib/icons'
import { formatCurrency } from '../../lib/format'
import type { Category, Transaction } from '../../types'

interface Props {
  transaction: Transaction
  category?: Category
  onEdit: () => void
  onDelete: () => void
  onCancelRecurrence: () => void
}

export default function TransactionRow({ transaction, category, onEdit, onDelete, onCancelRecurrence }: Props) {
  const today = format(new Date(), 'yyyy-MM-dd')
  const isScheduled = transaction.date > today
  const canCancelRecurrence =
    transaction.is_recurring && (!transaction.recurrence_end_date || transaction.recurrence_end_date > today)

  return (
    <li className="occurrence-item">
      <span className="occurrence-icon" style={{ color: category?.color }}>
        <CategoryIcon name={category?.icon ?? 'circle'} />
      </span>
      <div className="occurrence-info">
        <span className="occurrence-desc">
          {transaction.description}
          {isScheduled && <span className="badge">agendado</span>}
          {transaction.is_recurring && <span className="badge">recorrente</span>}
        </span>
        <span className="occurrence-date">
          {format(new Date(`${transaction.date}T00:00:00`), 'dd/MM/yyyy')}
          {category ? ` · ${category.name}` : ''}
        </span>
      </div>
      <span className={`occurrence-amount ${transaction.type}`}>
        {transaction.type === 'expense' ? '-' : '+'}
        {formatCurrency(Number(transaction.amount))}
      </span>
      <div className="row-actions">
        {canCancelRecurrence && (
          <button className="btn-icon" onClick={onCancelRecurrence} title="Cancelar recorrência" type="button">
            <CalendarX2 size={16} />
          </button>
        )}
        <button className="btn-icon" onClick={onEdit} type="button">
          <Pencil size={16} />
        </button>
        <button className="btn-icon" onClick={onDelete} type="button">
          <Trash2 size={16} />
        </button>
      </div>
    </li>
  )
}
