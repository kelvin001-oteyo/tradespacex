import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import AuthLayout from '../components/AuthLayout'
import Field from '../components/Field'
import * as authApi from '../api/authApi'

export default function ForgotPassword() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  const [busy, setBusy] = useState(false)
  const [mockToken, setMockToken] = useState(null)

  async function handleSubmit(e) {
    e.preventDefault()
    setBusy(true)
    const res = await authApi.forgotPassword({ email })
    setMockToken(res.__mockResetToken)
    setSent(true)
    setBusy(false)
  }

  return (
    <AuthLayout
      docNumber="FORM 03 — RESET REQUEST"
      title="Reset your password"
      subtitle="Enter the email on your account and we'll send a reset link."
      footer={<Link to="/login" className="btn-ghost">Back to log in</Link>}
    >
      {sent ? (
        <div>
          <p style={{ fontSize: 14, marginBottom: 16 }}>
            If an account exists for <span className="font-mono">{email}</span>, a reset link is on its way.
          </p>
          {mockToken && (
            <button
              type="button"
              className="btn-primary"
              onClick={() => navigate('/reset-password', { state: { token: mockToken } })}
            >
              (Dev only) Open reset link
            </button>
          )}
        </div>
      ) : (
        <form onSubmit={handleSubmit} noValidate>
          <Field label="Email">
            <input
              type="email"
              className="field-input"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@company.com"
            />
          </Field>
          <button type="submit" className="btn-primary" disabled={busy}>
            {busy ? 'Sending…' : 'Send reset link'}
          </button>
        </form>
      )}
    </AuthLayout>
  )
}