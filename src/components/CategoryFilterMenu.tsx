import { useEffect, useRef, useState } from 'react'
import { SlidersHorizontal } from 'lucide-react'
import type { Category } from '../types'

export const ALL_CATEGORIES = 'all'

interface Props {
  categories: Category[]
  value: string
  onChange: (categoryId: string) => void
}

export default function CategoryFilterMenu({ categories, value, onChange }: Props) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const sorted = [...categories].sort((a, b) => a.name.localeCompare(b.name))
  const selectedName = sorted.find((c) => c.id === value)?.name ?? 'Todas as categorias'

  useEffect(() => {
    if (!open) return
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [open])

  function select(id: string) {
    onChange(id)
    setOpen(false)
  }

  return (
    <div className="panel-filter" ref={ref}>
      <button
        type="button"
        className={`panel-filter-btn ${value !== ALL_CATEGORIES ? 'active' : ''}`}
        onClick={() => setOpen((v) => !v)}
        title={`Filtrar por categoria (${selectedName})`}
      >
        <SlidersHorizontal size={16} />
      </button>
      {open && (
        <div className="panel-filter-menu">
          <button type="button" className={value === ALL_CATEGORIES ? 'active' : ''} onClick={() => select(ALL_CATEGORIES)}>
            Todas as categorias
          </button>
          {sorted.map((c) => (
            <button key={c.id} type="button" className={value === c.id ? 'active' : ''} onClick={() => select(c.id)}>
              {c.name}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
