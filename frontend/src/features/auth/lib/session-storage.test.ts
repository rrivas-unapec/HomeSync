import { afterEach, describe, expect, it, vi } from 'vitest'
import { buildSession } from '@/test/factories'
import { clearSession, isExpired, readSession, writeSession } from './session-storage'

const KEY = 'homesync.session'

afterEach(() => {
  vi.useRealTimers()
  window.localStorage.clear()
})

describe('session-storage', () => {
  it('guarda y recupera una sesion valida', () => {
    const session = buildSession('administrador')
    writeSession(session)

    expect(readSession()).toEqual(session)
  })

  it('descarta y limpia una sesion con JSON corrupto', () => {
    window.localStorage.setItem(KEY, '{ esto no es json')

    expect(readSession()).toBeNull()
    expect(window.localStorage.getItem(KEY)).toBeNull()
  })

  it('descarta y limpia una sesion con forma invalida', () => {
    window.localStorage.setItem(KEY, JSON.stringify({ token: 'x', user: { rol: 'superadmin' } }))

    expect(readSession()).toBeNull()
    expect(window.localStorage.getItem(KEY)).toBeNull()
  })

  it('descarta y limpia una sesion expirada', () => {
    writeSession({ ...buildSession(), expiresAt: '2020-01-01T00:00:00Z' })

    expect(readSession()).toBeNull()
    expect(window.localStorage.getItem(KEY)).toBeNull()
  })

  it('interpreta como UTC una fecha de expiracion sin zona horaria', () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2026-07-12T20:30:00Z'))

    const withoutZone = { ...buildSession(), expiresAt: '2026-07-12T21:00:00' }
    const alreadyPast = { ...buildSession(), expiresAt: '2026-07-12T20:00:00' }

    expect(isExpired(withoutZone)).toBe(false)
    expect(isExpired(alreadyPast)).toBe(true)
  })

  it('limpia la sesion al cerrar', () => {
    writeSession(buildSession())
    clearSession()

    expect(readSession()).toBeNull()
  })
})
