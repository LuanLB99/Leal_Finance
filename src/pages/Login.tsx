import { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'

export default function Login() {
  const { signInWithGoogle, signInWithPassword, signUpWithPassword } = useAuth()
  const [mode, setMode] = useState<'signin' | 'signup'>('signin')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [info, setInfo] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setInfo(null)
    setLoading(true)
    const result =
      mode === 'signin'
        ? await signInWithPassword(email, password)
        : await signUpWithPassword(email, password)
    setLoading(false)
    if (result.error) {
      setError(result.error)
    } else if (mode === 'signup') {
      setInfo('Conta criada! Verifique seu e-mail para confirmar (se a confirmação estiver ativada).')
    }
  }

  return (
    <div className="auth-screen">
      <div className="auth-card">
        <h1>Leal Finance</h1>
        <p className="auth-subtitle">Controle seus gastos e receitas</p>

        <button className="btn btn-google" onClick={signInWithGoogle} type="button">
          Entrar com Google
        </button>

        <div className="auth-divider">ou</div>

        <form onSubmit={handleSubmit} className="auth-form">
          <input
            type="email"
            placeholder="E-mail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            minLength={6}
            required
          />
          {error && <p className="auth-error">{error}</p>}
          {info && <p className="auth-info">{info}</p>}
          <button className="btn btn-primary" type="submit" disabled={loading}>
            {loading ? 'Aguarde...' : mode === 'signin' ? 'Entrar' : 'Criar conta'}
          </button>
        </form>

        <button
          className="btn-link"
          type="button"
          onClick={() => setMode(mode === 'signin' ? 'signup' : 'signin')}
        >
          {mode === 'signin' ? 'Não tem conta? Criar uma' : 'Já tem conta? Entrar'}
        </button>
      </div>
    </div>
  )
}
