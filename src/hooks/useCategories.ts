import { useCallback, useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import type { Category } from '../types'

/**
 * Categorias são globais e somente-leitura no app: só o admin gerencia
 * (criar/editar/excluir) direto pelo SQL Editor do Supabase.
 */
export function useCategories() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)

  const reload = useCallback(async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('name', { ascending: true })
    if (!error && data) setCategories(data as Category[])
    setLoading(false)
  }, [])

  useEffect(() => {
    reload()
  }, [reload])

  return { categories, loading, reload }
}
