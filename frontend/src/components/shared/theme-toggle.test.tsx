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
  })

  it('no aplica el tema oscuro si el sistema prefiere claro', () => {
    mockSystemPrefersDark(false)
    renderToggle()

    expect(document.documentElement).not.toHaveClass('dark')
  })

  it('en tema claro ofrece cambiar a oscuro', () => {
    mockSystemPrefersDark(false)
    renderToggle()

    const button = screen.getByRole('button', { name: MESSAGES.theme.switchToDark })
    expect(button).toHaveAttribute('aria-pressed', 'false')
  })

  it('en tema oscuro ofrece cambiar a claro', () => {
    mockSystemPrefersDark(true)
    renderToggle()

    const button = screen.getByRole('button', { name: MESSAGES.theme.switchToLight })
    expect(button).toHaveAttribute('aria-pressed', 'true')
  })

  it('alterna a oscuro y lo persiste', async () => {
    mockSystemPrefersDark(false)
    const user = userEvent.setup()
    renderToggle()

    await user.click(screen.getByRole('button', { name: MESSAGES.theme.switchToDark }))

    expect(document.documentElement).toHaveClass('dark')
    expect(window.localStorage.getItem(THEME_STORAGE_KEY)).toBe('dark')
    expect(screen.getByRole('button', { name: MESSAGES.theme.switchToLight })).toBeInTheDocument()
  })

  it('alterna de vuelta a claro y lo persiste', async () => {
    mockSystemPrefersDark(true)
    const user = userEvent.setup()
    renderToggle()

    await user.click(screen.getByRole('button', { name: MESSAGES.theme.switchToLight }))

    expect(document.documentElement).not.toHaveClass('dark')
    expect(window.localStorage.getItem(THEME_STORAGE_KEY)).toBe('light')
  })

  it('restaura la eleccion guardada por encima del sistema', () => {
    window.localStorage.setItem(THEME_STORAGE_KEY, 'dark')
    mockSystemPrefersDark(false)

    renderToggle()

    expect(document.documentElement).toHaveClass('dark')
  })

  it('ignora un valor corrupto en el almacenamiento y sigue al sistema', () => {
    window.localStorage.setItem(THEME_STORAGE_KEY, 'arcoiris')
    mockSystemPrefersDark(true)

    renderToggle()

    expect(document.documentElement).toHaveClass('dark')
  })

  it('sincroniza la meta theme-color con el tema activo', async () => {
    const meta = document.createElement('meta')
    meta.setAttribute('name', 'theme-color')
    document.head.appendChild(meta)

    mockSystemPrefersDark(false)
    const user = userEvent.setup()
    renderToggle()

    await user.click(screen.getByRole('button', { name: MESSAGES.theme.switchToDark }))
    expect(meta.getAttribute('content')).toBe('#0b0b0d')

    await user.click(screen.getByRole('button', { name: MESSAGES.theme.switchToLight }))
    expect(meta.getAttribute('content')).toBe('#f5f5f5')

    meta.remove()
  })
})
