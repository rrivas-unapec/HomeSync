import type { VisitSlot, VisitState } from '@/lib/domain'

export interface VisitRequest {
  id: number
  propiedadId: number
  propiedadTitulo: string | null
  clienteId: number
  clienteNombre: string | null
  fechaSugerida: string
  horario: VisitSlot
  estado: VisitState
  fechaCreacion: string
}
