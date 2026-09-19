import { NavLink } from 'react-router-dom'
import { LayoutDashboard, ListTree, LineChart, Brain } from 'lucide-react'
import UserMenu from '../UserMenu'
import HeaderSearch from './HeaderSearch'

const navLinkClass = ({ isActive }: { isActive: boolean }) => (isActive ? 'active' : '')

export default function Header() {
  return (
    <header className="app-header">
      <div className="app-brand">
        <Brain size={20} />
        Leal Finance
      </div>
      <nav className="app-nav">
        <NavLink to="/" end className={navLinkClass}>
          <LayoutDashboard size={18} /> Painel
        </NavLink>
        <NavLink to="/transacoes" className={navLinkClass}>
          <ListTree size={18} /> Transações
        </NavLink>
        <NavLink to="/projecao" className={navLinkClass}>
          <LineChart size={18} /> Projeção
        </NavLink>
      </nav>
      <HeaderSearch />
      <UserMenu />
    </header>
  )
}
