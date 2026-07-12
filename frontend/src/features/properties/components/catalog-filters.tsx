import { Button } from '@/components/ui/button'
import { PROPERTY_TYPES, PROPERTY_TYPE_LABELS } from '@/lib/domain'
import { MESSAGES } from '@/lib/messages'
import { SORT_OPTIONS, type SortOption } from '../types/property'

const SORT_LABELS: Record<SortOption, string> = {
  recientes: MESSAGES.catalog.sortRecent,
  precioAsc: MESSAGES.catalog.sortPriceAsc,
  precioDesc: MESSAGES.catalog.sortPriceDesc,
}

const CONTROL_CLASS =
  'h-9 border-0 border-b border-border-control bg-transparent px-0 text-sm text-foreground transition-colors duration-150 ease-out hover:border-foreground motion-reduce:transition-none'

const LABEL_CLASS = 'text-[10px] font-medium uppercase tracking-[0.18em] text-muted-foreground'

interface CatalogFiltersProps {
  tipo: string
  zonaDraft: string
  precioMinimo: string
  precioMaximo: string
  sort: SortOption
  hasFilters: boolean
  onTipoChange: (value: string) => void
  onZonaChange: (value: string) => void
  onPrecioMinimoChange: (value: string) => void
  onPrecioMaximoChange: (value: string) => void
  onSortChange: (value: string) => void
  onClear: () => void
}

export function CatalogFilters({
  tipo,
  zonaDraft,
  precioMinimo,
  precioMaximo,
  sort,
  hasFilters,
  onTipoChange,
  onZonaChange,
  onPrecioMinimoChange,
  onPrecioMaximoChange,
  onSortChange,
  onClear,
}: CatalogFiltersProps) {
  return (
    <search className="sticky top-14 z-30 border-b border-border bg-card px-6 py-4 md:px-8">
      <div className="flex flex-wrap items-end gap-x-4 gap-y-3">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="filtro-tipo" className={LABEL_CLASS}>
            {MESSAGES.catalog.filterType}
          </label>
          <select
            id="filtro-tipo"
            className={`${CONTROL_CLASS} cursor-pointer`}
            value={tipo}
            onChange={(event) => {
              onTipoChange(event.target.value)
            }}
          >
            <option value="">{MESSAGES.catalog.filterAll}</option>
            {PROPERTY_TYPES.map((value) => (
              <option key={value} value={value}>
                {PROPERTY_TYPE_LABELS[value]}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="filtro-zona" className={LABEL_CLASS}>
            {MESSAGES.catalog.filterZone}
          </label>
          <input
            id="filtro-zona"
            type="search"
            spellCheck={false}
            autoComplete="off"
            placeholder={MESSAGES.catalog.filterZonePlaceholder}
            className={`${CONTROL_CLASS} w-44 placeholder:text-muted-foreground`}
            value={zonaDraft}
            onChange={(event) => {
              onZonaChange(event.target.value)
            }}
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="filtro-precio-min" className={LABEL_CLASS}>
            {MESSAGES.catalog.filterPriceMin}
          </label>
          <input
            id="filtro-precio-min"
            type="number"
            inputMode="numeric"
            min={0}
            step={1000}
            className={`${CONTROL_CLASS} w-32 tabular-nums`}
            value={precioMinimo}
            onChange={(event) => {
              onPrecioMinimoChange(event.target.value)
            }}
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="filtro-precio-max" className={LABEL_CLASS}>
            {MESSAGES.catalog.filterPriceMax}
          </label>
          <input
            id="filtro-precio-max"
            type="number"
            inputMode="numeric"
            min={0}
            step={1000}
            className={`${CONTROL_CLASS} w-32 tabular-nums`}
            value={precioMaximo}
            onChange={(event) => {
              onPrecioMaximoChange(event.target.value)
            }}
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="filtro-orden" className={LABEL_CLASS}>
            {MESSAGES.catalog.sortLabel}
          </label>
          <select
            id="filtro-orden"
            className={`${CONTROL_CLASS} cursor-pointer`}
            value={sort}
            onChange={(event) => {
              onSortChange(event.target.value)
            }}
          >
            {SORT_OPTIONS.map((value) => (
              <option key={value} value={value}>
                {SORT_LABELS[value]}
              </option>
            ))}
          </select>
        </div>

        {hasFilters && (
          <Button variant="ghost" size="sm" className="ml-auto h-9" onClick={onClear}>
            {MESSAGES.actions.clearFilters}
          </Button>
        )}
      </div>
    </search>
  )
}
