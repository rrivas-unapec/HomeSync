import type { Property, SortOption } from '../types/property'
import { PAGE_SIZE } from '../types/property'

export interface PageResult {
  items: Property[]
  page: number
  totalPages: number
  totalItems: number
}

export function sortProperties(properties: readonly Property[], sort: SortOption): Property[] {
  const copy = [...properties]

  switch (sort) {
    case 'precioAsc':
      return copy.sort((a, b) => a.precio - b.precio || a.id - b.id)
    case 'precioDesc':
      return copy.sort((a, b) => b.precio - a.precio || a.id - b.id)
    case 'recientes':
      return copy
  }
}

export function paginate(properties: readonly Property[], page: number): PageResult {
  const totalItems = properties.length
  const totalPages = Math.max(1, Math.ceil(totalItems / PAGE_SIZE))
  const safePage = Math.min(Math.max(1, page), totalPages)
  const start = (safePage - 1) * PAGE_SIZE

  return {
    items: properties.slice(start, start + PAGE_SIZE),
    page: safePage,
    totalPages,
    totalItems,
  }
}

export function hideInactive(properties: readonly Property[]): Property[] {
  return properties.filter((property) => property.estado !== 'inactiva')
}
