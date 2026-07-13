import { useMemo, useState } from 'react'
import { useSearchParams } from 'react-router'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { EmptyState, ErrorState } from '@/components/shared/states'
import { MESSAGES } from '@/lib/messages'
import { VisitRequestDialog } from '@/features/visit-requests/components/visit-request-dialog'
import { CatalogFilters } from '../components/catalog-filters'
import { PropertyCard } from '../components/property-card'
import { useCatalogParams } from '../hooks/use-catalog-params'
import { useProperties } from '../hooks/use-properties'
import { hideInactive, paginate, sortProperties } from '../lib/paginate-and-sort'
import { PAGE_SIZE, type Property } from '../types/property'

export function CatalogPage() {
  const [searchParams] = useSearchParams()
  const { filters, sort, page, zonaDraft, setZonaDraft, setParam, clearFilters, hasFilters } =
    useCatalogParams()
  const [scheduling, setScheduling] = useState<Property | null>(null)

  const query = useProperties(filters)

  const result = useMemo(() => {
    const data = query.data ?? []
    return paginate(sortProperties(hideInactive(data), sort), page)
  }, [query.data, sort, page])

  return (
    <>
      <section className="border-b border-border bg-card px-6 py-12 md:px-8 md:py-16">
        <p className="mb-3 text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
          {MESSAGES.catalog.eyebrow}
        </p>
        <h1 className="max-w-2xl text-3xl font-semibold leading-tight text-foreground text-balance md:text-4xl">
          {MESSAGES.catalog.title}
        </h1>
        <p className="mt-4 max-w-[55ch] text-sm leading-relaxed text-muted-foreground text-pretty">
          {MESSAGES.catalog.lead}
        </p>
      </section>

      <CatalogFilters
        tipo={searchParams.get('tipo') ?? ''}
        zonaDraft={zonaDraft}
        precioMinimo={searchParams.get('precioMinimo') ?? ''}
        precioMaximo={searchParams.get('precioMaximo') ?? ''}
        sort={sort}
        hasFilters={hasFilters}
        onTipoChange={(value) => {
          setParam('tipo', value)
        }}
        onZonaChange={setZonaDraft}
        onPrecioMinimoChange={(value) => {
          setParam('precioMinimo', value)
        }}
        onPrecioMaximoChange={(value) => {
          setParam('precioMaximo', value)
        }}
        onSortChange={(value) => {
          setParam('orden', value)
        }}
        onClear={clearFilters}
      />

      <div className="px-6 py-8 md:px-8">
        <p
          aria-live="polite"
          className="mb-6 text-xs font-medium uppercase tracking-widest tabular-nums text-muted-foreground"
        >
          {query.isPending
            ? MESSAGES.a11y.loading
            : result.totalItems === 1
              ? MESSAGES.catalog.resultsOne
              : MESSAGES.catalog.resultsMany(result.totalItems)}
        </p>

        {query.isPending ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: PAGE_SIZE }, (_, index) => (
              <div
                key={index}
                className="border border-border bg-card"
                data-testid="property-skeleton"
              >
                <Skeleton className="aspect-[4/3] w-full" />
                <div className="flex flex-col gap-3 px-5 py-5">
                  <Skeleton className="h-6 w-2/5" />
                  <Skeleton className="h-4 w-4/5" />
                  <Skeleton className="h-3 w-1/3" />
                  <Skeleton className="mt-2 h-11 w-full" />
                </div>
              </div>
            ))}
          </div>
        ) : query.isError ? (
          <ErrorState
            message={MESSAGES.catalog.error}
            onRetry={() => {
              void query.refetch()
            }}
          />
        ) : result.totalItems === 0 ? (
          <EmptyState
            message={MESSAGES.catalog.empty}
            actionLabel={hasFilters ? MESSAGES.actions.clearFilters : undefined}
            onAction={hasFilters ? clearFilters : undefined}
          />
        ) : (
          <>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {result.items.map((property) => (
                <PropertyCard key={property.id} property={property} onSchedule={setScheduling} />
              ))}
            </div>

            {result.totalPages > 1 && (
              <nav
                aria-label={MESSAGES.catalog.pagination}
                className="mt-10 flex items-center justify-center gap-4 border-t border-border pt-8"
              >
                <Button
                  variant="secondary"
                  size="md"
                  disabled={result.page <= 1}
                  onClick={() => {
                    setParam('pagina', String(result.page - 1))
                  }}
                >
                  {MESSAGES.actions.previous}
                </Button>
                <span className="text-xs font-medium uppercase tracking-widest tabular-nums text-muted-foreground">
                  {MESSAGES.catalog.pageStatus(result.page, result.totalPages)}
                </span>
                <Button
                  variant="secondary"
                  size="md"
                  disabled={result.page >= result.totalPages}
                  onClick={() => {
                    setParam('pagina', String(result.page + 1))
                  }}
                >
                  {MESSAGES.actions.next}
                </Button>
              </nav>
            )}
          </>
        )}
      </div>

      <VisitRequestDialog
        property={scheduling}
        onClose={() => {
          setScheduling(null)
        }}
      />
    </>
  )
}
