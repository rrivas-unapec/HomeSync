import { useQuery } from '@tanstack/react-query'
import { queryKeys } from '@/lib/query-keys'
import { fetchProperties, fetchProperty } from '../api/properties-api'
import type { PropertyFilters } from '../types/property'

export function useProperties(filters: PropertyFilters) {
  return useQuery({
    queryKey: queryKeys.properties.list(filters),
    queryFn: () => fetchProperties(filters),
    placeholderData: (previous) => previous,
  })
}

export function useProperty(id: number) {
  return useQuery({
    queryKey: queryKeys.properties.detail(id),
    queryFn: () => fetchProperty(id),
    enabled: Number.isInteger(id) && id > 0,
  })
}
