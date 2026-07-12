import { httpClient } from '@/lib/http-client'
import type { PropertyType } from '@/lib/domain'

export interface TypeDistributionRow {
  tipo: PropertyType
  total: number
}

export interface TopRequestedRow {
  propiedadId: number
  titulo: string
  totalSolicitudes: number
}

export async function fetchTypeDistribution(): Promise<TypeDistributionRow[]> {
  const { data } = await httpClient.get<TypeDistributionRow[]>('/reportes/distribucion-tipo')
  return data
}

export async function fetchTopRequested(top: number): Promise<TopRequestedRow[]> {
  const { data } = await httpClient.get<TopRequestedRow[]>('/reportes/top-solicitadas', {
    params: { top },
  })
  return data
}
