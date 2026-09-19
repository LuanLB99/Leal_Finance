import { useCallback, useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'
import type { Transaction } from '../types'

export type TransactionInput = Omit<Transaction, 'id' | 'user_id' | 'created_at'>

export function useTransactions() {
  const { user } = useAuth()
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)

  const reload = useCallback(async () => {
    if (!user) return
    setLoading(true)
    const { data, error } = await supabase
      .from('transactions')
      .select('*')
      .order('date', { ascending: false })
    if (!error && data) setTransactions(data as Transaction[])
    setLoading(false)
  }, [user])

  useEffect(() => {
    reload()
  }, [reload])

  async function createTransaction(input: TransactionInput) {
    if (!user) return { error: 'Não autenticado' }
    const { error } = await supabase.from('transactions').insert({ ...input, user_id: user.id })
    if (!error) await reload()
    return { error: error?.message ?? null }
  }

  async function updateTransaction(id: string, input: Partial<TransactionInput>) {
    const { error } = await supabase.from('transactions').update(input).eq('id', id)
    if (!error) await reload()
    return { error: error?.message ?? null }
  }

  async function deleteTransaction(id: string) {
    const { error } = await supabase.from('transactions').delete().eq('id', id)
    if (!error) await reload()
    return { error: error?.message ?? null }
  }

  return { transactions, loading, reload, createTransaction, updateTransaction, deleteTransaction }
}
