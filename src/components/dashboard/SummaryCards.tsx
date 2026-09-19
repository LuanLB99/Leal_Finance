import { formatCurrency } from '../../lib/format'

interface Props {
  income: number
  expense: number
  balance?: number
}

/** Passe `balance` para o layout desktop (3 cards); omita para o mobile (2 cards). */
export default function SummaryCards({ income, expense, balance }: Props) {
  return (
    <div className={`summary-cards ${balance === undefined ? 'two' : ''}`}>
      <div className="summary-card income">
        <span className="summary-label">Entradas</span>
        <span className="summary-value">{formatCurrency(income)}</span>
      </div>
      <div className="summary-card expense">
        <span className="summary-label">Saídas</span>
        <span className="summary-value">{formatCurrency(expense)}</span>
      </div>
      {balance !== undefined && (
        <div className={`summary-card balance ${balance >= 0 ? 'positive' : 'negative'}`}>
          <span className="summary-label">Saldo</span>
          <span className="summary-value">{formatCurrency(balance)}</span>
        </div>
      )}
    </div>
  )
}
