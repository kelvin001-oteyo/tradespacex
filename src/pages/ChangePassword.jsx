import { useState } from 'react'
import Navbar from '../components/Navbar'
import Field from '../components/Field'
import { useAuth } from '../context/AuthContext'
import * as authApi from '../api/authApi'

export default function ChangePassword() {
  const { session } = useAuth()
  const [form, setForm] = useState({ currentPassword: '', newPassword: '' })
  const [error, setError] = useState('')
  const [done, setDone] = useState(false)
  const [busy, setBusy] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setBusy(true)
    try {
      await authApi.changePassword({ access: session.access, ...form })
      setDone(true)
      setForm({ currentPassword: '', newPassword: '' })
    } catch (err) {
      setError(err.body?.currentPassword?.[0] || 'Could not update password.')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div style={{ minHeight: '100vh' }}>
      <Navbar />
      <div className="container-sm" style={{ margin: '0 auto', paddingTop: 40, paddingBottom: 40 }}>
        <p className="doc-number" style={{ marginBottom: 4 }}>FORM 07 — PASSWORD CHANGE</p>
        <h1 className="font-display" style={{ fontSize: 26, margin: '0 0 24px' }}>Change password</h1>

        <form onSubmit={handleSubmit} className="ledger-card" style={{ padding: 30 }}>
          <Field label="Current password">
            <input
              type="password"
              className="field-input"
              required
              value={form.currentPassword}
              onChange={(e) => setForm((f) => ({ ...f, currentPassword: e.target.value }))}
            />
          </Field>
          <Field label="New password">
            <input
              type="password"
              className="field-input"
              required
              minLength={8}
              value={form.newPassword}
              onChange={(e) => setForm((f) => ({ ...f, newPassword: e.target.value }))}
            />
          </Field>
          {error && <p className="text-error" style={{ marginBottom: 14 }}>{error}</p>}
          <button type="submit" className="btn-primary" disabled={busy}>
            {busy ? 'Updating…' : 'Update password'}
          </button>
          {done && <p className="text-success" style={{ marginTop: 12 }}>Password updated.</p>}
        </form>
      </div>
    </div>
  )
}