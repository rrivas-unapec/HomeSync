export function safeReturnUrl(value: string | null): string | null {
  if (value === null || value.length === 0) return null
  if (!value.startsWith('/')) return null
  if (value.startsWith('//')) return null
  if (value.startsWith('/\\')) return null
  return value
}
