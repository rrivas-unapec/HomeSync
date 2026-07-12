import { useCallback, useEffect, useMemo, useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { authEvents } from '@/lib/auth-events'
import {
  clearSession,
  expiresAtMs,
  isExpired,
  readSession,
  writeSession,
  type Session,
} from '@/features/auth/lib/session-storage'
import { AuthContext, type AuthContextValue } from './auth-context'

const STORAGE_KEY = 'homesync.session'
const MAX_TIMEOUT_MS = 2_147_483_647

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const queryClient = useQueryClient()
  const [session, setSession] = useState<Session | null>(() => readSession())

  const signOut = useCallback(() => {
    clearSession()
    setSession(null)
    queryClient.clear()
  }, [queryClient])

  const signIn = useCallback((next: Session) => {
    writeSession(next)
    setSession(next)
  }, [])

  useEffect(() => authEvents.onUnauthorized(signOut), [signOut])

  useEffect(() => {
    if (session === null) return

    const remaining = expiresAtMs(session) - Date.now()

    if (Number.isNaN(remaining) || remaining <= 0) {
      signOut()
      return
    }

    const timer = window.setTimeout(signOut, Math.min(remaining, MAX_TIMEOUT_MS))
    return () => {
      window.clearTimeout(timer)
    }
  }, [session, signOut])

  useEffect(() => {
    function handleStorage(event: StorageEvent) {
      if (event.key !== STORAGE_KEY && event.key !== null) return
      const next = readSession()
      setSession(next)
      if (next === null) queryClient.clear()
    }

    window.addEventListener('storage', handleStorage)
    return () => {
      window.removeEventListener('storage', handleStorage)
    }
  }, [queryClient])

  const value = useMemo<AuthContextValue>(() => {
    const active = session !== null && !isExpired(session) ? session : null
    return {
      session: active,
      isAuthenticated: active !== null,
      isAdmin: active?.user.rol === 'administrador',
      signIn,
      signOut,
    }
  }, [session, signIn, signOut])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
