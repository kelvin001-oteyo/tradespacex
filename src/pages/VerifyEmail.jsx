import { useState } from 'react'
import { useLocation, Link } from 'react-router-dom'
import AuthLayout from '../components/AuthLayout'
import Stamp from '../components/Stamp'
import * as authApi from '../api/authApi'

export default function VerifyEmail() {
  const location = useLocation()
  const email = location.state?.email || ''
  const [verified, setVerified] = useState(false)
  const [busy, setBusy] = useState(false)
  const [resent, setResent] = useState(false)

  async function handleMockVerify() {
    setBusy(true)
    const res = await authApi.resendVerification({ email })
    if (res.__mockVerifyToken) {
      await authApi.verifyEmail({ token: res.__mockVerifyToken })
      setVerified(true)
    }
    setBusy(false)
  }

  async function handleResend() {
    setBusy(true)
    await authApi.resendVerification({ email })
    setResent(true)
    setBusy(false)
  }

  return (
    <AuthLayout
      docNumber="FORM 05 — EMAIL VERIFICATION"
      title={verified ? 'Email verified' : 'Check your inbox'}
      subtitle={verified ? 'Your account is fully activated.' : `We sent a verification link to ${email || 'your email'}.`}
      footer={verified && <Link to="/login" className="btn-ghost">Continue to log in</Link>}
    >
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '12px 0' }}>
        <Stamp label={verified ? 'VERIFIED' : 'PENDING'} active={verified} size={84} />

        {!verified && (
          <div style={{ marginTop: 22, width: '100%', display: 'flex', flexDirection: 'column', gap: 12 }}>
            <button className="btn-primary" onClick={handleMockVerify} disabled={busy}>
              {busy ? 'Verifying…' : '(Dev only) Simulate clicking email link'}
            </button>
            <button
              type="button"
              className="btn-ghost"
              style={{ textAlign: 'center' }}
              onClick={handleResend}
              disabled={busy}
            >
              {resent ? 'Verification email resent' : 'Resend verification email'}
            </button>
          </div>
        )}
      </div>
    </AuthLayout>
  )
}