import type { PropertyState, PropertyType } from '@/lib/domain'

export interface Property {
  id: number
  titulo: string
  descripcion: string | null
  tipo: PropertyType
  precio: number
  ubicacionZona: string
  habitaciones: number
  banos: number
  parqueos: number
  fotoUrl: string | null
  estado: PropertyState
  fechaCreacion: string
}

export interface PropertyFilters {
  tipo?: PropertyType
  zona?: string
  precioMinimo?: number
  precioMaximo?: number
}

export const SORT_OPTIONS = ['recientes', 'precioAsc', 'precioDesc'] as const
export type SortOption = (typeof SORT_OPTIONS)[number]

export const PAGE_SIZE = 12
