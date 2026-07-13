import { httpClient } from '@/lib/http-client'
import type { Property, PropertyFilters } from '../types/property'
import type { PropertyCreateInput, PropertyUpdateInput } from '../schemas/property-schema'

export async function fetchProperties(filters: PropertyFilters): Promise<Property[]> {
  const { data } = await httpClient.get<Property[]>('/propiedades', {
    params: {
      tipo: filters.tipo,
      zona: filters.zona,
      precioMinimo: filters.precioMinimo,
      precioMaximo: filters.precioMaximo,
    },
  })
  return data
}

export async function fetchProperty(id: number): Promise<Property> {
  const { data } = await httpClient.get<Property>(`/propiedades/${id}`)
  return data
}

export async function createProperty(input: PropertyCreateInput): Promise<Property> {
  const { data } = await httpClient.post<Property>('/propiedades', input)
  return data
}

export async function updateProperty(id: number, input: PropertyUpdateInput): Promise<Property> {
  const { data } = await httpClient.put<Property>(`/propiedades/${id}`, input)
  return data
}

export async function deleteProperty(id: number): Promise<void> {
  await httpClient.delete(`/propiedades/${id}`)
}
