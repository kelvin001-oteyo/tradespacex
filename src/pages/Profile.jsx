import { useState } from 'react'
import Navbar from '../components/Navbar'
import Field from '../components/Field'
import { useAuth } from '../context/AuthContext'
import * as authApi from '../api/authApi'

export default function Profile() {
  const { session, user, setUser } = useAuth()
  const [fullName, setFullName] = useState(user?.fullName || '')
  const [saved, setSaved] = useState(false)
  const [busy, setBusy] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setBusy(true)
    setSaved(false)
    const updated = await authApi.updateProfile({ access: session.access, updates: { fullName } })
    setUser(updated)
    setSaved(true)
    setBusy(false)
  }

  return (
    <div style={{ minHeight: '100vh' }}>
      <Navbar />
      <div className="container-sm" style={{ margin: '0 auto', paddingTop: 40, paddingBottom: 40 }}>
        <p className="doc-number" style={{ marginBottom: 4 }}>FORM 06 — PROFILE UPDATE</p>
        <h1 className="font-display" style={{ fontSize: 26, margin: '0 0 24px' }}>Edit profile</h1>

        <form onSubmit={handleSubmit} className="ledger-card" style={{ padding: 30 }}>
          <Field label={user?.accountType === 'business' ? 'Business name' : 'Full name'}>
            <input className="field-input" value={fullName} onChange={(e) => setFullName(e.target.value)} />
          </Field>
          <Field label="Email">
            <input className="field-input" style={{ opacity: 0.5 }} value={user?.email || ''} disabled />
          </Field>
          <button type="submit" className="btn-primary" disabled={busy}>
            {busy ? 'Saving…' : 'Save changes'}
          </button>
          {saved && <p className="text-success" style={{ marginTop: 12 }}>Profile updated.</p>}
        </form>
      </div>
    </div>
  )
}