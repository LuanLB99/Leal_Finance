import { useCallback, useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'
import type { Category } from '../types'

export function useCategories() {
  const { user } = useAuth()
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)

  const reload = useCallback(async () => {
    if (!user) return
    setLoading(true)
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('name', { ascending: true })
    if (!error && data) setCategories(data as Category[])
    setLoading(false)
  }, [user])

  useEffect(() => {
    reload()
  }, [reload])

  async function createCategory(input: Pick<Category, 'name' | 'icon' | 'color' | 'type'>) {
    if (!user) return { error: 'Não autenticado' }
    const { error } = await supabase.from('categories').insert({ ...input, user_id: user.id })
    if (!error) await reload()
    return { error: error?.message ?? null }
  }

  async function updateCategory(id: string, input: Partial<Pick<Category, 'name' | 'icon' | 'color' | 'type'>>) {
    const { error } = await supabase.from('categories').update(input).eq('id', id)
    if (!error) await reload()
    return { error: error?.message ?? null }
  }

  async function deleteCategory(id: string) {
    const { error } = await supabase.from('categories').delete().eq('id', id)
    if (!error) await reload()
    return { error: error?.message ?? null }
  }

  return { categories, loading, reload, createCategory, updateCategory, deleteCategory }
}
