import { Link } from 'react-router'
import { Bath, BedDouble, Car, MapPin } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { PROPERTY_STATE_LABELS, PROPERTY_TYPE_LABELS } from '@/lib/domain'
import { formatCurrency } from '@/lib/format'
import { MESSAGES } from '@/lib/messages'
import type { Property } from '../types/property'

interface PropertyCardProps {
  property: Property
  onSchedule: (property: Property) => void
}

export function PropertyCard({ property, onSchedule }: PropertyCardProps) {
  const canSchedule = property.estado === 'disponible'
  const detailPath = `/propiedades/${String(property.id)}`

  return (
    <article className="group flex flex-col border border-border bg-card transition-colors duration-150 ease-out hover:border-border-control motion-reduce:transition-none">
      <Link to={detailPath} className="relative block aspect-[4/3] overflow-hidden bg-muted">
        {property.fotoUrl !== null ? (
          <img
            src={property.fotoUrl}
            alt={MESSAGES.catalog.photoAlt(property.titulo)}
            width={640}
            height={480}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-500 ease-out motion-reduce:transition-none [@media(hover:hover)]:group-hover:scale-[1.03]"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <span className="text-xs uppercase tracking-widest text-muted-foreground">
              {MESSAGES.catalog.noPhoto}
            </span>
          </div>
        )}

        <div className="absolute left-3 top-3 flex flex-wrap gap-1.5">
          <Badge tone="onImage">{PROPERTY_TYPE_LABELS[property.tipo]}</Badge>
          {property.estado !== 'disponible' && (
            <Badge tone="onImage">{PROPERTY_STATE_LABELS[property.estado]}</Badge>
          )}
        </div>
      </Link>

      <div className="flex flex-1 flex-col px-5 py-5">
        <p className="mb-1.5 text-xl font-semibold leading-none tabular-nums text-foreground">
          {formatCurrency(property.precio)}
        </p>

        <h2 className="mb-2 min-w-0 text-sm leading-snug text-foreground text-pretty">
          <Link to={detailPath} className="underline-offset-2 hover:underline">
            {property.titulo}
          </Link>
        </h2>

        <p className="mb-4 flex items-center gap-1.5 text-xs text-muted-foreground">
          <MapPin className="h-3 w-3 shrink-0" aria-hidden="true" />
          <span className="truncate">{property.ubicacionZona}</span>
        </p>

        <dl className="mb-5 flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-border pt-4 text-xs text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <BedDouble className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
            <dt className="sr-only">{MESSAGES.adminProperties.fieldBedrooms}</dt>
            <dd className="tabular-nums">{MESSAGES.catalog.bedrooms(property.habitaciones)}</dd>
          </div>
          <div className="flex items-center gap-1.5">
            <Bath className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
            <dt className="sr-only">{MESSAGES.adminProperties.fieldBathrooms}</dt>
            <dd className="tabular-nums">{MESSAGES.catalog.bathrooms(property.banos)}</dd>
          </div>
          <div className="flex items-center gap-1.5">
            <Car className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
            <dt className="sr-only">{MESSAGES.adminProperties.fieldParking}</dt>
            <dd className="tabular-nums">{MESSAGES.catalog.parking(property.parqueos)}</dd>
          </div>
        </dl>

        <div className="mt-auto">
          <Button
            size="lg"
            disabled={!canSchedule}
            onClick={() => {
              onSchedule(property)
            }}
          >
            {MESSAGES.actions.scheduleVisit}
          </Button>
        </div>
      </div>
    </article>
  )
}
