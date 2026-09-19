import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import Layout from './components/Layout'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Transactions from './pages/Transactions'
import Categories from './pages/Categories'

function PrivateArea() {
  const { session, loading } = useAuth()

  if (loading) return <div className="loading-screen">Carregando...</div>
  if (!session) return <Login />

  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Dashboard />} />
        <Route path="transacoes" element={<Transactions />} />
        <Route path="categorias" element={<Categories />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <PrivateArea />
      </AuthProvider>
    </BrowserRouter>
  )
}
