import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router'
import { AppRoutes } from './app/router/app-routes'
import { AuthProvider } from './app/providers/auth-provider'
import { QueryProvider } from './app/providers/query-provider'
import { ThemeProvider } from './app/providers/theme-provider'
import { AppToaster } from './components/shared/app-toaster'
import './styles/index.css'

const container = document.getElementById('root')

if (container === null) {
  throw new Error('No se encontro el elemento raiz de la aplicacion.')
}

createRoot(container).render(
  <StrictMode>
    <ThemeProvider>
      <QueryProvider>
        <BrowserRouter>
          <AuthProvider>
            <AppRoutes />
            <AppToaster />
          </AuthProvider>
        </BrowserRouter>
      </QueryProvider>
    </ThemeProvider>
  </StrictMode>,
)
