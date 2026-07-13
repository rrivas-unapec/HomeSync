import { useCallback, useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router'
import { PROPERTY_TYPES, type PropertyType } from '@/lib/domain'
import { SORT_OPTIONS, type PropertyFilters, type SortOption } from '../types/property'

const DEBOUNCE_MS = 300

function parseType(value: string | null): PropertyType | undefined {
  if (value === null) return undefined
  return (PROPERTY_TYPES as readonly string[]).includes(value) ? (value as PropertyType) : undefined
}

function parseSort(value: string | null): SortOption {
  if (value === null) return 'recientes'
  return (SORT_OPTIONS as readonly string[]).includes(value) ? (value as SortOption) : 'recientes'
}

function parsePositiveNumber(value: string | null): number | undefined {
  if (value === null || value.trim().length === 0) return undefined
  const parsed = Number(value)
  if (!Number.isFinite(parsed) || parsed < 0) return undefined
  return parsed
}

function parsePage(value: string | null): number {
  if (value === null) return 1
  const parsed = Number(value)
  if (!Number.isInteger(parsed) || parsed < 1) return 1
  return parsed
}

export function useCatalogParams() {
  const [searchParams, setSearchParams] = useSearchParams()

  const zonaParam = searchParams.get('zona') ?? ''
  const [zonaDraft, setZonaDraft] = useState(zonaParam)

  useEffect(() => {
    setZonaDraft(zonaParam)
  }, [zonaParam])

  const filters = useMemo<PropertyFilters>(() => {
    const result: PropertyFilters = {}
    const tipo = parseType(searchParams.get('tipo'))
    const zona = searchParams.get('zona')?.trim()
    const precioMinimo = parsePositiveNumber(searchParams.get('precioMinimo'))
    const precioMaximo = parsePositiveNumber(searchParams.get('precioMaximo'))

    if (tipo !== undefined) result.tipo = tipo
    if (zona !== undefined && zona.length > 0) result.zona = zona
    if (precioMinimo !== undefined) result.precioMinimo = precioMinimo
    if (precioMaximo !== undefined) result.precioMaximo = precioMaximo
    return result
  }, [searchParams])

  const sort = parseSort(searchParams.get('orden'))
  const page = parsePage(searchParams.get('pagina'))

  const updateParams = useCallback(
    (mutate: (params: URLSearchParams) => void, resetPage: boolean) => {
      setSearchParams(
        (current) => {
          const next = new URLSearchParams(current)
          mutate(next)
          if (resetPage) next.delete('pagina')
          return next
        },
        { replace: true },
      )
    },
    [setSearchParams],
  )

  const setParam = useCallback(
    (key: string, value: string | undefined) => {
      updateParams((params) => {
        if (value === undefined || value.length === 0) {
          params.delete(key)
        } else {
          params.set(key, value)
        }
      }, key !== 'pagina')
    },
    [updateParams],
  )

  useEffect(() => {
    if (zonaDraft === zonaParam) return

    const timer = window.setTimeout(() => {
      setParam('zona', zonaDraft.trim())
    }, DEBOUNCE_MS)

    return () => {
      window.clearTimeout(timer)
    }
  }, [zonaDraft, zonaParam, setParam])

  const clearFilters = useCallback(() => {
    setZonaDraft('')
    setSearchParams(new URLSearchParams(), { replace: true })
  }, [setSearchParams])

  const hasFilters =
    filters.tipo !== undefined ||
    filters.zona !== undefined ||
    filters.precioMinimo !== undefined ||
    filters.precioMaximo !== undefined

  return {
    filters,
    sort,
    page,
    zonaDraft,
    setZonaDraft,
    setParam,
    clearFilters,
    hasFilters,
  }
}
