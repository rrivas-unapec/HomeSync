import { httpClient } from '@/lib/http-client'
import type { AuditEntry } from '../types/audit'

export async function fetchAuditEntries(): Promise<AuditEntry[]> {
  const { data } = await httpClient.get<AuditEntry[]>('/auditoria')
  return data
}
