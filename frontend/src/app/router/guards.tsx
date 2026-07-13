import { Navigate, Outlet, useLocation } from 'react-router'
import { useAuth } from '@/app/providers/auth-context'
import type { Role } from '@/lib/domain'

export function RequireAuth() {
  const { isAuthenticated } = useAuth()
  const location = useLocation()

  if (!isAuthenticated) {
    const returnUrl = `${location.pathname}${location.search}`
    return <Navigate to={`/login?returnUrl=${encodeURIComponent(returnUrl)}`} replace />
  }

  return <Outlet />
}

export function RequireRole({ role }: { role: Role }) {
  const { session } = useAuth()

  if (session === null) {
    return <Navigate to="/login" replace />
  }

  if (session.user.rol !== role) {
    return <Navigate to="/403" replace />
  }

  return <Outlet />
}
