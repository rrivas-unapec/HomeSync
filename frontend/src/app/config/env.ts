interface AppEnv {
  readonly VITE_API_BASE_URL?: string
}

const source = import.meta.env as AppEnv
const rawBaseUrl = source.VITE_API_BASE_URL

export const env = {
  apiBaseUrl: typeof rawBaseUrl === 'string' && rawBaseUrl.length > 0 ? rawBaseUrl : '/api',
} as const
