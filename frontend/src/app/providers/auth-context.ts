import { createContext, useContext } from 'react'
import type { Session } from '@/features/auth/lib/session-storage'

export interface AuthContextValue {
  session: Session | null
  isAuthenticated: boolean
  isAdmin: boolean
  signIn: (session: Session) => void
  signOut: () => void
}

export const AuthContext = createContext<AuthContextValue | null>(null)

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext)
  if (context === null) {
    throw new Error('useAuth debe usarse dentro de AuthProvider.')
  }
  return context
}
