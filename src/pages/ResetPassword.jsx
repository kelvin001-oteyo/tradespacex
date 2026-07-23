import { useState } from 'react'
import { useLocation, useNavigate, Link } from 'react-router-dom'
import AuthLayout from '../components/AuthLayout'
import Field from '../components/Field'
import * as authApi from '../api/authApi'

export default function ResetPassword() {
  const location = useLocation()
  const navigate = useNavigate()
  const [token] = useState(location.state?.token || new URLSearchParams(location.search).get('token') || '')
  const [uid] = useState(new URLSearchParams(location.search).get('uid') || '')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setBusy(true)
    try {
      await authApi.resetPassword({ uid, token, newPassword: password })
      navigate('/login')
    } catch (err) {
      setError(err.body?.detail || 'That reset link is invalid or has expired.')
    } finally {
      setBusy(false)
    }
  }

  return (
    <AuthLayout
      docNumber="FORM 04 — NEW PASSWORD"
      title="Set a new password"
      footer={<Link to="/login" className="btn-ghost">Back to log in</Link>}
    >
      <form onSubmit={handleSubmit} noValidate>
        <Field label="New password">
          <input
            type="password"
            className="field-input"
            required
            minLength={8}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="At least 8 characters"
          />
        </Field>
        {error && <p className="text-error" style={{ marginBottom: 14 }}>{error}</p>}
        <button type="submit" className="btn-primary" disabled={busy || !token}>
          {busy ? 'Saving…' : 'Save new password'}
        </button>
        {!token && (
          <p style={{ marginTop: 12, fontSize: 12.5, color: 'var(--slate)' }}>
            No reset token found — open this page from the link in your email.
          </p>
        )}
      </form>
    </AuthLayout>
  )
}