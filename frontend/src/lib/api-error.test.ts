import { describe, expect, it } from 'vitest'
import { normalizeApiError, normalizeFieldKey } from './api-error'
import { MESSAGES } from './messages'

describe('normalizeFieldKey', () => {
  it('convierte las rutas JSON de ProblemDetails en nombres de campo', () => {
    expect(normalizeFieldKey('$.precio')).toBe('precio')
    expect(normalizeFieldKey('$.Precio')).toBe('precio')
    expect(normalizeFieldKey('$.items[0].titulo')).toBe('titulo')
  })

  it('conserva los nombres de parametros de consulta en camelCase', () => {
    expect(normalizeFieldKey('precioMinimo')).toBe('precioMinimo')
  })

  it('convierte las claves PascalCase de validacion clasica', () => {
    expect(normalizeFieldKey('FechaSugerida')).toBe('fechaSugerida')
  })

  it('usa _root cuando la clave apunta a la raiz del cuerpo', () => {
    expect(normalizeFieldKey('$')).toBe('_root')
  })
})

describe('normalizeApiError', () => {
  it('normaliza el error de negocio del middleware', () => {
    const error = normalizeApiError(400, { error: 'La propiedad esta inactiva.' }, false)

    expect(error.kind).toBe('validation')
    expect(error.status).toBe(400)
    expect(error.message).toBe('La propiedad esta inactiva.')
  })

  it('normaliza ProblemDetails y mapea las claves a campos del formulario', () => {
    const error = normalizeApiError(
      400,
      {
        title: 'One or more validation errors occurred.',
        status: 400,
        errors: { '$.precio': ['The value is not valid.'] },
        traceId: '00-abc-123',
      },
      false,
    )

    expect(error.kind).toBe('validation')
    expect(error.fieldErrors).toEqual({ precio: ['The value is not valid.'] })
  })

  it('nunca expone el traceId ni el mensaje tecnico del servidor en un 500', () => {
    const error = normalizeApiError(
      500,
      { error: 'Ocurrio un error inesperado en el servidor.' },
      false,
    )

    expect(error.kind).toBe('server')
    expect(error.message).toBe(MESSAGES.errors.server)
    expect(error.message).not.toContain('servidor.')
  })

  it('distingue el 401 de credenciales invalidas del 401 de sesion expirada', () => {
    const credentials = normalizeApiError(401, { error: 'Correo o contrasena invalidos.' }, true)
    const expired = normalizeApiError(401, undefined, false)

    expect(credentials.kind).toBe('invalid_credentials')
    expect(expired.kind).toBe('unauthorized')
  })

  it('normaliza el 403 con cuerpo vacio', () => {
    const error = normalizeApiError(403, '', false)

    expect(error.kind).toBe('forbidden')
    expect(error.message).toBe(MESSAGES.errors.forbidden)
  })

  it('normaliza el 404 conservando el mensaje de negocio', () => {
    const error = normalizeApiError(404, { error: 'No existe la propiedad con id 9.' }, false)

    expect(error.kind).toBe('not_found')
    expect(error.message).toBe('No existe la propiedad con id 9.')
  })

  it('normaliza un fallo de red sin respuesta', () => {
    const error = normalizeApiError(undefined, undefined, false)

    expect(error.kind).toBe('network')
    expect(error.status).toBe(0)
    expect(error.message).toBe(MESSAGES.errors.network)
  })
})
