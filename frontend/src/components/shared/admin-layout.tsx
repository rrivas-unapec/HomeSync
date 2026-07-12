import { useEffect, useState } from 'react'
import { Link, NavLink, Outlet, useLocation, useNavigate } from 'react-router'
import { toast } from 'sonner'
import { Menu, X } from 'lucide-react'
import { useAuth } from '@/app/providers/auth-context'
import { MESSAGES } from '@/lib/messages'
import { cn } from '@/lib/utils'
import { SkipLink } from './skip-link'
import { ThemeToggle } from './theme-toggle'
import { Wordmark } from './wordmark'

interface NavGroup {
  label: string
  links: { to: string; label: string }[]
}

const NAV_GROUPS: NavGroup[] = [
  {
    label: MESSAGES.admin.groupInventory,
    links: [{ to: '/admin/propiedades', label: MESSAGES.admin.properties }],
  },
  {
    label: MESSAGES.admin.groupOperation,
    links: [
      { to: '/admin/solicitudes', label: MESSAGES.admin.visitRequests },
      { to: '/admin/clientes', label: MESSAGES.admin.clients },
    ],
  },
  {
    label: MESSAGES.admin.groupAnalysis,
    links: [{ to: '/admin/reportes', label: MESSAGES.admin.reports }],
  },
  {
    label: MESSAGES.admin.groupSystem,
    links: [
      { to: '/admin/usuarios', label: MESSAGES.admin.users },
      { to: '/admin/auditoria', label: MESSAGES.admin.audit },
    ],
  },
]

function sidebarLinkClass({ isActive }: { isActive: boolean }): string {
  return cn(
    'relative block border-l-2 py-1.5 pl-4 pr-3 text-sm transition-colors duration-150 ease-out motion-reduce:transition-none',
    isActive
      ? 'border-foreground bg-muted font-medium text-foreground'
      : 'border-transparent text-muted-foreground hover:border-border-control hover:text-foreground',
  )
}

function SidebarNav({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <nav aria-label={MESSAGES.a11y.adminNav} className="flex flex-col gap-6">
      {NAV_GROUPS.map((group) => (
        <div key={group.label}>
          <p className="mb-2 pl-4 text-[10px] font-medium uppercase tracking-[0.18em] text-muted-foreground">
            {group.label}
          </p>
          <ul className="flex flex-col gap-0.5">
            {group.links.map((link) => (
              <li key={link.to}>
                <NavLink to={link.to} className={sidebarLinkClass} onClick={onNavigate}>
                  {link.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </nav>
  )
}

export function AdminLayout() {
  const { session, signOut } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    setMenuOpen(false)
  }, [location.pathname])

  function handleSignOut() {
    signOut()
    toast.success(MESSAGES.auth.signedOut)
    void navigate('/', { replace: true })
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <SkipLink />

      <header className="sticky top-0 z-40 shrink-0 border-b border-border bg-card">
        <div className="flex h-14 items-center gap-4 px-4 md:px-6">
          <button
            type="button"
            aria-label={menuOpen ? MESSAGES.admin.closeMenu : MESSAGES.admin.openMenu}
            aria-expanded={menuOpen}
            onClick={() => {
              setMenuOpen((open) => !open)
            }}
            className="flex h-8 w-8 cursor-pointer items-center justify-center text-muted-foreground transition-colors duration-150 ease-out hover:text-foreground motion-reduce:transition-none lg:hidden"
          >
            {menuOpen ? (
              <X className="h-4 w-4" aria-hidden="true" />
            ) : (
              <Menu className="h-4 w-4" aria-hidden="true" />
            )}
          </button>

          <Link to="/admin/propiedades" className="shrink-0">
            <Wordmark />
          </Link>

          <span aria-hidden="true" className="hidden h-4 w-px bg-border-control sm:block" />
          <p className="hidden text-xs font-medium uppercase tracking-widest text-muted-foreground sm:block">
            {MESSAGES.admin.panel}
          </p>

          <div className="ml-auto flex items-center gap-4">
            <ThemeToggle />

            <span aria-hidden="true" className="hidden h-4 w-px bg-border-control md:block" />

            <NavLink
              to="/"
              className="hidden text-xs font-medium uppercase tracking-widest text-muted-foreground transition-colors duration-150 ease-out hover:text-foreground motion-reduce:transition-none md:block"
            >
              {MESSAGES.admin.viewPublicSite}
            </NavLink>

            <span aria-hidden="true" className="hidden h-4 w-px bg-border-control md:block" />

            {session !== null && (
              <p className="hidden text-right text-xs leading-tight sm:block">
                <span className="block text-muted-foreground">{MESSAGES.admin.signedInAs}</span>
                <span className="block font-medium text-foreground">{session.user.nombre}</span>
              </p>
            )}

            <button
              type="button"
              onClick={handleSignOut}
              className="cursor-pointer border border-border-control px-3 py-1.5 text-xs font-medium uppercase tracking-widest text-muted-foreground transition-colors duration-150 ease-out hover:border-foreground hover:text-foreground motion-reduce:transition-none"
            >
              {MESSAGES.actions.signOut}
            </button>
          </div>
        </div>
      </header>

      <div className="flex flex-1">
        <aside className="sticky top-14 hidden h-[calc(100vh-3.5rem)] w-56 shrink-0 overflow-y-auto border-r border-border bg-card py-6 lg:block">
          <SidebarNav />
        </aside>

        {menuOpen && (
          <div className="fixed inset-0 z-30 lg:hidden">
            <button
              type="button"
              aria-label={MESSAGES.admin.closeMenu}
              onClick={() => {
                setMenuOpen(false)
              }}
              className="absolute inset-0 cursor-default bg-overlay"
            />
            <aside className="dialog-content absolute left-0 top-14 h-[calc(100vh-3.5rem)] w-64 overflow-y-auto border-r border-border bg-card py-6">
              <SidebarNav
                onNavigate={() => {
                  setMenuOpen(false)
                }}
              />
              <div className="mt-6 border-t border-border pt-6">
                <NavLink
                  to="/"
                  className="block pl-4 text-sm text-muted-foreground transition-colors duration-150 ease-out hover:text-foreground motion-reduce:transition-none"
                >
                  {MESSAGES.admin.viewPublicSite}
                </NavLink>
              </div>
            </aside>
          </div>
        )}

        <main id="contenido" className="min-w-0 flex-1">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
