import { NavLink, Outlet, useNavigate } from 'react-router'
import { toast } from 'sonner'
import { useAuth } from '@/app/providers/auth-context'
import { MESSAGES } from '@/lib/messages'
import { cn } from '@/lib/utils'

const ADMIN_LINKS = [
  { to: '/admin/propiedades', label: MESSAGES.admin.properties },
  { to: '/admin/solicitudes', label: MESSAGES.admin.visitRequests },
  { to: '/admin/clientes', label: MESSAGES.admin.clients },
  { to: '/admin/usuarios', label: MESSAGES.admin.users },
  { to: '/admin/reportes', label: MESSAGES.admin.reports },
  { to: '/admin/auditoria', label: MESSAGES.admin.audit },
] as const

const NAV_LINK_CLASS =
  'text-xs uppercase tracking-wide font-medium transition-colors duration-150 ease-out motion-reduce:transition-none'

function navLinkClass({ isActive }: { isActive: boolean }): string {
  return cn(
    NAV_LINK_CLASS,
    isActive ? 'text-foreground' : 'text-muted-foreground hover:text-foreground',
  )
}

export function AppLayout() {
  const { isAuthenticated, isAdmin, signOut } = useAuth()
  const navigate = useNavigate()

  function handleSignOut() {
    signOut()
    toast.success(MESSAGES.auth.signedOut)
    void navigate('/', { replace: true })
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <a
        href="#contenido"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:border focus:border-foreground focus:bg-card focus:px-4 focus:py-2 focus:text-xs focus:uppercase focus:tracking-wide"
      >
        {MESSAGES.a11y.mainContent}
      </a>

      <header className="shrink-0 border-b border-border bg-card">
        <div className="flex h-12 flex-wrap items-center gap-x-6 gap-y-2 px-6 md:px-8">
          <NavLink
            to="/"
            className="mr-2 text-xs font-semibold uppercase tracking-widest text-foreground"
          >
            {MESSAGES.app.name}
          </NavLink>

          <nav aria-label={MESSAGES.a11y.mainNav} className="flex items-center gap-6">
            <NavLink to="/" end className={navLinkClass}>
              {MESSAGES.admin.catalog}
            </NavLink>
          </nav>

          <div className="ml-auto flex items-center gap-5">
            {isAuthenticated ? (
              <button
                type="button"
                onClick={handleSignOut}
                className={cn(
                  NAV_LINK_CLASS,
                  'cursor-pointer text-muted-foreground hover:text-foreground',
                )}
              >
                {MESSAGES.actions.signOut}
              </button>
            ) : (
              <NavLink to="/login" className={navLinkClass}>
                {MESSAGES.actions.signIn}
              </NavLink>
            )}
          </div>
        </div>

        {isAdmin && (
          <nav
            aria-label={MESSAGES.a11y.adminNav}
            className="flex flex-wrap items-center gap-x-6 gap-y-2 border-t border-border px-6 py-2.5 md:px-8"
          >
            {ADMIN_LINKS.map((link) => (
              <NavLink key={link.to} to={link.to} className={navLinkClass}>
                {link.label}
              </NavLink>
            ))}
          </nav>
        )}
      </header>

      <main id="contenido" className="flex-1">
        <Outlet />
      </main>
    </div>
  )
}
