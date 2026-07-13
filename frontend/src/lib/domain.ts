export const ROLES = ['administrador', 'cliente'] as const
export const PROPERTY_TYPES = ['alquiler', 'venta'] as const
export const PROPERTY_STATES = ['disponible', 'reservada', 'inactiva'] as const
export const VISIT_SLOTS = ['manana', 'tarde'] as const
export const VISIT_STATES = ['pendiente', 'confirmada', 'completada'] as const
export const AUDIT_ACTIONS = ['CREACION', 'EDICION', 'ELIMINACION'] as const

export type Role = (typeof ROLES)[number]
export type PropertyType = (typeof PROPERTY_TYPES)[number]
export type PropertyState = (typeof PROPERTY_STATES)[number]
export type VisitSlot = (typeof VISIT_SLOTS)[number]
export type VisitState = (typeof VISIT_STATES)[number]
export type AuditAction = (typeof AUDIT_ACTIONS)[number]

export const FIELD_LIMITS = {
  propertyTitle: 150,
  propertyZone: 100,
  propertyPhotoUrl: 500,
  clientName: 150,
  clientEmail: 150,
  clientPhone: 20,
  userName: 100,
  userEmail: 150,
} as const

export const PROPERTY_TYPE_LABELS: Record<PropertyType, string> = {
  alquiler: 'Alquiler',
  venta: 'Venta',
}

export const PROPERTY_STATE_LABELS: Record<PropertyState, string> = {
  disponible: 'Disponible',
  reservada: 'Reservada',
  inactiva: 'Inactiva',
}

export const VISIT_SLOT_LABELS: Record<VisitSlot, string> = {
  manana: 'Mañana',
  tarde: 'Tarde',
}

export const VISIT_STATE_LABELS: Record<VisitState, string> = {
  pendiente: 'Pendiente',
  confirmada: 'Confirmada',
  completada: 'Completada',
}

export const AUDIT_ACTION_LABELS: Record<AuditAction, string> = {
  CREACION: 'Creación',
  EDICION: 'Edición',
  ELIMINACION: 'Eliminación',
}

export const ROLE_LABELS: Record<Role, string> = {
  administrador: 'Administrador',
  cliente: 'Cliente',
}
