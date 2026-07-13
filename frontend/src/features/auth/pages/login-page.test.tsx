import { describe, expect, it, vi } from 'vitest'
import { screen, waitFor } from '@testing-library/react'
import { http, HttpResponse, delay } from 'msw'
import { server } from '@/test/msw/server'
import { API } from '@/test/msw/handlers'
import { renderWithProviders } from '@/test/render'
import { MESSAGES } from '@/lib/messages'
import { LoginPage } from './login-page'

const KEY = 'homesync.session'

async function fillCredentials(user: ReturnType<typeof renderWithProviders>['user']) {
  await user.type(screen.getByLabelText(MESSAGES.auth.emailLabel), 'admin@homesync.do')
  await user.type(screen.getByLabelText(MESSAGES.auth.passwordLabel), 'Admin123*')
}

describe('LoginPage', () => {
  it('guarda la sesion y redirige al panel tras un login exitoso', async () => {
    const { user } = renderWithProviders(<LoginPage />, { route: '/login', path: '/login' })

    await fillCredentials(user)
    await user.click(screen.getByRole('button', { name: MESSAGES.actions.signIn }))

    await waitFor(() => {
      expect(window.localStorage.getItem(KEY)).not.toBeNull()
    })
    await waitFor(() => {
      expect(screen.getByTestId('location')).toHaveTextContent('/admin/propiedades')
    })
  })

  it('muestra el error de credenciales sin cerrar sesion ni redirigir', async () => {
    server.use(
      http.post(`${API}/auth/login`, () =>
        HttpResponse.json({ error: 'Correo o contrasena invalidos.' }, { status: 401 }),
      ),
    )

    const { user } = renderWithProviders(<LoginPage />, { route: '/login', path: '/login' })

    await fillCredentials(user)
    await user.click(screen.getByRole('button', { name: MESSAGES.actions.signIn }))

    expect(await screen.findByRole('alert')).toHaveTextContent(MESSAGES.errors.invalidCredentials)
    expect(screen.getByTestId('location')).toHaveTextContent('/login')
    expect(window.localStorage.getItem(KEY)).toBeNull()
  })

  it('deshabilita el boton mientras se envia', async () => {
    server.use(
      http.post(`${API}/auth/login`, async () => {
        await delay(100)
        return HttpResponse.json({ error: 'x' }, { status: 401 })
      }),
    )

    const { user } = renderWithProviders(<LoginPage />, { route: '/login', path: '/login' })

    await fillCredentials(user)
    await user.click(screen.getByRole('button', { name: MESSAGES.actions.signIn }))

    const submitting = await screen.findByRole('button', { name: MESSAGES.auth.submitting })
    expect(submitting).toBeDisabled()
  })

  it('valida en el cliente y no envia ninguna peticion con el formulario vacio', async () => {
    const onRequest = vi.fn()
    server.events.on('request:start', onRequest)

    const { user } = renderWithProviders(<LoginPage />, { route: '/login', path: '/login' })

    await user.click(screen.getByRole('button', { name: MESSAGES.actions.signIn }))

    expect(await screen.findAllByText(MESSAGES.validation.required)).not.toHaveLength(0)
    expect(onRequest).not.toHaveBeenCalled()

    server.events.removeListener('request:start', onRequest)
  })

  it('respeta un returnUrl interno', async () => {
    const { user } = renderWithProviders(<LoginPage />, {
      route: '/login?returnUrl=%2Fadmin%2Fclientes',
      path: '/login',
    })

    await fillCredentials(user)
    await user.click(screen.getByRole('button', { name: MESSAGES.actions.signIn }))

    await waitFor(() => {
      expect(screen.getByTestId('location')).toHaveTextContent('/admin/clientes')
    })
  })

  it('ignora un returnUrl que apunta a otro dominio', async () => {
    const { user } = renderWithProviders(<LoginPage />, {
      route: '/login?returnUrl=https%3A%2F%2Fevil.com',
      path: '/login',
    })

    await fillCredentials(user)
    await user.click(screen.getByRole('button', { name: MESSAGES.actions.signIn }))

    await waitFor(() => {
      expect(screen.getByTestId('location')).toHaveTextContent('/admin/propiedades')
    })
  })
})
