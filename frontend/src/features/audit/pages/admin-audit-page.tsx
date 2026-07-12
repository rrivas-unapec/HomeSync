import { useQuery } from '@tanstack/react-query'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import {
  TableBody,
  TableCell,
  TableHead,
  TableHeaderCell,
  TableRow,
  TableWrapper,
} from '@/components/ui/table'
import { EmptyState, ErrorState, PageHeader } from '@/components/shared/states'
import { httpClient } from '@/lib/http-client'
import { AUDIT_ACTION_LABELS, type AuditAction } from '@/lib/domain'
import { formatTimestamp } from '@/lib/format'
import { MESSAGES } from '@/lib/messages'
import { queryKeys } from '@/lib/query-keys'

interface AuditEntry {
  id: number
  propiedadId: number
  propiedadTitulo: string | null
  usuarioId: number | null
  usuarioNombre: string | null
  accion: AuditAction
  detallesCambio: string | null
  fechaOperacion: string
}

async function fetchAudit(): Promise<AuditEntry[]> {
  const { data } = await httpClient.get<AuditEntry[]>('/auditoria')
  return data
}

function toneFor(action: AuditAction): 'neutral' | 'outline' | 'danger' {
  if (action === 'ELIMINACION') return 'danger'
  if (action === 'EDICION') return 'outline'
  return 'neutral'
}

export function AdminAuditPage() {
  const query = useQuery({
    queryKey: queryKeys.audit.list(),
    queryFn: fetchAudit,
  })

  return (
    <>
      <PageHeader title={MESSAGES.adminAudit.title} />

      <div className="px-6 py-8 md:px-8">
        {query.isPending ? (
          <Skeleton className="h-64 w-full" />
        ) : query.isError ? (
          <ErrorState
            message={MESSAGES.adminAudit.error}
            onRetry={() => {
              void query.refetch()
            }}
          />
        ) : query.data.length === 0 ? (
          <EmptyState message={MESSAGES.adminAudit.empty} />
        ) : (
          <TableWrapper>
            <TableHead>
              <TableHeaderCell numeric>{MESSAGES.table.id}</TableHeaderCell>
              <TableHeaderCell>{MESSAGES.table.action}</TableHeaderCell>
              <TableHeaderCell>{MESSAGES.table.property}</TableHeaderCell>
              <TableHeaderCell>{MESSAGES.table.user}</TableHeaderCell>
              <TableHeaderCell>{MESSAGES.adminAudit.details}</TableHeaderCell>
              <TableHeaderCell>{MESSAGES.table.date}</TableHeaderCell>
            </TableHead>
            <TableBody>
              {query.data.map((entry) => (
                <TableRow key={entry.id}>
                  <TableCell numeric className="text-muted-foreground">
                    {entry.id}
                  </TableCell>
                  <TableCell>
                    <Badge tone={toneFor(entry.accion)}>{AUDIT_ACTION_LABELS[entry.accion]}</Badge>
                  </TableCell>
                  <TableCell className="max-w-xs">
                    {entry.propiedadTitulo !== null ? (
                      <span className="line-clamp-2">{entry.propiedadTitulo}</span>
                    ) : (
                      <span className="text-muted-foreground">
                        {MESSAGES.adminAudit.deletedProperty}
                        <span className="tabular-nums"> #{entry.propiedadId}</span>
                      </span>
                    )}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {entry.usuarioNombre ?? MESSAGES.adminAudit.systemUser}
                  </TableCell>
                  <TableCell className="max-w-sm">
                    <span
                      className="line-clamp-2 font-mono text-xs text-muted-foreground"
                      title={entry.detallesCambio ?? undefined}
                    >
                      {entry.detallesCambio ?? MESSAGES.table.empty}
                    </span>
                  </TableCell>
                  <TableCell className="whitespace-nowrap tabular-nums text-muted-foreground">
                    {formatTimestamp(entry.fechaOperacion)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </TableWrapper>
        )}
      </div>
    </>
  )
}
