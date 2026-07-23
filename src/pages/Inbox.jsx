import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import { useAuth } from '../context/AuthContext'
import * as communicationApi from '../api/communicationApi'

export default function Inbox() {
  const { user } = useAuth()
  const [threads, setThreads] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user?.email) {
      communicationApi.getThreads(user.email).then((t) => {
        setThreads(t)
        setLoading(false)
      })
    }
  }, [user])

  function otherParty(thread) {
    const otherEmail = thread.participants.find((p) => p !== user.email)
    return thread.participantNames[otherEmail] || otherEmail
  }

  return (
    <div style={{ minHeight: '100vh' }}>
      <Navbar />
      <div className="container-md" style={{ paddingTop: 40, paddingBottom: 40 }}>
        <p className="doc-number" style={{ marginBottom: 4 }}>CORRESPONDENCE LOG</p>
        <h1 className="font-display" style={{ fontSize: 28, margin: '0 0 24px' }}>Messages</h1>

        {loading ? (
          <p className="font-mono" style={{ fontSize: 12, letterSpacing: '0.14em', color: 'var(--slate)' }}>LOADING…</p>
        ) : threads.length === 0 ? (
          <div className="ledger-card" style={{ padding: 32, textAlign: 'center' }}>
            <p style={{ fontSize: 14, color: 'var(--slate)' }}>No conversations yet.</p>
            <Link to="/marketplace" className="btn-ghost" style={{ marginTop: 12, display: 'inline-block' }}>Browse the marketplace</Link>
          </div>
        ) : (
          <div className="ledger-card" style={{ padding: 0 }}>
            {threads.map((t) => (
              <Link key={t.id} to={`/messages/${t.id}`} className="thread-list-item">
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div>
                    <p style={{ fontSize: 15, fontWeight: 600, margin: 0 }}>{otherParty(t)}</p>
                    {t.listingTitle && (
                      <p className="font-mono" style={{ fontSize: 11, color: 'var(--slate)', marginTop: 2 }}>
                        Re: {t.listingTitle}
                      </p>
                    )}
                  </div>
                  {t.unreadCount > 0 && <span className="unread-badge">{t.unreadCount}</span>}
                </div>
                <p style={{ fontSize: 13, color: 'var(--slate)', marginTop: 6, marginBottom: 0 }}>
                  {t.lastMessage ? t.lastMessage.body.slice(0, 80) : 'No messages yet'}
                </p>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}