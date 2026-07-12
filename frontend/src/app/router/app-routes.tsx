import { lazy, Suspense } from 'react'
import { Route, Routes } from 'react-router'
import { AppLayout } from '@/components/shared/app-layout'
import { ForbiddenPage, NotFoundPage } from '@/components/shared/status-pages'
import { Skeleton } from '@/components/ui/skeleton'
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
      <Skeleton className="h-64 w-full" />
    </div>
  )
}

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/registro" element={<RegisterPage />} />

      <Route element={<AppLayout />}>
        <Route index element={<CatalogPage />} />
        <Route path="propiedades/:id" element={<PropertyDetailPage />} />
        <Route path="403" element={<ForbiddenPage />} />

        <Route element={<RequireAuth />}>
          <Route element={<RequireRole role="administrador" />}>
            <Route
              path="admin/propiedades"
              element={
                <Suspense fallback={<RouteFallback />}>
                  <AdminPropertiesPage />
                </Suspense>
              }
            />
            <Route
              path="admin/solicitudes"
              element={
                <Suspense fallback={<RouteFallback />}>
                  <AdminVisitRequestsPage />
                </Suspense>
              }
            />
            <Route
              path="admin/clientes"
              element={
                <Suspense fallback={<RouteFallback />}>
                  <AdminClientsPage />
                </Suspense>
              }
            />
            <Route
              path="admin/usuarios"
              element={
                <Suspense fallback={<RouteFallback />}>
                  <AdminUsersPage />
                </Suspense>
              }
            />
            <Route
              path="admin/auditoria"
              element={
                <Suspense fallback={<RouteFallback />}>
                  <AdminAuditPage />
                </Suspense>
              }
            />
            <Route
              path="admin/reportes"
              element={
                <Suspense fallback={<RouteFallback />}>
                  <ReportsPage />
                </Suspense>
              }
            />
          </Route>
        </Route>

        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  )
}
