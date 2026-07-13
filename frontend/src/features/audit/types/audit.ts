import type { AuditAction } from '@/lib/domain'

export interface AuditEntry {
  id: number
  propiedadId: number
  propiedadTitulo: string | null
  usuarioId: number | null
  usuarioNombre: string | null
  accion: AuditAction
  detallesCambio: string | null
  fechaOperacion: string
}

export function actionTone(action: AuditAction): 'neutral' | 'outline' | 'danger' {
  if (action === 'ELIMINACION') return 'danger'
  if (action === 'EDICION') return 'outline'
  return 'neutral'
}
