import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import AuthLayout from '../components/AuthLayout'
import Field from '../components/Field'
import * as authApi from '../api/authApi'

export default function Register() {
  const navigate = useNavigate()
  const [accountType, setAccountType] = useState('business')
  const [form, setForm] = useState({ fullName: '', email: '', password: '' })
  const [errors, setErrors] = useState({})
  const [busy, setBusy] = useState(false)

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setErrors({})
    setBusy(true)
    try {
      await authApi.register({ ...form, accountType })
      navigate('/verify-email', { state: { email: form.email } })
    } catch (err) {
      setErrors(err.body || { detail: 'Something went wrong.' })
    } finally {
      setBusy(false)
    }
  }

  return (
    <AuthLayout
      docNumber="FORM 01 — REGISTRATION"
      title="Create your account"
      subtitle="Join the trade operating system for global commerce."
      footer={<>Already registered? <Link to="/login" className="btn-ghost">Log in</Link></>}
    >
      <div style={{ display: 'flex', marginBottom: 22, border: '1px solid rgba(18,33,63,0.2)' }}>
        {['business', 'individual'].map((type) => (
          <button
            key={type}
            type="button"
            onClick={() => setAccountType(type)}
            className="font-mono"
            style={{
              flex: 1,
              padding: '8px 0',
              fontSize: 12,
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              border: 'none',
              cursor: 'pointer',
              background: accountType === type ? 'var(--ink)' : 'transparent',
              color: accountType === type ? 'var(--paper)' : 'rgba(51,71,79,0.7)',
            }}
          >
            {type}
          </button>
        ))}
      </div>

      <form onSubmit={handleSubmit} noValidate>
        <Field label={accountType === 'business' ? 'Business name' : 'Full name'} error={errors.fullName?.[0]}>
          <input
            className="field-input"
            required
            value={form.fullName}
            onChange={(e) => update('fullName', e.target.value)}
            placeholder={accountType === 'business' ? 'Acme Trading Co.' : 'Jane Doe'}
          />
        </Field>

        <Field label="Email" error={errors.email?.[0]}>
          <input
            type="email"
            className="field-input"
            required
            value={form.email}
            onChange={(e) => update('email', e.target.value)}
            placeholder="you@company.com"
          />
        </Field>

        <Field label="Password" error={errors.password?.[0]}>
          <input
            type="password"
            className="field-input"
            required
            minLength={8}
            value={form.password}
            onChange={(e) => update('password', e.target.value)}
            placeholder="At least 8 characters"
          />
        </Field>

        {errors.detail && <p className="text-error" style={{ marginBottom: 14 }}>{errors.detail}</p>}

        <button type="submit" className="btn-primary" disabled={busy}>
          {busy ? 'Creating account…' : 'Create account'}
        </button>
      </form>
    </AuthLayout>
  )
}