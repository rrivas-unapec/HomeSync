import { describe, expect, it } from 'vitest'
import { MESSAGES } from '@/lib/messages'
import { parseAuditDetails, summarizeAuditDetails } from './audit-details'

const CREATION = JSON.stringify({
  Titulo: 'Apartamento en Piantini',
  Descripcion: null,
  Tipo: 'alquiler',
  Precio: 29500,
  UbicacionZona: 'Piantini',
  Habitaciones: 2,
  Banos: 2,
  Parqueos: 1,
  FotoUrl: 'https://ejemplo.com/foto.jpg',
})

describe('parseAuditDetails', () => {
  it('traduce las claves del servidor a etiquetas en espanol', () => {
    const fields = parseAuditDetails(CREATION)
    const labels = fields.map((f) => f.label)

    expect(labels).toContain(MESSAGES.adminProperties.fieldTitle)
    expect(labels).toContain(MESSAGES.adminProperties.fieldZone)
    expect(labels).not.toContain('UbicacionZona')
  })

  it('formatea el precio como moneda y no como numero crudo', () => {
    const precio = parseAuditDetails(CREATION).find((f) => f.key === 'Precio')

    expect(precio?.value).toMatch(/RD\$|DOP/)
    expect(precio?.value).not.toBe('29500')
  })

  it('traduce los valores de dominio', () => {
    const tipo = parseAuditDetails(CREATION).find((f) => f.key === 'Tipo')

    expect(tipo?.value).toBe('Alquiler')
  })

  it('marca la foto como enlace y no como texto plano', () => {
    const foto = parseAuditDetails(CREATION).find((f) => f.key === 'FotoUrl')

    expect(foto?.isLink).toBe(true)
  })

  it('senala los campos vacios en vez de mostrar null', () => {
    const descripcion = parseAuditDetails(CREATION).find((f) => f.key === 'Descripcion')

    expect(descripcion?.isEmpty).toBe(true)
    expect(descripcion?.value).toBe(MESSAGES.adminAudit.noValue)
  })

  it('respeta el orden de los campos, no el del JSON', () => {
    const keys = parseAuditDetails(JSON.stringify({ Precio: 100, Titulo: 'X', Tipo: 'venta' })).map(
      (f) => f.key,
    )

    expect(keys).toEqual(['Titulo', 'Tipo', 'Precio'])
  })

  it('devuelve vacio ante un JSON invalido o nulo', () => {
    expect(parseAuditDetails(null)).toEqual([])
    expect(parseAuditDetails('{ roto')).toEqual([])
    expect(parseAuditDetails('"texto"')).toEqual([])
  })

  it('maneja la eliminacion, que solo trae el titulo', () => {
    const fields = parseAuditDetails(JSON.stringify({ Titulo: 'Casa en Santiago' }))

    expect(fields).toHaveLength(1)
    expect(fields[0]?.value).toBe('Casa en Santiago')
  })
})

describe('summarizeAuditDetails', () => {
  it('resume solo los campos clave y omite los vacios', () => {
    const summary = summarizeAuditDetails(parseAuditDetails(CREATION))
    const keys = summary.map((f) => f.key)

    expect(keys).toEqual(['Tipo', 'Precio', 'UbicacionZona'])
    expect(keys).not.toContain('Descripcion')
    expect(keys).not.toContain('FotoUrl')
  })
})
