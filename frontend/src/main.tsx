import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router'
import { Toaster } from 'sonner'
import { AppRoutes } from './app/router/app-routes'
import { AuthProvider } from './app/providers/auth-provider'
import { QueryProvider } from './app/providers/query-provider'
import './styles/index.css'

const container = document.getElementById('root')

if (container === null) {
  throw new Error('No se encontro el elemento raiz de la aplicacion.')
}

createRoot(container).render(
  <StrictMode>
    <QueryProvider>
      <BrowserRouter>
        <AuthProvider>
          <AppRoutes />
          <Toaster position="bottom-right" toastOptions={{ className: 'text-sm' }} />
        </AuthProvider>
      </BrowserRouter>
    </QueryProvider>
  </StrictMode>,
)
