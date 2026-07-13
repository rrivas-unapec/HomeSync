import { ROLES, type Role } from '@/lib/domain'

const STORAGE_KEY = 'homesync.session'

export interface SessionUser {
  id: number
  nombre: string
  correo: string
  rol: Role
  fechaCreacion: string
}

export interface Session {
  token: string
  expiresAt: string
  user: SessionUser
}

function isRole(value: unknown): value is Role {
  return typeof value === 'string' && (ROLES as readonly string[]).includes(value)
}

function isSession(value: unknown): value is Session {
  if (typeof value !== 'object' || value === null) return false
  const candidate = value as Record<string, unknown>
  if (typeof candidate.token !== 'string' || candidate.token.length === 0) return false
  if (typeof candidate.expiresAt !== 'string') return false

  const user = candidate.user
  if (typeof user !== 'object' || user === null) return false
  const u = user as Record<string, unknown>

  return (
    typeof u.id === 'number' &&
    typeof u.nombre === 'string' &&
    typeof u.correo === 'string' &&
    typeof u.fechaCreacion === 'string' &&
    isRole(u.rol)
  )
}

function normalizeToUtc(value: string): string {
  const hasZone = /(?:Z|[+-]\d{2}:?\d{2})$/.test(value)
  return hasZone ? value : `${value}Z`
}

export function expiresAtMs(session: Session): number {
  return new Date(normalizeToUtc(session.expiresAt)).getTime()
}

export function isExpired(session: Session, now: Date = new Date()): boolean {
  const expiresAt = expiresAtMs(session)
  if (Number.isNaN(expiresAt)) return true
  return expiresAt <= now.getTime()
}

export function readSession(): Session | null {
  let raw: string | null = null
  try {
    raw = window.localStorage.getItem(STORAGE_KEY)
  } catch {
    return null
  }

  if (raw === null) return null

  let parsed: unknown
  try {
    parsed = JSON.parse(raw)
  } catch {
    clearSession()
    return null
  }

  if (!isSession(parsed)) {
    clearSession()
    return null
  }

  if (isExpired(parsed)) {
    clearSession()
    return null
  }

  return parsed
}

export function writeSession(session: Session): void {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(session))
  } catch {
    return
  }
}

export function clearSession(): void {
  try {
    window.localStorage.removeItem(STORAGE_KEY)
  } catch {
    return
  }
}

export function readToken(): string | null {
  const session = readSession()
  return session === null ? null : session.token
}
