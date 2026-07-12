import { render, type RenderResult } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import type { UserEvent } from '@testing-library/user-event'
import { QueryClientProvider } from '@tanstack/react-query'
import { MemoryRouter, Route, Routes, useLocation } from 'react-router'
import { createQueryClient } from '@/lib/query-client'
import { AuthProvider } from '@/app/providers/auth-provider'

export function LocationProbe() {
  const location = useLocation()
  return <span data-testid="location">{`${location.pathname}${location.search}`}</span>
}

interface RenderOptions {
  route?: string
  path?: string
}

interface RenderWithProvidersResult extends RenderResult {
  user: UserEvent
}

export function renderWithProviders(
  ui: React.ReactElement,
  { route = '/', path = '*' }: RenderOptions = {},
): RenderWithProvidersResult {
  const client = createQueryClient()
  client.setDefaultOptions({ queries: { retry: false, gcTime: 0 } })

  const result = render(
    <QueryClientProvider client={client}>
      <MemoryRouter initialEntries={[route]}>
        <AuthProvider>
          <LocationProbe />
          <Routes>
            <Route path={path} element={ui} />
          </Routes>
        </AuthProvider>
      </MemoryRouter>
    </QueryClientProvider>,
  )

  return { ...result, user: userEvent.setup() }
}

export function renderTree(ui: React.ReactElement, route = '/'): RenderWithProvidersResult {
  const client = createQueryClient()
  client.setDefaultOptions({ queries: { retry: false, gcTime: 0 } })

  const result = render(
    <QueryClientProvider client={client}>
      <MemoryRouter initialEntries={[route]}>
        <AuthProvider>
          <LocationProbe />
          {ui}
        </AuthProvider>
      </MemoryRouter>
    </QueryClientProvider>,
  )

  return { ...result, user: userEvent.setup() }
}
