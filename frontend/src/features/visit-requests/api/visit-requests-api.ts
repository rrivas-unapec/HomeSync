import { httpClient } from '@/lib/http-client'
import type { VisitState } from '@/lib/domain'
import type { VisitRequest } from '../types/visit-request'
import type { VisitRequestInput } from '../schemas/visit-request-schema'

export async function fetchVisitRequests(): Promise<VisitRequest[]> {
  const { data } = await httpClient.get<VisitRequest[]>('/solicitudes')
  return data
}

export async function createVisitRequest(
  propiedadId: number,
  input: VisitRequestInput,
): Promise<VisitRequest> {
  const { data } = await httpClient.post<VisitRequest>('/solicitudes', {
    propiedadId,
    nombreCompleto: input.nombreCompleto,
    correo: input.correo,
    telefono: input.telefono,
    fechaSugerida: input.fechaSugerida,
    horario: input.horario,
  })
  return data
}

export async function updateVisitRequestState(
  id: number,
  estado: VisitState,
): Promise<VisitRequest> {
  const { data } = await httpClient.patch<VisitRequest>(`/solicitudes/${String(id)}`, { estado })
  return data
}

export async function cancelVisitRequest(id: number): Promise<void> {
  await httpClient.delete(`/solicitudes/${String(id)}`)
}
