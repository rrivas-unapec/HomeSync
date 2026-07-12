import type { FieldValues, Path, UseFormSetError } from 'react-hook-form'
import { isApiError } from './api-error'

export function applyApiErrorToForm<T extends FieldValues>(
  error: unknown,
  setError: UseFormSetError<T>,
  knownFields: readonly Path<T>[],
): string | null {
  if (!isApiError(error)) return null

  const fieldErrors = error.fieldErrors
  if (fieldErrors === undefined) return error.message

  const unmatched: string[] = []
  let matchedAny = false

  for (const [field, messages] of Object.entries(fieldErrors)) {
    const message = messages[0]
    if (message === undefined) continue

    if ((knownFields as readonly string[]).includes(field)) {
      setError(field as Path<T>, { type: 'server', message })
      matchedAny = true
    } else {
      unmatched.push(message)
    }
  }

  if (unmatched.length > 0) return unmatched.join(' ')
  return matchedAny ? null : error.message
}
