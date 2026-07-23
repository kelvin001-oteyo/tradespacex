import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import AuthLayout from '../components/AuthLayout'
import Field from '../components/Field'
import { useAuth } from '../context/AuthContext'

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setBusy(true)
    try {
      await login(form.email, form.password)
      navigate('/dashboard')
    } catch (err) {
      setError(err.body?.detail || 'Invalid email or password.')
    } finally {
      setBusy(false)
    }
  }

  return (
    <AuthLayout
      docNumber="FORM 02 — SIGN IN"
      title="Welcome back"
      subtitle="Log in to continue your trade operations."
      footer={<>New to TradespaceX? <Link to="/register" className="btn-ghost">Create an account</Link></>}
    >
      <form onSubmit={handleSubmit} noValidate>
        <Field label="Email">
          <input
            type="email"
            className="field-input"
            required
            value={form.email}
            onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
            placeholder="you@company.com"
          />
        </Field>

        <Field label="Password">
          <input
            type="password"
            className="field-input"
            required
            value={form.password}
            onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
            placeholder="••••••••"
          />
        </Field>

        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: -8, marginBottom: 18 }}>
          <Link to="/forgot-password" style={{ fontSize: 12.5, color: 'var(--slate)', textDecoration: 'none' }}>
            Forgot password?
          </Link>
        </div>

        {error && <p className="text-error" style={{ marginBottom: 14 }}>{error}</p>}

        <button type="submit" className="btn-primary" disabled={busy}>
          {busy ? 'Logging in…' : 'Log in'}
        </button>
      </form>
    </AuthLayout>
  )
}