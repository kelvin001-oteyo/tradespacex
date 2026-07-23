import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Stamp from '../components/Stamp'
import { useAuth } from '../context/AuthContext'
import * as marketplaceApi from '../api/marketplaceApi'
import * as communicationApi from '../api/communicationApi'
import * as ordersApi from '../api/ordersApi'
import * as paymentsApi from '../api/paymentsApi'

function SummaryCard({ label, value, sub, to }) {
  const content = (
    <div className="ledger-card" style={{ padding: 20, height: '100%' }}>
      <p className="field-label" style={{ marginBottom: 8 }}>{label}</p>
      <p className="font-display" style={{ fontSize: 30, margin: 0 }}>{value}</p>
      {sub && <p style={{ fontSize: 12.5, color: 'var(--slate)', marginTop: 6 }}>{sub}</p>}
    </div>
  )
  return to ? <Link to={to} style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}>{content}</Link> : content
}

export default function Dashboard() {
  const { user } = useAuth()
  const [stats, setStats] = useState(null)

  useEffect(() => {
    if (!user?.email) return
    ;(async () => {
      const [myListings, orders, quotes, threads, transactions] = await Promise.all([
        marketplaceApi.getMyListings(user.email),
        ordersApi.getOrders(user.email),
        communicationApi.getQuotes(user.email),
        communicationApi.getThreads(user.email),
        paymentsApi.getTransactions(user.email),
      ])

      const activeOrders = orders.filter((o) => !['delivered', 'cancelled'].includes(o.status))
      const pendingQuotes = quotes.filter((q) => q.status === 'pending' && q.sellerEmail === user.email)
      const unreadMessages = threads.reduce((sum, t) => sum + t.unreadCount, 0)
      const totalSpent = transactions.reduce((sum, t) => sum + t.amount, 0)

      setStats({
        listingCount: myListings.length,
        activeOrders: activeOrders.length,
        totalOrders: orders.length,
        pendingQuotes: pendingQuotes.length,
        unreadMessages,
        transactionCount: transactions.length,
        totalSpent,
        recentOrders: orders.slice(0, 3),
      })
    })()
  }, [user])

  return (
    <div style={{ minHeight: '100vh' }}>
      <Navbar />
      <div className="container-md" style={{ paddingTop: 40, paddingBottom: 40 }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 32 }}>
          <div>
            <p className="doc-number" style={{ marginBottom: 4 }}>BUSINESS OVERVIEW</p>
            <h1 className="font-display" style={{ fontSize: 28, margin: 0 }}>{user?.fullName || 'Welcome'}</h1>
            <p style={{ fontSize: 13.5, color: 'var(--slate)', marginTop: 4, textTransform: 'capitalize' }}>
              {user?.accountType} account · {user?.email}
            </p>
          </div>
          <Stamp label={user?.isEmailVerified ? 'VERIFIED' : 'UNVERIFIED'} active={!!user?.isEmailVerified} />
        </div>

        {!stats ? (
          <p className="font-mono" style={{ fontSize: 12, letterSpacing: '0.14em', color: 'var(--slate)' }}>LOADING…</p>
        ) : (
          <>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 14, marginBottom: 14 }}>
              <SummaryCard label="Active orders" value={stats.activeOrders} sub={`${stats.totalOrders} total`} to="/orders" />
              <SummaryCard label="My listings" value={stats.listingCount} to="/marketplace/my-listings" />
              <SummaryCard label="Pending quotes" value={stats.pendingQuotes} sub="awaiting your response" to="/quotes" />
              <SummaryCard label="Unread messages" value={stats.unreadMessages} to="/messages" />
            </div>

            <div className="ledger-card" style={{ padding: 20, marginBottom: 24 }}>
              <p className="field-label" style={{ marginBottom: 8 }}>Total paid out</p>
              <p className="font-mono" style={{ fontSize: 22 }}>${stats.totalSpent.toLocaleString()}</p>
              <p style={{ fontSize: 12.5, color: 'var(--slate)', marginTop: 4 }}>{stats.transactionCount} transaction{stats.transactionCount !== 1 ? 's' : ''} · <Link to="/payments/transactions" style={{ color: 'var(--slate)' }}>view history</Link></p>
            </div>

            <h2 className="font-display" style={{ fontSize: 19, margin: '0 0 14px' }}>Recent orders</h2>
            {stats.recentOrders.length === 0 ? (
              <p style={{ fontSize: 14, color: 'var(--slate)', marginBottom: 24 }}>No orders yet.</p>
            ) : (
              <div className="ledger-card" style={{ padding: 0, marginBottom: 24 }}>
                {stats.recentOrders.map((o) => (
                  <Link key={o.id} to={`/orders/${o.id}`} className="transaction-row">
                    <div>
                      <p style={{ fontSize: 14, fontWeight: 500, margin: 0 }}>{o.listingTitle}</p>
                      <p className="font-mono" style={{ fontSize: 11, color: 'var(--slate)', marginTop: 2 }}>{o.id.toUpperCase()}</p>
                    </div>
                    <span className={`status-badge ${o.status}`}>{o.status}</span>
                  </Link>
                ))}
              </div>
            )}

            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              <Link to="/marketplace" className="btn-ghost">Browse marketplace</Link>
              <span style={{ color: 'rgba(18,33,63,0.2)' }}>·</span>
              <Link to="/profile" className="btn-ghost">Edit profile</Link>
              <span style={{ color: 'rgba(18,33,63,0.2)' }}>·</span>
              <Link to="/change-password" className="btn-ghost">Change password</Link>
            </div>
          </>
        )}
      </div>
    </div>
  )
}