import { afterEach, describe, expect, it, vi } from 'vitest'
import { screen, waitFor } from '@testing-library/react'
import { http, HttpResponse } from 'msw'
import { server } from '@/test/msw/server'
import { API } from '@/test/msw/handlers'
import { buildProperty } from '@/test/factories'
import { renderWithProviders } from '@/test/render'
import { MESSAGES } from '@/lib/messages'
import { VisitRequestDialog } from './visit-request-dialog'

const property = buildProperty({ id: 7, titulo: 'Apartamento en Naco' })

function captureBody() {
  const bodies: unknown[] = []
  server.use(
    http.post(`${API}/solicitudes`, async ({ request }) => {
      bodies.push(await request.json())
      return HttpResponse.json({ id: 1 }, { status: 201 })
    }),
  )
  return bodies
}

async function fillForm(user: ReturnType<typeof renderWithProviders>['user'], date: string) {
  await user.type(screen.getByLabelText(MESSAGES.visit.nameLabel), 'María García')
  await user.type(screen.getByLabelText(MESSAGES.visit.emailLabel), 'maria@ejemplo.com')
  await user.type(screen.getByLabelText(MESSAGES.visit.phoneLabel), '809-555-0100')
  await user.type(screen.getByLabelText(MESSAGES.visit.dateLabel), date)
}

afterEach(() => {
  vi.useRealTimers()
})

describe('VisitRequestDialog', () => {
  it('rechaza una fecha en el pasado', async () => {
    vi.useFakeTimers({ shouldAdvanceTime: true })
    vi.setSystemTime(new Date('2026-07-12T15:00:00Z'))

    const { user } = renderWithProviders(
      <VisitRequestDialog property={property} onClose={() => {}} />,
    )

    await fillForm(user, '2026-07-01')
    await user.click(screen.getByRole('button', { name: MESSAGES.visit.submit }))

    expect(await screen.findByText(MESSAGES.validation.dateInPast)).toBeInTheDocument()
  })

  it('acepta la fecha local de hoy aunque en UTC ya sea manana', async () => {
    vi.useFakeTimers({ shouldAdvanceTime: true })
    vi.setSystemTime(new Date('2026-07-13T02:30:00Z'))

    const bodies = captureBody()

    const { user } = renderWithProviders(
      <VisitRequestDialog property={property} onClose={() => {}} />,
    )

    await fillForm(user, '2026-07-12')
    await user.click(screen.getByRole('button', { name: MESSAGES.visit.submit }))

    await waitFor(() => {
      expect(bodies).toHaveLength(1)
    })

    expect(bodies[0]).toMatchObject({ fechaSugerida: '2026-07-12' })
    expect(JSON.stringify(bodies[0])).not.toContain('T00:00:00')
  })

  it('envia el cuerpo exacto que espera el servidor', async () => {
    const bodies = captureBody()

    const { user } = renderWithProviders(
      <VisitRequestDialog property={property} onClose={() => {}} />,
    )

    await fillForm(user, '2099-01-15')
    await user.click(screen.getByRole('button', { name: 'Tarde' }))
    await user.click(screen.getByRole('button', { name: MESSAGES.visit.submit }))

    await waitFor(() => {
      expect(bodies).toHaveLength(1)
    })

    expect(bodies[0]).toEqual({
      propiedadId: 7,
      nombreCompleto: 'María García',
      correo: 'maria@ejemplo.com',
      telefono: '809-555-0100',
      fechaSugerida: '2099-01-15',
      horario: 'tarde',
    })

    expect(await screen.findByText(MESSAGES.visit.successTitle)).toBeInTheDocument()
  })

  it('mapea un error 400 de ProblemDetails al campo correspondiente', async () => {
    server.use(
      http.post(`${API}/solicitudes`, () =>
        HttpResponse.json(
          { errors: { '$.correo': ['El correo no es valido segun el servidor.'] } },
          { status: 400 },
        ),
      ),
    )

    const { user } = renderWithProviders(
      <VisitRequestDialog property={property} onClose={() => {}} />,
    )

    await fillForm(user, '2099-01-15')
    await user.click(screen.getByRole('button', { name: MESSAGES.visit.submit }))

    const input = await screen.findByLabelText(MESSAGES.visit.emailLabel)
    await waitFor(() => {
      expect(input).toHaveAttribute('aria-invalid', 'true')
    })
    expect(screen.getByText('El correo no es valido segun el servidor.')).toBeInTheDocument()
  })

  it('muestra como error de negocio el 400 de una propiedad inactiva', async () => {
    server.use(
      http.post(`${API}/solicitudes`, () =>
        HttpResponse.json(
          { error: 'No se pueden agendar visitas para una propiedad inactiva.' },
          { status: 400 },
        ),
      ),
    )

    const { user } = renderWithProviders(
      <VisitRequestDialog property={property} onClose={() => {}} />,
    )

    await fillForm(user, '2099-01-15')
    await user.click(screen.getByRole('button', { name: MESSAGES.visit.submit }))

    expect(
      await screen.findByText('No se pueden agendar visitas para una propiedad inactiva.'),
    ).toBeInTheDocument()
  })

  it('expone el dialogo con nombre accesible', () => {
    renderWithProviders(<VisitRequestDialog property={property} onClose={() => {}} />)

    const dialog = screen.getByRole('dialog')
    expect(dialog).toHaveAccessibleName(MESSAGES.visit.title)
  })
})
