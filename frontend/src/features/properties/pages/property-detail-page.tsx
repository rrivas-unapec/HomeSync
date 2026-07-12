import { useState } from 'react'
import { Link, useParams } from 'react-router'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { ErrorState } from '@/components/shared/states'
import { NotFoundPage } from '@/components/shared/status-pages'
import { PROPERTY_STATE_LABELS, PROPERTY_TYPE_LABELS } from '@/lib/domain'
import { formatCurrency } from '@/lib/format'
import { MESSAGES } from '@/lib/messages'
import { isApiError } from '@/lib/api-error'
import { VisitRequestDialog } from '@/features/visit-requests/components/visit-request-dialog'
import { useProperty } from '../hooks/use-properties'
import type { Property } from '../types/property'

export function PropertyDetailPage() {
  const params = useParams<{ id: string }>()
  const id = Number(params.id)
  const isValidId = Number.isInteger(id) && id > 0
  const query = useProperty(id)
  const [scheduling, setScheduling] = useState<Property | null>(null)

  if (!isValidId) {
    return <NotFoundPage />
  }

  if (query.isPending) {
    return (
      <div className="mx-auto max-w-5xl px-6 py-8 md:px-8">
        <Skeleton className="aspect-[16/9] w-full" />
        <div className="mt-6 flex flex-col gap-4">
          <Skeleton className="h-6 w-2/3" />
          <Skeleton className="h-8 w-40" />
          <Skeleton className="h-20 w-full" />
        </div>
      </div>
    )
  }

  if (query.isError) {
    if (isApiError(query.error) && query.error.status === 404) {
      return <NotFoundPage />
    }
    return (
      <div className="mx-auto max-w-5xl px-6 py-8 md:px-8">
        <ErrorState
          message={MESSAGES.property.error}
          onRetry={() => {
            void query.refetch()
          }}
        />
      </div>
    )
  }

  const property = query.data
  const canSchedule = property.estado === 'disponible'

  return (
    <div className="mx-auto max-w-5xl px-6 py-8 md:px-8">
      <Link
        to="/"
        className="mb-6 inline-block text-xs font-medium uppercase tracking-wide text-muted-foreground underline-offset-2 transition-colors duration-150 ease-out hover:text-foreground motion-reduce:transition-none"
      >
        {MESSAGES.actions.backToCatalog}
      </Link>

      <div className="border border-border bg-card">
        <div className="aspect-[16/9] overflow-hidden bg-muted">
          {property.fotoUrl !== null ? (
            <img
              src={property.fotoUrl}
              alt={MESSAGES.catalog.photoAlt(property.titulo)}
              width={1280}
              height={720}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center">
              <span className="text-xs uppercase tracking-widest text-muted-foreground">
                {MESSAGES.catalog.noPhoto}
              </span>
            </div>
          )}
        </div>

        <div className="flex flex-col gap-6 px-6 py-6 md:px-8 md:py-8">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="min-w-0">
              <div className="mb-3 flex flex-wrap items-center gap-2">
                <Badge>{PROPERTY_TYPE_LABELS[property.tipo]}</Badge>
                {property.estado !== 'disponible' && (
                  <Badge tone="outline">{PROPERTY_STATE_LABELS[property.estado]}</Badge>
                )}
              </div>
              <h1 className="text-2xl font-semibold leading-tight text-foreground text-balance">
                {property.titulo}
              </h1>
              <p className="mt-1 text-sm text-muted-foreground">{property.ubicacionZona}</p>
            </div>

            <p className="text-2xl font-semibold tabular-nums text-foreground">
              {formatCurrency(property.precio)}
            </p>
          </div>

          <div className="border-t border-border pt-6">
            <h2 className="mb-3 text-xs font-medium uppercase tracking-widest text-muted-foreground">
              {MESSAGES.property.details}
            </h2>
            <dl className="grid grid-cols-2 gap-4 sm:grid-cols-3">
              <div>
                <dt className="text-xs text-muted-foreground">
                  {MESSAGES.adminProperties.fieldBedrooms}
                </dt>
                <dd className="mt-0.5 text-sm font-medium tabular-nums text-foreground">
                  {property.habitaciones}
                </dd>
              </div>
              <div>
                <dt className="text-xs text-muted-foreground">
                  {MESSAGES.adminProperties.fieldBathrooms}
                </dt>
                <dd className="mt-0.5 text-sm font-medium tabular-nums text-foreground">
                  {property.banos}
                </dd>
              </div>
              <div>
                <dt className="text-xs text-muted-foreground">
                  {MESSAGES.adminProperties.fieldParking}
                </dt>
                <dd className="mt-0.5 text-sm font-medium tabular-nums text-foreground">
                  {property.parqueos}
                </dd>
              </div>
            </dl>
          </div>

          <div className="border-t border-border pt-6">
            <h2 className="mb-3 text-xs font-medium uppercase tracking-widest text-muted-foreground">
              {MESSAGES.property.description}
            </h2>
            <p className="max-w-[65ch] text-sm leading-relaxed text-muted-foreground text-pretty">
              {property.descripcion ?? MESSAGES.property.noDescription}
            </p>
          </div>

          <div className="border-t border-border pt-6">
            {!canSchedule && (
              <p
                role="status"
                className="mb-4 border border-border px-3 py-2 text-xs text-muted-foreground"
              >
                {property.estado === 'inactiva'
                  ? MESSAGES.property.inactiveNotice
                  : MESSAGES.property.reservedNotice}
              </p>
            )}
            <Button
              size="md"
              disabled={!canSchedule}
              onClick={() => {
                setScheduling(property)
              }}
            >
              {MESSAGES.actions.scheduleVisit}
            </Button>
          </div>
        </div>
      </div>

      <VisitRequestDialog
        property={scheduling}
        onClose={() => {
          setScheduling(null)
        }}
      />
    </div>
  )
}
