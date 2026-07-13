import { http, HttpResponse } from 'msw'
import { buildProperty, buildVisitRequest } from '../factories'

export const API = 'http://localhost/api'

export const handlers = [
  http.post(`${API}/auth/login`, () =>
    HttpResponse.json({
      token: 'token-de-prueba',
      expiraEn: '2099-01-01T00:00:00Z',
      usuario: {
        id: 1,
        nombre: 'Administrador',
        correo: 'admin@homesync.do',
        rol: 'administrador',
        fechaCreacion: '2026-07-01T00:00:00Z',
      },
    }),
  ),

  http.post(`${API}/usuarios`, () => HttpResponse.json({}, { status: 201 })),

  http.get(`${API}/usuarios`, () => HttpResponse.json([])),

  http.get(`${API}/propiedades`, () =>
    HttpResponse.json([buildProperty({ id: 1 }), buildProperty({ id: 2 })]),
  ),

  http.get(`${API}/propiedades/:id`, ({ params }) =>
    HttpResponse.json(buildProperty({ id: Number(params.id) })),
  ),

  http.post(`${API}/propiedades`, () =>
    HttpResponse.json(buildProperty({ id: 99 }), { status: 201 }),
  ),

  http.put(`${API}/propiedades/:id`, ({ params }) =>
    HttpResponse.json(buildProperty({ id: Number(params.id) })),
  ),

  http.delete(`${API}/propiedades/:id`, () => new HttpResponse(null, { status: 204 })),

  http.get(`${API}/solicitudes`, () => HttpResponse.json([buildVisitRequest({ id: 1 })])),

  http.post(`${API}/solicitudes`, () =>
    HttpResponse.json(buildVisitRequest({ id: 50 }), { status: 201 }),
  ),

  http.get(`${API}/clientes`, () => HttpResponse.json([])),

  http.get(`${API}/auditoria`, () => HttpResponse.json([])),

  http.get(`${API}/reportes/distribucion-tipo`, () =>
    HttpResponse.json([
      { tipo: 'alquiler', total: 3 },
      { tipo: 'venta', total: 1 },
    ]),
  ),

  http.get(`${API}/reportes/top-solicitadas`, () => HttpResponse.json([])),
]
