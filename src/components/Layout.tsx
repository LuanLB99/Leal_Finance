import { Outlet } from 'react-router-dom'
import Header from './layout/Header'
import BottomNav from './layout/BottomNav'

export default function Layout() {
  return (
    <div className="app-shell">
      <Header />
      <main className="app-main">
        <Outlet />
      </main>
      <BottomNav />
    </div>
  )
}
