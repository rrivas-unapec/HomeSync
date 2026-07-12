import { describe, expect, it, vi } from 'vitest'
import { screen, waitFor } from '@testing-library/react'
import { http, HttpResponse } from 'msw'
import { server } from '@/test/msw/server'
import { API } from '@/test/msw/handlers'
import { buildProperty, seedSession } from '@/test/factories'
import { renderWithProviders } from '@/test/render'
import { MESSAGES } from '@/lib/messages'
import { AdminPropertiesPage } from './admin-properties-page'

function capture(method: 'post' | 'put' | 'delete', path: string) {
  const bodies: unknown[] = []
  const handler = http[method](`${API}${path}`, async ({ request }) => {
    if (method !== 'delete') bodies.push(await request.json())
    else bodies.push(request.url)
    return method === 'delete'
      ? new HttpResponse(null, { status: 204 })
      : HttpResponse.json(buildProperty({ id: 1 }), { status: method === 'post' ? 201 : 200 })
  })
  server.use(handler)
  return bodies
}

async function fillRequiredFields(user: ReturnType<typeof renderWithProviders>['user']) {
  await user.type(screen.getByLabelText(MESSAGES.adminProperties.fieldTitle), 'Casa nueva')
  await user.type(screen.getByLabelText(MESSAGES.adminProperties.fieldPrice), '150000')
  await user.type(screen.getByLabelText(MESSAGES.adminProperties.fieldZone), 'Piantini')
}

