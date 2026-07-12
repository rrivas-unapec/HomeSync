import { Link } from 'react-router'
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

  return (
    <article className="group flex flex-col border border-border bg-card">
      <Link
        to={`/propiedades/${String(property.id)}`}
        className="block aspect-[4/3] overflow-hidden bg-muted"
      >
        {property.fotoUrl !== null ? (
          <img
            src={property.fotoUrl}
            alt={MESSAGES.catalog.photoAlt(property.titulo)}
            width={640}
            height={480}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <span className="text-xs uppercase tracking-widest text-muted-foreground">
              {MESSAGES.catalog.noPhoto}
            </span>
          </div>
        )}
      </Link>

      <div className="flex flex-1 flex-col px-5 py-5">
        <div className="mb-3 flex items-start gap-2">
          <Badge className="mt-0.5">{PROPERTY_TYPE_LABELS[property.tipo]}</Badge>
          {property.estado !== 'disponible' && (
            <Badge tone="outline" className="mt-0.5">
              {PROPERTY_STATE_LABELS[property.estado]}
            </Badge>
          )}
        </div>

        <h2 className="mb-2 min-w-0 text-sm font-semibold leading-snug text-foreground text-pretty">
          <Link
            to={`/propiedades/${String(property.id)}`}
            className="underline-offset-2 hover:underline"
          >
            {property.titulo}
          </Link>
        </h2>

        <p className="mb-1 text-lg font-semibold tabular-nums text-foreground">
          {formatCurrency(property.precio)}
        </p>
        <p className="mb-3 truncate text-xs text-muted-foreground">{property.ubicacionZona}</p>

        <div className="mb-4 flex flex-wrap items-center gap-x-3 gap-y-1 border-t border-border pt-3 text-xs tabular-nums text-muted-foreground">
          <span>{MESSAGES.catalog.bedrooms(property.habitaciones)}</span>
          <span aria-hidden="true" className="text-border">
            |
          </span>
          <span>{MESSAGES.catalog.bathrooms(property.banos)}</span>
          <span aria-hidden="true" className="text-border">
            |
          </span>
          <span>{MESSAGES.catalog.parking(property.parqueos)}</span>
        </div>

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
