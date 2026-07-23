import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import * as communicationApi from '../api/communicationApi'

export default function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [unread, setUnread] = useState(0)

  useEffect(() => {
    if (user?.email) {
      communicationApi.getThreads(user.email).then((threads) => {
        setUnread(threads.reduce((sum, t) => sum + t.unreadCount, 0))
      })
    }
  }, [user])

  async function handleLogout() {
    await logout()
    navigate('/login')
  }

  return (
    <nav style={{ borderBottom: '1px solid rgba(18,33,63,0.1)', background: 'rgba(246,243,236,0.95)', position: 'sticky', top: 0, zIndex: 10 }}>
      <div className="container-md" style={{ height: 56, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
          <Link to="/dashboard" className="font-display" style={{ fontSize: 17, fontWeight: 600, textDecoration: 'none' }}>
            TradespaceX
          </Link>
          <div className="nav-links">
            <Link to="/marketplace">Marketplace</Link>
            <Link to="/marketplace/my-listings">My Listings</Link>
            <Link to="/marketplace/favorites">Saved</Link>
            <Link to="/messages" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              Messages {unread > 0 && <span className="unread-badge">{unread}</span>}
            </Link>
            <Link to="/quotes">Quotes</Link>
            <Link to="/orders">Orders</Link>
            <Link to="/orders">Orders</Link>
            <Link to="/payments/transactions">Payments</Link>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <span className="font-mono" style={{ fontSize: 12, color: 'var(--slate)' }}>{user?.email}</span>
          <button onClick={handleLogout} className="btn-ghost">Log out</button>
        </div>
      </div>
    </nav>
  )
}