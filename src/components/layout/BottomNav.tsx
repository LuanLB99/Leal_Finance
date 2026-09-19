import { NavLink, useNavigate } from 'react-router-dom'
import { LayoutDashboard, LineChart, Plus } from 'lucide-react'

const navLinkClass = ({ isActive }: { isActive: boolean }) => (isActive ? 'active' : '')

export default function BottomNav() {
  const navigate = useNavigate()

  return (
    <nav className="bottom-nav">
      <NavLink to="/" end className={navLinkClass}>
        <LayoutDashboard size={20} />
        Visão Geral
      </NavLink>
      <NavLink to="/projecao" className={navLinkClass}>
        <LineChart size={20} />
        Projeção
      </NavLink>
      <button
        type="button"
        className="bottom-nav-add"
        onClick={() => navigate('/transacoes?new=1')}
        title="Nova transação"
      >
        <Plus size={26} />
      </button>
    </nav>
  )
}
