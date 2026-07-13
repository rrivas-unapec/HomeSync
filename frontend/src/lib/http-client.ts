import axios, { AxiosError, type InternalAxiosRequestConfig } from 'axios'
import { env } from '@/app/config/env'
import { readToken } from '@/features/auth/lib/session-storage'
import { authEvents } from './auth-events'
import { normalizeApiError } from './api-error'

declare module 'axios' {
  export interface AxiosRequestConfig {
    skipAuthHandling?: boolean
  }
}

export const httpClient = axios.create({
  baseURL: env.apiBaseUrl,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
})

httpClient.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  if (config.skipAuthHandling === true) return config

  const token = readToken()
  if (token !== null) {
    config.headers.set('Authorization', `Bearer ${token}`)
  }
  return config
})

httpClient.interceptors.response.use(
  (response) => response,
  (error: unknown) => {
    if (!(error instanceof AxiosError)) {
      return Promise.reject(normalizeApiError(undefined, undefined, false))
    }

    const status = error.response?.status
    const body: unknown = error.response?.data
    const isCredentialsCheck = error.config?.skipAuthHandling === true

    const apiError = normalizeApiError(status, body, isCredentialsCheck)

    if (apiError.kind === 'unauthorized') {
      authEvents.emitUnauthorized()
    }

    return Promise.reject(apiError)
  },
)
