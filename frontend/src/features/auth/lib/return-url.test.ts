import { describe, expect, it } from 'vitest'
import { safeReturnUrl } from './return-url'

describe('safeReturnUrl', () => {
  it('acepta rutas internas', () => {
    expect(safeReturnUrl('/admin/clientes')).toBe('/admin/clientes')
    expect(safeReturnUrl('/propiedades/3?x=1')).toBe('/propiedades/3?x=1')
  })

  it('rechaza una URL absoluta a otro dominio', () => {
    expect(safeReturnUrl('https://evil.com')).toBeNull()
  })

  it('rechaza una URL relativa al protocolo', () => {
    expect(safeReturnUrl('//evil.com')).toBeNull()
  })

  it('rechaza el escape con contrabarra que algunos navegadores normalizan', () => {
    expect(safeReturnUrl('/\\evil.com')).toBeNull()
  })

  it('rechaza valores vacios o nulos', () => {
    expect(safeReturnUrl(null)).toBeNull()
    expect(safeReturnUrl('')).toBeNull()
  })
})
