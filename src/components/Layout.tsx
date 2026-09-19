import { NavLink, Outlet } from 'react-router-dom'
import { LayoutDashboard, ListTree, Tags, LogOut } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'

export default function Layout() {
  const { user, signOut } = useAuth()

  return (
    <div className="app-shell">
      <header className="app-header">
        <div className="app-brand">Leal Finance</div>
        <nav className="app-nav">
          <NavLink to="/" end className={({ isActive }) => (isActive ? 'active' : '')}>
            <LayoutDashboard size={18} /> Painel
          </NavLink>
          <NavLink to="/transacoes" className={({ isActive }) => (isActive ? 'active' : '')}>
            <ListTree size={18} /> Transações
          </NavLink>
          <NavLink to="/categorias" className={({ isActive }) => (isActive ? 'active' : '')}>
            <Tags size={18} /> Categorias
          </NavLink>
        </nav>
        <div className="app-user">
          <span>{user?.email}</span>
          <button className="btn-icon" onClick={signOut} title="Sair">
            <LogOut size={18} />
          </button>
        </div>
      </header>
      <main className="app-main">
        <Outlet />
      </main>
    </div>
  )
}
