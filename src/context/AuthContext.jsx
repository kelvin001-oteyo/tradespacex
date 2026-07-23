import { createContext, useContext, useEffect, useState, useCallback } from 'react'
import * as authApi from '../api/authApi'

const AuthContext = createContext(null)
const SESSION_KEY = 'tsx_mock_session'

export function AuthProvider({ children }) {
  const [session, setSession] = useState(() => {
    const raw = localStorage.getItem(SESSION_KEY)
    return raw ? JSON.parse(raw) : null
  })
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  const persist = (next) => {
    setSession(next)
    if (next) localStorage.setItem(SESSION_KEY, JSON.stringify(next))
    else localStorage.removeItem(SESSION_KEY)
  }

  const refreshMe = useCallback(async (access) => {
    try {
      const me = await authApi.getMe({ access })
      setUser(me)
      return me
    } catch {
      persist(null)
      setUser(null)
      return null
    }
  }, [])

  useEffect(() => {
    ;(async () => {
      if (session?.access) await refreshMe(session.access)
      setLoading(false)
    })()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  async function doLogin(email, password) {
    const result = await authApi.login({ email, password })
    persist({ access: result.access, refresh: result.refresh })
    setUser(result.user)
    return result.user
  }

  async function doLogout() {
    if (session?.refresh) await authApi.logout({ refresh: session.refresh })
    persist(null)
    setUser(null)
  }

  return (
    <AuthContext.Provider
      value={{ session, user, setUser, loading, login: doLogin, logout: doLogout, refreshMe }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}