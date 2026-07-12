const LOCALE = 'es-DO'

const currencyFormatter = new Intl.NumberFormat(LOCALE, {
  style: 'currency',
  currency: 'DOP',
  maximumFractionDigits: 0,
})

const numberFormatter = new Intl.NumberFormat(LOCALE)

const percentFormatter = new Intl.NumberFormat(LOCALE, {
  style: 'percent',
  maximumFractionDigits: 1,
})

const dateFormatter = new Intl.DateTimeFormat(LOCALE, {
  day: '2-digit',
  month: 'short',
  year: 'numeric',
})

const dateTimeFormatter = new Intl.DateTimeFormat(LOCALE, {
  day: '2-digit',
  month: 'short',
  year: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
})

export function formatCurrency(value: number): string {
  return currencyFormatter.format(value)
}

export function formatNumber(value: number): string {
  return numberFormatter.format(value)
}

export function formatPercent(fraction: number): string {
  return percentFormatter.format(fraction)
}

export function todayAsIsoDate(): string {
  const now = new Date()
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const day = String(now.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

export function isIsoDateInPast(isoDate: string): boolean {
  return isoDate < todayAsIsoDate()
}

export function formatIsoDate(isoDate: string): string {
  const [year, month, day] = isoDate.split('-').map(Number)
  if (year === undefined || month === undefined || day === undefined) return isoDate
  return dateFormatter.format(new Date(year, month - 1, day))
}

export function formatTimestamp(value: string): string {
  const parsed = new Date(normalizeToUtc(value))
  if (Number.isNaN(parsed.getTime())) return value
  return dateTimeFormatter.format(parsed)
}

function normalizeToUtc(value: string): string {
  const hasZone = /(?:Z|[+-]\d{2}:?\d{2})$/.test(value)
  return hasZone ? value : `${value}Z`
}
