import { describe, expect, it } from 'vitest'
import { buildProperty } from '@/test/factories'
import { hideInactive, paginate, sortProperties } from './paginate-and-sort'
import { PAGE_SIZE } from '../types/property'

describe('sortProperties', () => {
  const properties = [
    buildProperty({ id: 1, precio: 300 }),
    buildProperty({ id: 2, precio: 100 }),
    buildProperty({ id: 3, precio: 200 }),
  ]

  it('ordena por precio ascendente', () => {
    expect(sortProperties(properties, 'precioAsc').map((p) => p.precio)).toEqual([100, 200, 300])
  })

  it('ordena por precio descendente', () => {
    expect(sortProperties(properties, 'precioDesc').map((p) => p.precio)).toEqual([300, 200, 100])
  })

  it('respeta el orden del servidor para las mas recientes', () => {
    expect(sortProperties(properties, 'recientes').map((p) => p.id)).toEqual([1, 2, 3])
  })

  it('no muta el arreglo original', () => {
    const original = [...properties]
    sortProperties(properties, 'precioAsc')

    expect(properties).toEqual(original)
  })
})

describe('paginate', () => {
  const many = Array.from({ length: 20 }, (_, index) => buildProperty({ id: index + 1 }))

  it('devuelve la primera pagina completa', () => {
    const result = paginate(many, 1)

    expect(result.items).toHaveLength(PAGE_SIZE)
    expect(result.totalPages).toBe(2)
    expect(result.totalItems).toBe(20)
  })

  it('devuelve el resto en la ultima pagina', () => {
    expect(paginate(many, 2).items).toHaveLength(20 - PAGE_SIZE)
  })

  it('acota una pagina fuera de rango', () => {
    expect(paginate(many, 99).page).toBe(2)
    expect(paginate(many, -4).page).toBe(1)
  })

  it('devuelve una pagina para una lista vacia', () => {
    const result = paginate([], 1)

    expect(result.totalPages).toBe(1)
    expect(result.items).toHaveLength(0)
  })
})

describe('hideInactive', () => {
  it('oculta del catalogo publico las propiedades inactivas', () => {
    const properties = [
      buildProperty({ id: 1, estado: 'disponible' }),
      buildProperty({ id: 2, estado: 'inactiva' }),
      buildProperty({ id: 3, estado: 'reservada' }),
    ]

    expect(hideInactive(properties).map((p) => p.id)).toEqual([1, 3])
  })
})
