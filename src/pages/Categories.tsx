import { useState } from 'react'
import { Plus, Trash2, Pencil, X } from 'lucide-react'
import { useCategories } from '../hooks/useCategories'
import { CategoryIcon, ICON_NAMES } from '../lib/icons'
import type { Category, CategoryType } from '../types'

const COLORS = [
  '#ef4444', '#f97316', '#f59e0b', '#84cc16', '#22c55e', '#14b8a6',
  '#06b6d4', '#3b82f6', '#6366f1', '#8b5cf6', '#d946ef', '#ec4899', '#6b7280',
]

const emptyForm = () => ({ name: '', icon: 'circle', color: COLORS[0], type: 'expense' as CategoryType })

export default function Categories() {
  const { categories, loading, createCategory, updateCategory, deleteCategory } = useCategories()
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState(emptyForm())
  const [error, setError] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)

  function startCreate() {
    setForm(emptyForm())
    setEditingId(null)
    setShowForm(true)
    setError(null)
  }

  function startEdit(cat: Category) {
    setForm({ name: cat.name, icon: cat.icon, color: cat.color, type: cat.type })
    setEditingId(cat.id)
    setShowForm(true)
    setError(null)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.name.trim()) {
      setError('Informe um nome para a categoria.')
      return
    }
    setSaving(true)
    setError(null)
    const result = editingId ? await updateCategory(editingId, form) : await createCategory(form)
    setSaving(false)
    if (result.error) {
      setError(result.error)
      return
    }
    setShowForm(false)
  }

  async function handleDelete(id: string) {
    if (!confirm('Excluir esta categoria? Transações vinculadas ficarão sem categoria.')) return
    await deleteCategory(id)
  }

  return (
    <div className="categories-page">
      <div className="page-header">
        <h2>Categorias</h2>
        <button className="btn btn-primary" onClick={startCreate} type="button">
          <Plus size={16} /> Nova categoria
        </button>
      </div>

      {showForm && (
        <div className="modal-backdrop" onClick={() => setShowForm(false)}>
          <form className="modal-card" onClick={(e) => e.stopPropagation()} onSubmit={handleSubmit}>
            <div className="modal-header">
              <h3>{editingId ? 'Editar categoria' : 'Nova categoria'}</h3>
              <button type="button" className="btn-icon" onClick={() => setShowForm(false)}>
                <X size={18} />
              </button>
            </div>

            <label>
              Nome
              <input
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="Ex: Pets"
                required
              />
            </label>

            <label>
              Aplica-se a
              <select
                value={form.type}
                onChange={(e) => setForm({ ...form, type: e.target.value as CategoryType })}
              >
                <option value="expense">Saídas</option>
                <option value="income">Entradas</option>
                <option value="both">Ambos</option>
              </select>
            </label>

            <div className="field-block">
              <span>Cor</span>
              <div className="color-grid">
                {COLORS.map((c) => (
                  <button
                    key={c}
                    type="button"
                    className={`color-swatch ${form.color === c ? 'selected' : ''}`}
                    style={{ backgroundColor: c }}
                    onClick={() => setForm({ ...form, color: c })}
                  />
                ))}
              </div>
            </div>

            <div className="field-block">
              <span>Ícone</span>
              <div className="icon-grid">
                {ICON_NAMES.map((name) => (
                  <button
                    key={name}
                    type="button"
                    className={`icon-swatch ${form.icon === name ? 'selected' : ''}`}
                    style={{ color: form.color }}
                    onClick={() => setForm({ ...form, icon: name })}
                  >
                    <CategoryIcon name={name} />
                  </button>
                ))}
              </div>
            </div>

            {error && <p className="auth-error">{error}</p>}

            <button className="btn btn-primary" type="submit" disabled={saving}>
              {saving ? 'Salvando...' : 'Salvar'}
            </button>
          </form>
        </div>
      )}

      {loading ? (
        <p>Carregando...</p>
      ) : (
        <ul className="category-list">
          {categories.map((cat) => (
            <li key={cat.id} className="category-item">
              <span className="occurrence-icon" style={{ color: cat.color }}>
                <CategoryIcon name={cat.icon} />
              </span>
              <div className="occurrence-info">
                <span className="occurrence-desc">{cat.name}</span>
                <span className="occurrence-date">
                  {cat.type === 'expense' ? 'Saídas' : cat.type === 'income' ? 'Entradas' : 'Entradas e saídas'}
                </span>
              </div>
              <div className="row-actions">
                <button className="btn-icon" onClick={() => startEdit(cat)} type="button">
                  <Pencil size={16} />
                </button>
                <button className="btn-icon" onClick={() => handleDelete(cat.id)} type="button">
                  <Trash2 size={16} />
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
