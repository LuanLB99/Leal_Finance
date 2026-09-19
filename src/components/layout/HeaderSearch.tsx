import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search } from 'lucide-react'

export default function HeaderSearch() {
  const navigate = useNavigate()
  const [value, setValue] = useState('')

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    navigate(value.trim() ? `/transacoes?q=${encodeURIComponent(value.trim())}` : '/transacoes')
  }

  return (
    <form className="header-search" onSubmit={handleSubmit}>
      <Search size={16} />
      <input
        placeholder="Buscar transações..."
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
    </form>
  )
}
