import { Link, NavLink, Outlet, useNavigate } from 'react-router'
import { toast } from 'sonner'
import { useAuth } from '@/app/providers/auth-context'
import { MESSAGES } from '@/lib/messages'
import { cn } from '@/lib/utils'
import { SkipLink } from './skip-link'
import { Wordmark } from './wordmark'

const LINK_CLASS =
  'text-xs font-medium uppercase tracking-widest transition-colors duration-150 ease-out motion-reduce:transition-none'

function navLinkClass({ isActive }: { isActive: boolean }): string {
  return cn(
    LINK_CLASS,
    isActive ? 'text-foreground' : 'text-muted-foreground hover:text-foreground',
  )
}

export function PublicLayout() {
  const { isAuthenticated, isAdmin, signOut } = useAuth()
  const navigate = useNavigate()

  function handleSignOut() {
    signOut()
    toast.success(MESSAGES.auth.signedOut)
    void navigate('/', { replace: true })
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <SkipLink />

      <header className="sticky top-0 z-40 shrink-0 border-b border-border bg-card">
        <div className="mx-auto flex h-14 max-w-7xl items-center gap-8 px-6 md:px-8">
          <Link to="/" className="shrink-0">
            <Wordmark />
          </Link>

          <nav aria-label={MESSAGES.a11y.mainNav} className="flex items-center gap-6">
            <NavLink to="/" end className={navLinkClass}>
              {MESSAGES.publicNav.catalog}
            </NavLink>
          </nav>

          <div className="ml-auto flex items-center gap-5">
            {isAdmin && (
              <NavLink to="/admin/propiedades" className={navLinkClass}>
                {MESSAGES.publicNav.adminPanel}
              </NavLink>
            )}
            {isAuthenticated ? (
              <button
                type="button"
                onClick={handleSignOut}
                className={cn(
                  LINK_CLASS,
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
      </header>

      <main id="contenido" className="flex-1">
        <div className="mx-auto max-w-7xl">
          <Outlet />
        </div>
      </main>

      <footer className="shrink-0 border-t border-border bg-card">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-2 px-6 py-6 md:px-8">
          <p className="text-xs uppercase tracking-widest text-muted-foreground">
            {MESSAGES.app.name}
          </p>
          <p className="text-xs text-muted-foreground">{MESSAGES.publicNav.footer}</p>
        </div>
      </footer>
    </div>
  )
}
