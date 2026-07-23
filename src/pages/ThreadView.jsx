import { useEffect, useRef, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import { useAuth } from '../context/AuthContext'
import * as communicationApi from '../api/communicationApi'

export default function ThreadView() {
  const { id } = useParams()
  const { user } = useAuth()
  const [thread, setThread] = useState(null)
  const [body, setBody] = useState('')
  const [sending, setSending] = useState(false)
  const bottomRef = useRef(null)

  async function load() {
    const t = await communicationApi.getThread(id)
    setThread(t)
    await communicationApi.markThreadRead(id, user.email)
  }

  useEffect(() => {
    if (user?.email) load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, user])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [thread?.messages?.length])

  async function handleSend(e) {
    e.preventDefault()
    if (!body.trim()) return
    setSending(true)
    await communicationApi.sendMessage(id, { sender: user.email, body: body.trim() })
    setBody('')
    await load()
    setSending(false)
  }

  if (!thread) {
    return (
      <div style={{ minHeight: '100vh' }}>
        <Navbar />
        <div className="container-md" style={{ paddingTop: 40 }}>
          <p className="font-mono" style={{ fontSize: 12, letterSpacing: '0.14em', color: 'var(--slate)' }}>LOADING…</p>
        </div>
      </div>
    )
  }

  const otherEmail = thread.participants.find((p) => p !== user.email)
  const otherName = thread.participantNames[otherEmail] || otherEmail

  return (
    <div style={{ minHeight: '100vh' }}>
      <Navbar />
      <div className="container-md" style={{ paddingTop: 40, paddingBottom: 40 }}>
        <Link to="/messages" className="btn-ghost" style={{ marginBottom: 20, display: 'inline-block' }}>← Back to messages</Link>

        <div className="ledger-card" style={{ padding: 24 }}>
          <div style={{ marginBottom: 20 }}>
            <p className="doc-number" style={{ marginBottom: 4 }}>THREAD — {thread.id.toUpperCase()}</p>
            <h1 className="font-display" style={{ fontSize: 22, margin: 0 }}>{otherName}</h1>
            {thread.listingTitle && (
              <p style={{ fontSize: 13, color: 'var(--slate)', marginTop: 4 }}>Re: {thread.listingTitle}</p>
            )}
          </div>

          <div style={{ minHeight: 200, maxHeight: 420, overflowY: 'auto', paddingRight: 4 }}>
            {thread.messages.length === 0 ? (
              <p style={{ fontSize: 13.5, color: 'var(--slate)' }}>No messages yet — say hello.</p>
            ) : (
              thread.messages.map((m) => {
                const mine = m.sender === user.email
                return (
                  <div key={m.id} style={{ display: 'flex', flexDirection: 'column', alignItems: mine ? 'flex-end' : 'flex-start' }}>
                    <div className={`message-bubble ${mine ? 'mine' : 'theirs'}`}>{m.body}</div>
                    <span className="message-meta">
                      {new Date(m.sentAt).toLocaleString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                )
              })
            )}
            <div ref={bottomRef} />
          </div>

          <form onSubmit={handleSend} className="chat-input-row">
            <input
              className="field-input"
              placeholder="Type a message…"
              value={body}
              onChange={(e) => setBody(e.target.value)}
            />
            <button type="submit" className="btn-primary" style={{ width: 'auto', padding: '10px 22px' }} disabled={sending}>
              {sending ? '…' : 'Send'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}