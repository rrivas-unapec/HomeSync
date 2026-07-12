import { afterEach, describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ThemeProvider } from '@/app/providers/theme-provider'
import { THEME_STORAGE_KEY } from '@/app/providers/theme-context'
import { MESSAGES } from '@/lib/messages'
import { ThemeToggle } from './theme-toggle'

function mockSystemPrefersDark(prefersDark: boolean) {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: (query: string) => ({
      matches: query.includes('prefers-color-scheme: dark') ? prefersDark : false,
      media: query,
      onchange: null,
      addEventListener: () => {},
      removeEventListener: () => {},
      dispatchEvent: () => false,
    }),
  })
}

function renderToggle() {
  return render(
    <ThemeProvider>
      <ThemeToggle />
    </ThemeProvider>,
  )
}

afterEach(() => {
  document.documentElement.classList.remove('dark')
  window.localStorage.clear()
  vi.restoreAllMocks()
})

describe('ThemeToggle', () => {
  it('sigue la preferencia del sistema cuando no hay eleccion guardada', () => {
    mockSystemPrefersDark(true)
    renderToggle()

    expect(document.documentElement).toHaveClass('dark')
    expect(screen.getByRole('radio', { name: MESSAGES.theme.system })).toHaveAttribute(
      'aria-checked',
      'true',
    )
  })

  it('no aplica el tema oscuro si el sistema prefiere claro', () => {
    mockSystemPrefersDark(false)
    renderToggle()

    expect(document.documentElement).not.toHaveClass('dark')
  })

  it('activa el tema oscuro y lo persiste al elegirlo', async () => {
    mockSystemPrefersDark(false)
    const user = userEvent.setup()
    renderToggle()

    await user.click(screen.getByRole('radio', { name: MESSAGES.theme.dark }))

    expect(document.documentElement).toHaveClass('dark')
    expect(window.localStorage.getItem(THEME_STORAGE_KEY)).toBe('dark')
  })

  it('vuelve al tema claro y lo persiste', async () => {
    mockSystemPrefersDark(true)
    const user = userEvent.setup()
    renderToggle()

    await user.click(screen.getByRole('radio', { name: MESSAGES.theme.light }))

    expect(document.documentElement).not.toHaveClass('dark')
    expect(window.localStorage.getItem(THEME_STORAGE_KEY)).toBe('light')
  })

  it('restaura la eleccion guardada por encima del sistema', () => {
    window.localStorage.setItem(THEME_STORAGE_KEY, 'dark')
    mockSystemPrefersDark(false)

    renderToggle()

    expect(document.documentElement).toHaveClass('dark')
  })

  it('ignora un valor corrupto en el almacenamiento', () => {
    window.localStorage.setItem(THEME_STORAGE_KEY, 'arcoiris')
    mockSystemPrefersDark(false)

    renderToggle()

    expect(screen.getByRole('radio', { name: MESSAGES.theme.system })).toHaveAttribute(
      'aria-checked',
      'true',
    )
  })

  it('expone el control como un radiogroup accesible', () => {
    mockSystemPrefersDark(false)
    renderToggle()

    expect(screen.getByRole('radiogroup', { name: MESSAGES.theme.label })).toBeInTheDocument()
    expect(screen.getAllByRole('radio')).toHaveLength(3)
  })

  it('sincroniza la meta theme-color con el tema activo', async () => {
    const meta = document.createElement('meta')
    meta.setAttribute('name', 'theme-color')
    document.head.appendChild(meta)

    mockSystemPrefersDark(false)
    const user = userEvent.setup()
    renderToggle()

    await user.click(screen.getByRole('radio', { name: MESSAGES.theme.dark }))
    expect(meta.getAttribute('content')).toBe('#0b0b0d')

    await user.click(screen.getByRole('radio', { name: MESSAGES.theme.light }))
    expect(meta.getAttribute('content')).toBe('#f5f5f5')

    meta.remove()
  })
})
