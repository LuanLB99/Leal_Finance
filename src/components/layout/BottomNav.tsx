import { NavLink, useNavigate } from 'react-router-dom'
import { LayoutDashboard, ListTree, Plus } from 'lucide-react'

const navLinkClass = ({ isActive }: { isActive: boolean }) => (isActive ? 'active' : '')

export default function BottomNav() {
  const navigate = useNavigate()

  return (
    <nav className="bottom-nav">
      <NavLink to="/" end className={navLinkClass}>
        <LayoutDashboard size={20} />
        Visão Geral
      </NavLink>
      <button
        type="button"
        className="bottom-nav-add"
        onClick={() => navigate('/transacoes?new=1')}
        title="Novo lançamento"
      >
        <Plus size={26} />
      </button>
      <NavLink to="/transacoes" className={navLinkClass}>
        <ListTree size={20} />
        Transações
      </NavLink>
    </nav>
  )
}
