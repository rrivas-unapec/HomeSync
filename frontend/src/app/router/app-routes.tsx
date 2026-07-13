import { lazy, Suspense } from 'react'
import { Route, Routes } from 'react-router'
import { AdminLayout } from '@/components/shared/admin-layout'
import { PublicLayout } from '@/components/shared/public-layout'
import { ForbiddenPage, NotFoundPage } from '@/components/shared/status-pages'
import { TableSkeleton } from '@/components/ui/table'
import { LoginPage } from '@/features/auth/pages/login-page'
import { RegisterPage } from '@/features/auth/pages/register-page'
import { CatalogPage } from '@/features/properties/pages/catalog-page'
import { PropertyDetailPage } from '@/features/properties/pages/property-detail-page'
import { RequireAuth, RequireRole } from './guards'

const AdminPropertiesPage = lazy(() =>
  import('@/features/properties/pages/admin-properties-page').then((module) => ({
    default: module.AdminPropertiesPage,
  })),
)
const AdminVisitRequestsPage = lazy(() =>
  import('@/features/visit-requests/pages/admin-visit-requests-page').then((module) => ({
    default: module.AdminVisitRequestsPage,
  })),
)
const AdminClientsPage = lazy(() =>
  import('@/features/clients/pages/admin-clients-page').then((module) => ({
    default: module.AdminClientsPage,
  })),
)
const AdminUsersPage = lazy(() =>
  import('@/features/users/pages/admin-users-page').then((module) => ({
    default: module.AdminUsersPage,
  })),
)
const AdminAuditPage = lazy(() =>
  import('@/features/audit/pages/admin-audit-page').then((module) => ({
    default: module.AdminAuditPage,
  })),
)
const ReportsPage = lazy(() =>
  import('@/features/reports/pages/reports-page').then((module) => ({
    default: module.ReportsPage,
  })),
)

function RouteFallback() {
  return (
    <div className="px-6 py-8 md:px-8">
      <TableSkeleton columns={5} />
    </div>
  )
}

function lazyRoute(element: React.ReactNode) {
  return <Suspense fallback={<RouteFallback />}>{element}</Suspense>
}

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/registro" element={<RegisterPage />} />

      <Route element={<PublicLayout />}>
        <Route index element={<CatalogPage />} />
        <Route path="propiedades/:id" element={<PropertyDetailPage />} />
        <Route path="403" element={<ForbiddenPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>

      <Route element={<RequireAuth />}>
        <Route element={<RequireRole role="administrador" />}>
          <Route path="/admin" element={<AdminLayout />}>
            <Route path="propiedades" element={lazyRoute(<AdminPropertiesPage />)} />
            <Route path="solicitudes" element={lazyRoute(<AdminVisitRequestsPage />)} />
            <Route path="clientes" element={lazyRoute(<AdminClientsPage />)} />
            <Route path="usuarios" element={lazyRoute(<AdminUsersPage />)} />
            <Route path="auditoria" element={lazyRoute(<AdminAuditPage />)} />
            <Route path="reportes" element={lazyRoute(<ReportsPage />)} />
          </Route>
        </Route>
      </Route>
    </Routes>
  )
}
