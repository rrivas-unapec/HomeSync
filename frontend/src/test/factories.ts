import type { Property } from '@/features/properties/types/property'
import type { VisitRequest } from '@/features/visit-requests/types/visit-request'
import type { Session } from '@/features/auth/lib/session-storage'
import type { Role } from '@/lib/domain'

let nextId = 1

export function resetIds(): void {
  nextId = 1
}

export function buildProperty(overrides: Partial<Property> = {}): Property {
  const id = overrides.id ?? nextId++
  return {
    id,
    titulo: `Propiedad ${String(id)}`,
    descripcion: 'Una descripción de prueba.',
    tipo: 'alquiler',
    precio: 25000,
    ubicacionZona: 'Naco',
    habitaciones: 2,
    banos: 1,
    parqueos: 1,
    fotoUrl: null,
    estado: 'disponible',
    fechaCreacion: '2026-07-01T00:00:00Z',
    ...overrides,
  }
}

export function buildVisitRequest(overrides: Partial<VisitRequest> = {}): VisitRequest {
  const id = overrides.id ?? nextId++
  return {
    id,
    propiedadId: 1,
    propiedadTitulo: 'Propiedad 1',
    clienteId: 1,
    clienteNombre: 'María García',
    fechaSugerida: '2026-08-01',
    horario: 'manana',
    estado: 'pendiente',
    fechaCreacion: '2026-07-10T00:00:00Z',
    ...overrides,
  }
}

export function buildSession(rol: Role = 'administrador'): Session {
  return {
    token: 'token-de-prueba',
    expiresAt: '2099-01-01T00:00:00Z',
    user: {
      id: 1,
      nombre: rol === 'administrador' ? 'Administrador' : 'Cliente',
      correo: 'usuario@homesync.do',
      rol,
      fechaCreacion: '2026-07-01T00:00:00Z',
    },
  }
}

export function seedSession(rol: Role = 'administrador'): Session {
  const session = buildSession(rol)
  window.localStorage.setItem('homesync.session', JSON.stringify(session))
  return session
}
