import { describe, expect, it, vi } from 'vitest'
import { screen, waitFor, within } from '@testing-library/react'
import { http, HttpResponse } from 'msw'
import { server } from '@/test/msw/server'
import { API } from '@/test/msw/handlers'
import { buildProperty } from '@/test/factories'
import { renderWithProviders } from '@/test/render'
import { MESSAGES } from '@/lib/messages'
import { CatalogPage } from './catalog-page'

function trackRequests() {
  const urls: string[] = []
  const listener = ({ request }: { request: Request }) => {
    urls.push(request.url)
  }
  server.events.on('request:start', listener)
  return {
    urls,
    stop: () => {
      server.events.removeListener('request:start', listener)
    },
  }
}

describe('CatalogPage', () => {
  it('muestra esqueletos y luego las propiedades', async () => {
    renderWithProviders(<CatalogPage />)

    expect(screen.getAllByTestId('property-skeleton')).toHaveLength(12)

    expect(await screen.findByText('Propiedad 1')).toBeInTheDocument()
    expect(screen.queryAllByTestId('property-skeleton')).toHaveLength(0)
  })

  it('muestra el estado vacio con accion de limpiar filtros', async () => {
    server.use(http.get(`${API}/propiedades`, () => HttpResponse.json([])))

    const { user } = renderWithProviders(<CatalogPage />, { route: '/?zona=Inexistente' })

    expect(await screen.findByText(MESSAGES.catalog.empty)).toBeInTheDocument()

    const clearButtons = screen.getAllByRole('button', { name: MESSAGES.actions.clearFilters })
    expect(clearButtons.length).toBeGreaterThan(0)

    await user.click(clearButtons.at(-1) as HTMLElement)

    await waitFor(() => {
      expect(screen.getByTestId('location')).not.toHaveTextContent('zona=')
    })
  })

  it('muestra el estado de error y permite reintentar', async () => {
    server.use(
      http.get(`${API}/propiedades`, () => HttpResponse.json({ error: 'boom' }, { status: 500 })),
    )

    const { user } = renderWithProviders(<CatalogPage />)

    expect(await screen.findByText(MESSAGES.catalog.error)).toBeInTheDocument()

    const tracker = trackRequests()
    await user.click(screen.getByRole('button', { name: MESSAGES.actions.retry }))
    await waitFor(() => {
      expect(tracker.urls.length).toBeGreaterThan(0)
    })
    tracker.stop()
  })

  it('oculta del catalogo publico las propiedades inactivas', async () => {
    server.use(
      http.get(`${API}/propiedades`, () =>
        HttpResponse.json([
          buildProperty({ id: 1, titulo: 'Visible', estado: 'disponible' }),
          buildProperty({ id: 2, titulo: 'Oculta', estado: 'inactiva' }),
        ]),
      ),
    )

    renderWithProviders(<CatalogPage />)

    expect(await screen.findByText('Visible')).toBeInTheDocument()
    expect(screen.queryByText('Oculta')).not.toBeInTheDocument()
  })

  it('deshabilita agendar en una propiedad reservada', async () => {
    server.use(
      http.get(`${API}/propiedades`, () =>
        HttpResponse.json([buildProperty({ id: 1, titulo: 'Villa Bahia', estado: 'reservada' })]),
      ),
    )

    renderWithProviders(<CatalogPage />)

    await screen.findByText('Villa Bahia')
    expect(screen.getByRole('button', { name: MESSAGES.actions.scheduleVisit })).toBeDisabled()
  })

  it('sincroniza el filtro de zona con la URL usando debounce', async () => {
    vi.useFakeTimers({ shouldAdvanceTime: true })

    const { user } = renderWithProviders(<CatalogPage />)
    await screen.findByText('Propiedad 1')

    const tracker = trackRequests()

    await user.type(screen.getByLabelText(MESSAGES.catalog.filterZone), 'Bavaro')

    await vi.advanceTimersByTimeAsync(400)

    await waitFor(() => {
      expect(screen.getByTestId('location')).toHaveTextContent('zona=Bavaro')
    })

    const zoneRequests = tracker.urls.filter((url) => url.includes('zona='))
    expect(zoneRequests).toHaveLength(1)
    expect(zoneRequests[0]).toContain('zona=Bavaro')

    tracker.stop()
    vi.useRealTimers()
  })

  it('envia al servidor solo los filtros que soporta, nunca pagina ni orden', async () => {
    const tracker = trackRequests()

    renderWithProviders(<CatalogPage />, {
      route: '/?tipo=venta&precioMinimo=1000&pagina=2&orden=precioDesc',
    })

    await waitFor(() => {
      expect(tracker.urls.length).toBeGreaterThan(0)
    })

    const url = tracker.urls[0] ?? ''
    expect(url).toContain('tipo=venta')
    expect(url).toContain('precioMinimo=1000')
    expect(url).not.toContain('pagina')
    expect(url).not.toContain('orden')

    tracker.stop()
  })

  it('pagina en el cliente sin volver a pedir datos al servidor', async () => {
    server.use(
      http.get(`${API}/propiedades`, () =>
        HttpResponse.json(
          Array.from({ length: 20 }, (_, index) => buildProperty({ id: index + 1 })),
        ),
      ),
    )

    const { user } = renderWithProviders(<CatalogPage />)
    await screen.findByText('Propiedad 1')

    const grid = screen.getAllByRole('article')
    expect(grid).toHaveLength(12)

    const tracker = trackRequests()
    await user.click(screen.getByRole('button', { name: MESSAGES.actions.next }))

    await waitFor(() => {
      expect(screen.getByTestId('location')).toHaveTextContent('pagina=2')
    })
    expect(screen.getAllByRole('article')).toHaveLength(8)
    expect(tracker.urls).toHaveLength(0)

    tracker.stop()
  })

  it('ordena en el cliente sin volver a pedir datos al servidor', async () => {
    server.use(
      http.get(`${API}/propiedades`, () =>
        HttpResponse.json([
          buildProperty({ id: 1, titulo: 'Barata', precio: 100 }),
          buildProperty({ id: 2, titulo: 'Cara', precio: 900 }),
        ]),
      ),
    )

    const { user } = renderWithProviders(<CatalogPage />)
    await screen.findByText('Barata')

    const tracker = trackRequests()
    await user.selectOptions(
      screen.getByLabelText(MESSAGES.catalog.sortLabel),
      MESSAGES.catalog.sortPriceDesc,
    )

    await waitFor(() => {
      expect(screen.getByTestId('location')).toHaveTextContent('orden=precioDesc')
    })

    const first = screen.getAllByRole('article')[0]
    expect(within(first as HTMLElement).getByText('Cara')).toBeInTheDocument()
    expect(tracker.urls).toHaveLength(0)

    tracker.stop()
  })

  it('no falla con parametros de URL corruptos', async () => {
    renderWithProviders(<CatalogPage />, { route: '/?precioMinimo=abc&pagina=-4&orden=xyz' })

    expect(await screen.findByText('Propiedad 1')).toBeInTheDocument()
  })
})
