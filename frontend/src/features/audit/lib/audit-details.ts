import { PROPERTY_STATE_LABELS, PROPERTY_TYPE_LABELS } from '@/lib/domain'
import { formatCurrency, formatNumber } from '@/lib/format'
import { MESSAGES } from '@/lib/messages'

export interface AuditField {
  key: string
  label: string
  value: string
  isLink: boolean
  isEmpty: boolean
}

const FIELD_ORDER = [
  'Titulo',
  'Tipo',
  'Estado',
  'Precio',
  'UbicacionZona',
  'Habitaciones',
  'Banos',
  'Parqueos',
  'Descripcion',
  'FotoUrl',
] as const

const FIELD_LABELS: Record<string, string> = {
  Titulo: MESSAGES.adminProperties.fieldTitle,
  Tipo: MESSAGES.adminProperties.fieldType,
  Estado: MESSAGES.adminProperties.fieldState,
  Precio: MESSAGES.adminProperties.fieldPrice,
  UbicacionZona: MESSAGES.adminProperties.fieldZone,
  Habitaciones: MESSAGES.adminProperties.fieldBedrooms,
  Banos: MESSAGES.adminProperties.fieldBathrooms,
  Parqueos: MESSAGES.adminProperties.fieldParking,
  Descripcion: MESSAGES.adminProperties.fieldDescription,
  FotoUrl: MESSAGES.adminProperties.fieldPhotoUrl,
}

const SUMMARY_FIELDS = ['Tipo', 'Estado', 'Precio', 'UbicacionZona'] as const

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function formatValue(key: string, raw: unknown): string {
  if (raw === null || raw === undefined || raw === '') return MESSAGES.adminAudit.noValue

  if (key === 'Precio' && typeof raw === 'number') return formatCurrency(raw)

  if (key === 'Tipo' && typeof raw === 'string' && raw in PROPERTY_TYPE_LABELS) {
    return PROPERTY_TYPE_LABELS[raw as keyof typeof PROPERTY_TYPE_LABELS]
  }

  if (key === 'Estado' && typeof raw === 'string' && raw in PROPERTY_STATE_LABELS) {
    return PROPERTY_STATE_LABELS[raw as keyof typeof PROPERTY_STATE_LABELS]
  }

  if (typeof raw === 'number') return formatNumber(raw)
  if (typeof raw === 'boolean') return raw ? MESSAGES.adminAudit.yes : MESSAGES.adminAudit.no
  if (typeof raw === 'string') return raw

  return JSON.stringify(raw)
}

export function parseAuditDetails(details: string | null): AuditField[] {
  if (details === null || details.trim().length === 0) return []

  let parsed: unknown
  try {
    parsed = JSON.parse(details)
  } catch {
    return []
  }

  if (!isRecord(parsed)) return []

  const known = FIELD_ORDER.filter((key) => key in parsed)
  const extra = Object.keys(parsed).filter(
    (key) => !(FIELD_ORDER as readonly string[]).includes(key),
  )

  return [...known, ...extra].map((key) => {
    const raw = parsed[key]
    const isEmpty = raw === null || raw === undefined || raw === ''
    return {
      key,
      label: FIELD_LABELS[key] ?? key,
      value: formatValue(key, raw),
      isLink: key === 'FotoUrl' && typeof raw === 'string' && raw.startsWith('http'),
      isEmpty,
    }
  })
}

export function summarizeAuditDetails(fields: readonly AuditField[]): AuditField[] {
  return fields.filter(
    (field) => (SUMMARY_FIELDS as readonly string[]).includes(field.key) && !field.isEmpty,
  )
}

export function titleFromAuditDetails(fields: readonly AuditField[]): string | null {
  const titulo = fields.find((field) => field.key === 'Titulo')
  if (titulo === undefined || titulo.isEmpty) return null
  return titulo.value
}