describe('AdminPropertiesPage', () => {
  it('crea una propiedad sin enviar el campo estado', async () => {
    seedSession('administrador')
    const bodies = capture('post', '/propiedades')

    const { user } = renderWithProviders(<AdminPropertiesPage />)
    await screen.findByText('Propiedad 1')

    await user.click(screen.getByRole('button', { name: MESSAGES.adminProperties.createTitle }))
    await fillRequiredFields(user)
    await user.click(screen.getByRole('button', { name: MESSAGES.actions.create }))

    await waitFor(() => {
      expect(bodies).toHaveLength(1)
    })

    expect(bodies[0]).not.toHaveProperty('estado')
    expect(bodies[0]).toMatchObject({ titulo: 'Casa nueva', precio: 150000, tipo: 'alquiler' })
  })

  it('edita una propiedad enviando el DTO completo con estado', async () => {
    seedSession('administrador')
    const bodies = capture('put', '/propiedades/:id')

    const { user } = renderWithProviders(<AdminPropertiesPage />)
    await screen.findByText('Propiedad 1')

    await user.click(
      screen.getAllByRole('button', { name: MESSAGES.actions.edit })[0] as HTMLElement,
    )

    await user.selectOptions(
      await screen.findByLabelText(MESSAGES.adminProperties.fieldState),
      'reservada',
    )
    await user.click(screen.getByRole('button', { name: MESSAGES.actions.save }))

    await waitFor(() => {
      expect(bodies).toHaveLength(1)
    })

    expect(bodies[0]).toMatchObject({ estado: 'reservada', titulo: 'Propiedad 1' })
  })

  it('bloquea el envio y no llama al servidor si el titulo excede el limite', async () => {
    seedSession('administrador')

    const requests: string[] = []
    const listener = ({ request }: { request: Request }) => {
      if (request.method !== 'GET') requests.push(request.url)
    }
    server.events.on('request:start', listener)

    const { user } = renderWithProviders(<AdminPropertiesPage />)
    await screen.findByText('Propiedad 1')

    await user.click(screen.getByRole('button', { name: MESSAGES.adminProperties.createTitle }))
    await user.type(screen.getByLabelText(MESSAGES.adminProperties.fieldTitle), 'x'.repeat(151))
    await user.type(screen.getByLabelText(MESSAGES.adminProperties.fieldPrice), '1000')
    await user.type(screen.getByLabelText(MESSAGES.adminProperties.fieldZone), 'Naco')
    await user.click(screen.getByRole('button', { name: MESSAGES.actions.create }))

    expect(await screen.findByText(MESSAGES.validation.maxLength(150))).toBeInTheDocument()
    expect(requests).toHaveLength(0)

    server.events.removeListener('request:start', listener)
  })

  it('exige un precio mayor que cero y con dos decimales como maximo', async () => {
    seedSession('administrador')

    const { user } = renderWithProviders(<AdminPropertiesPage />)
    await screen.findByText('Propiedad 1')

    await user.click(screen.getByRole('button', { name: MESSAGES.adminProperties.createTitle }))
    await user.type(screen.getByLabelText(MESSAGES.adminProperties.fieldTitle), 'Casa')
    await user.type(screen.getByLabelText(MESSAGES.adminProperties.fieldZone), 'Naco')
    await user.type(screen.getByLabelText(MESSAGES.adminProperties.fieldPrice), '100.123')
    await user.click(screen.getByRole('button', { name: MESSAGES.actions.create }))

    expect(await screen.findByText(MESSAGES.validation.priceScale)).toBeInTheDocument()
  })

  it('elimina tras confirmar', async () => {
    seedSession('administrador')
    const calls = capture('delete', '/propiedades/:id')

    const { user } = renderWithProviders(<AdminPropertiesPage />)
    await screen.findByText('Propiedad 1')

    await user.click(
      screen.getAllByRole('button', { name: MESSAGES.actions.delete })[0] as HTMLElement,
    )

    expect(await screen.findByRole('alertdialog')).toBeInTheDocument()
    await user.click(
      screen.getAllByRole('button', { name: MESSAGES.actions.delete }).at(-1) as HTMLElement,
    )

    await waitFor(() => {
      expect(calls).toHaveLength(1)
    })
  })

  it('no llama al servidor si se cancela la confirmacion', async () => {
    seedSession('administrador')

    const requests: string[] = []
    const listener = ({ request }: { request: Request }) => {
      if (request.method === 'DELETE') requests.push(request.url)
    }
    server.events.on('request:start', listener)

    const { user } = renderWithProviders(<AdminPropertiesPage />)
    await screen.findByText('Propiedad 1')

    await user.click(
      screen.getAllByRole('button', { name: MESSAGES.actions.delete })[0] as HTMLElement,
    )
    await screen.findByRole('alertdialog')
    await user.click(screen.getByRole('button', { name: MESSAGES.actions.cancel }))

    expect(requests).toHaveLength(0)
    server.events.removeListener('request:start', listener)
  })

  it('ofrece marcar como inactiva cuando el servidor rechaza el borrado', async () => {
    seedSession('administrador')

    server.use(
      http.delete(`${API}/propiedades/:id`, () =>
        HttpResponse.json({ error: 'Ocurrio un error inesperado.' }, { status: 500 }),
      ),
    )
    const puts = capture('put', '/propiedades/:id')

    const { user } = renderWithProviders(<AdminPropertiesPage />)
    await screen.findByText('Propiedad 1')

    await user.click(
      screen.getAllByRole('button', { name: MESSAGES.actions.delete })[0] as HTMLElement,
    )
    await screen.findByRole('alertdialog')
    await user.click(
      screen.getAllByRole('button', { name: MESSAGES.actions.delete }).at(-1) as HTMLElement,
    )

    expect(await screen.findByText(MESSAGES.adminProperties.deleteBlocked)).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: MESSAGES.adminProperties.markInactive }))

    await waitFor(() => {
      expect(puts).toHaveLength(1)
    })
    expect(puts[0]).toMatchObject({ estado: 'inactiva' })
  })

  it('refresca la lista aunque el borrado falle', async () => {
    seedSession('administrador')

    const listRequests: string[] = []
    server.use(
      http.get(`${API}/propiedades`, ({ request }) => {
        listRequests.push(request.url)
        return HttpResponse.json([buildProperty({ id: 1 })])
      }),
      http.delete(`${API}/propiedades/:id`, () =>
        HttpResponse.json({ error: 'boom' }, { status: 500 }),
      ),
    )

    const { user } = renderWithProviders(<AdminPropertiesPage />)
    await screen.findByText('Propiedad 1')

    const before = listRequests.length

    await user.click(
      screen.getAllByRole('button', { name: MESSAGES.actions.delete })[0] as HTMLElement,
    )
    await screen.findByRole('alertdialog')
    await user.click(
      screen.getAllByRole('button', { name: MESSAGES.actions.delete }).at(-1) as HTMLElement,
    )

    await waitFor(() => {
      expect(listRequests.length).toBeGreaterThan(before)
    })
  })
})

vi.mock('sonner', () => ({
  toast: { success: vi.fn(), error: vi.fn() },
  Toaster: () => null,
}))
