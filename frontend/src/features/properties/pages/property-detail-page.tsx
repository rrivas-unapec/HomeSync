import { useState } from 'react'
import { Link, useParams } from 'react-router'
import { ArrowLeft, Bath, BedDouble, Car, MapPin } from 'lucide-react'
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

const SPECS = [
  { icon: BedDouble, label: MESSAGES.adminProperties.fieldBedrooms, key: 'habitaciones' },
  { icon: Bath, label: MESSAGES.adminProperties.fieldBathrooms, key: 'banos' },
  { icon: Car, label: MESSAGES.adminProperties.fieldParking, key: 'parqueos' },
] as const

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
      <div className="px-6 py-8 md:px-8">
        <Skeleton className="aspect-[16/9] w-full" />
        <div className="mt-8 flex flex-col gap-4">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-6 w-2/3" />
          <Skeleton className="h-24 w-full" />
        </div>
      </div>
    )
  }

  if (query.isError) {
    if (isApiError(query.error) && query.error.status === 404) {
      return <NotFoundPage />
    }
    return (
      <div className="px-6 py-8 md:px-8">
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
    <div className="px-6 py-8 md:px-8">
      <Link
        to="/"
        className="mb-6 inline-flex items-center gap-1.5 text-xs font-medium uppercase tracking-widest text-muted-foreground transition-colors duration-150 ease-out hover:text-foreground motion-reduce:transition-none"
      >
        <ArrowLeft className="h-3 w-3" aria-hidden="true" />
        {MESSAGES.actions.backToCatalog}
      </Link>

      <div className="aspect-[16/9] overflow-hidden border border-border bg-muted">
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

      <div className="mt-8 grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,1fr)_20rem]">
        <div className="min-w-0">
          <div className="mb-4 flex flex-wrap items-center gap-2">
            <Badge>{PROPERTY_TYPE_LABELS[property.tipo]}</Badge>
            {property.estado !== 'disponible' && (
              <Badge tone="outline">{PROPERTY_STATE_LABELS[property.estado]}</Badge>
            )}
          </div>

          <h1 className="text-3xl font-semibold leading-tight text-foreground text-balance">
            {property.titulo}
          </h1>

          <p className="mt-3 flex items-center gap-1.5 text-sm text-muted-foreground">
            <MapPin className="h-4 w-4 shrink-0" aria-hidden="true" />
            {property.ubicacionZona}
          </p>

          <dl className="mt-8 grid grid-cols-3 gap-px border border-border bg-border">
            {SPECS.map((spec) => (
              <div key={spec.key} className="flex flex-col gap-1 bg-card px-4 py-5">
                <dt className="flex items-center gap-1.5 text-[10px] font-medium uppercase tracking-[0.18em] text-muted-foreground">
                  <spec.icon className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                  {spec.label}
                </dt>
                <dd className="text-2xl font-semibold tabular-nums text-foreground">
                  {property[spec.key]}
                </dd>
              </div>
            ))}
          </dl>

          <section className="mt-10 border-t border-border pt-8">
            <h2 className="mb-4 text-[10px] font-medium uppercase tracking-[0.18em] text-muted-foreground">
              {MESSAGES.property.description}
            </h2>
            <p className="max-w-[65ch] text-sm leading-relaxed text-muted-foreground text-pretty">
              {property.descripcion ?? MESSAGES.property.noDescription}
            </p>
          </section>
        </div>

        <aside className="lg:sticky lg:top-[7.5rem] lg:self-start">
          <div className="border border-border bg-card p-6">
            <p className="text-[10px] font-medium uppercase tracking-[0.18em] text-muted-foreground">
              {MESSAGES.table.price}
            </p>
            <p className="mt-1.5 text-3xl font-semibold leading-none tabular-nums text-foreground">
              {formatCurrency(property.precio)}
            </p>

            {!canSchedule && (
              <p
                role="status"
                className="mt-5 border border-border-control px-3 py-2.5 text-xs leading-relaxed text-muted-foreground text-pretty"
              >
                {property.estado === 'inactiva'
                  ? MESSAGES.property.inactiveNotice
                  : MESSAGES.property.reservedNotice}
              </p>
            )}

            <Button
              size="lg"
              className="mt-6"
              disabled={!canSchedule}
              onClick={() => {
                setScheduling(property)
              }}
            >
              {MESSAGES.actions.scheduleVisit}
            </Button>
          </div>
        </aside>
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
