import { MESSAGES } from './messages'

export type ApiErrorKind =
  | 'validation'
  | 'invalid_credentials'
  | 'unauthorized'
  | 'forbidden'
  | 'not_found'
  | 'server'
  | 'network'

export type FieldErrors = Record<string, string[]>

export class ApiError extends Error {
  readonly status: number
  readonly kind: ApiErrorKind
  readonly fieldErrors?: FieldErrors

  constructor(status: number, kind: ApiErrorKind, message: string, fieldErrors?: FieldErrors) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.kind = kind
    this.fieldErrors = fieldErrors
  }
}

type BusinessErrorBody = { error: string }
type ProblemDetailsBody = { errors: Record<string, string[]> }

function isBusinessErrorBody(body: unknown): body is BusinessErrorBody {
  return (
    typeof body === 'object' &&
    body !== null &&
    'error' in body &&
    typeof (body as { error: unknown }).error === 'string'
  )
}

function isProblemDetailsBody(body: unknown): body is ProblemDetailsBody {
  if (typeof body !== 'object' || body === null || !('errors' in body)) return false
  const errors = (body as { errors: unknown }).errors
  return typeof errors === 'object' && errors !== null && !Array.isArray(errors)
}

export function normalizeFieldKey(key: string): string {
  const withoutRoot = key.replace(/^\$\.?/, '')
  const lastSegment = withoutRoot.split('.').pop() ?? withoutRoot
  const withoutIndex = lastSegment.replace(/\[\d+\]$/, '')
  if (withoutIndex.length === 0) return '_root'
  return withoutIndex.charAt(0).toLowerCase() + withoutIndex.slice(1)
}

function toFieldErrors(raw: Record<string, unknown>): FieldErrors {
  const result: FieldErrors = {}
  for (const [key, value] of Object.entries(raw)) {
    const normalized = normalizeFieldKey(key)
    const messages = Array.isArray(value)
      ? value.filter((m): m is string => typeof m === 'string')
      : []
    const existing = result[normalized] ?? []
    result[normalized] = [...existing, ...messages]
  }
  return result
}

export function normalizeApiError(
  status: number | undefined,
  body: unknown,
  isCredentialsCheck: boolean,
): ApiError {
  if (status === undefined) {
    return new ApiError(0, 'network', MESSAGES.errors.network)
  }

  if (status === 401) {
    if (isCredentialsCheck) {
      return new ApiError(401, 'invalid_credentials', MESSAGES.errors.invalidCredentials)
    }
    return new ApiError(401, 'unauthorized', MESSAGES.errors.unauthorized)
  }

  if (status === 403) {
    return new ApiError(403, 'forbidden', MESSAGES.errors.forbidden)
  }

  if (isProblemDetailsBody(body)) {
    const fieldErrors = toFieldErrors(body.errors)
    return new ApiError(status, 'validation', MESSAGES.errors.unknown, fieldErrors)
  }

  if (isBusinessErrorBody(body)) {
    if (status === 404) {
      return new ApiError(404, 'not_found', body.error)
    }
    if (status >= 500) {
      return new ApiError(status, 'server', MESSAGES.errors.server)
    }
    return new ApiError(status, 'validation', body.error)
  }

  if (status === 404) {
    return new ApiError(404, 'not_found', MESSAGES.errors.notFound)
  }

  if (status >= 500) {
    return new ApiError(status, 'server', MESSAGES.errors.server)
  }

  return new ApiError(status, 'validation', MESSAGES.errors.unknown)
}

export function isApiError(error: unknown): error is ApiError {
  return error instanceof ApiError
}
