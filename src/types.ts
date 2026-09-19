export type TransactionType = 'income' | 'expense'
export type CategoryType = 'income' | 'expense' | 'both'
export type TransactionStatus = 'confirmed' | 'scheduled'
export type RecurrenceFrequency = 'weekly' | 'monthly' | 'yearly'
export type Period = 'week' | 'month' | 'year'

export interface Category {
  id: string
  user_id: string
  name: string
  icon: string
  color: string
  type: CategoryType
  created_at: string
}

export interface Transaction {
  id: string
  user_id: string
  category_id: string | null
  description: string
  amount: number
  type: TransactionType
  date: string
  status: TransactionStatus
  is_recurring: boolean
  recurrence_frequency: RecurrenceFrequency | null
  recurrence_end_date: string | null
  created_at: string
}

export interface Occurrence extends Transaction {
  occurrence_date: string
  is_virtual: boolean
}
