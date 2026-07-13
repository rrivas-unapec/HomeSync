import { describe, expect, it } from 'vitest'
import { screen } from '@testing-library/react'
import { Route, Routes } from 'react-router'
import { renderTree } from '@/test/render'
import { seedSession } from '@/test/factories'
import { ForbiddenPage } from '@/components/shared/status-pages'
import { MESSAGES } from '@/lib/messages'
import { RequireAuth, RequireRole } from './guards'

function ProtectedTree() {
  return (
    <Routes>
      <Route path="/login" element={<p>{MESSAGES.auth.title}</p>} />
      <Route path="/403" element={<ForbiddenPage />} />
      <Route element={<RequireAuth />}>
        <Route element={<RequireRole role="administrador" />}>
          <Route path="/admin/propiedades" element={<p>Panel de propiedades</p>} />
        </Route>
      </Route>
    </Routes>
  )
}

const KEY = 'homesync.session'

describe('guards', () => {
  it('envia al login a un visitante anonimo y conserva el returnUrl', () => {
    renderTree(<ProtectedTree />, '/admin/propiedades')

    expect(screen.getByText(MESSAGES.auth.title)).toBeInTheDocument()
    expect(screen.getByTestId('location')).toHaveTextContent(
      '/login?returnUrl=%2Fadmin%2Fpropiedades',
    )
  })

  it('muestra 403 a un cliente autenticado sin cerrarle la sesion', () => {
    seedSession('cliente')

    renderTree(<ProtectedTree />, '/admin/propiedades')

    expect(screen.getByText(MESSAGES.forbidden.title)).toBeInTheDocument()
    expect(screen.getByTestId('location')).toHaveTextContent('/403')
    expect(window.localStorage.getItem(KEY)).not.toBeNull()
  })

  it('deja pasar al administrador', () => {
    seedSession('administrador')

    renderTree(<ProtectedTree />, '/admin/propiedades')

    expect(screen.getByText('Panel de propiedades')).toBeInTheDocument()
  })

  it('trata como anonima una sesion expirada y la borra', () => {
    window.localStorage.setItem(
      KEY,
      JSON.stringify({
        token: 'viejo',
        expiresAt: '2020-01-01T00:00:00Z',
        user: {
          id: 1,
          nombre: 'Admin',
          correo: 'a@b.com',
          rol: 'administrador',
          fechaCreacion: '2020-01-01T00:00:00Z',
        },
      }),
    )

    renderTree(<ProtectedTree />, '/admin/propiedades')

    expect(screen.getByText(MESSAGES.auth.title)).toBeInTheDocument()
    expect(window.localStorage.getItem(KEY)).toBeNull()
  })
})
