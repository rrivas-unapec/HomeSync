import { useMemo, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  TableBody,
  TableCell,
  TableHead,
  TableHeaderCell,
  TableRow,
  TableSkeleton,
  TableWrapper,
} from '@/components/ui/table'
import { EmptyState, ErrorState, PageHeader, Toolbar } from '@/components/shared/states'
import { AUDIT_ACTIONS, AUDIT_ACTION_LABELS } from '@/lib/domain'
import { formatTimestamp } from '@/lib/format'
import { MESSAGES } from '@/lib/messages'
import { queryKeys } from '@/lib/query-keys'
import { fetchAuditEntries } from '../api/audit-api'
import { AuditDetailsDialog } from '../components/audit-details-dialog'
import {
  parseAuditDetails,
  summarizeAuditDetails,
  titleFromAuditDetails,
} from '../lib/audit-details'
import { actionTone, type AuditEntry } from '../types/audit'

export function AdminAuditPage() {
  const [actionFilter, setActionFilter] = useState('')
  const [selected, setSelected] = useState<AuditEntry | null>(null)

  const query = useQuery({
    queryKey: queryKeys.audit.list(),
    queryFn: fetchAuditEntries,
  })

  const rows = useMemo(() => {
    const data = query.data ?? []
    const filtered =
      actionFilter.length === 0 ? data : data.filter((e) => e.accion === actionFilter)
    return filtered.map((entry) => {
      const fields = parseAuditDetails(entry.detallesCambio)
      return {
        entry,
        summary: summarizeAuditDetails(fields),
        recordedTitle: titleFromAuditDetails(fields),
      }
    })
  }, [query.data, actionFilter])

  return (
    <>
      <PageHeader title={MESSAGES.adminAudit.title} subtitle={MESSAGES.adminAudit.subtitle} />

      <div className="flex flex-col gap-6 px-6 py-8 md:px-8">
        <Toolbar
          label={MESSAGES.adminAudit.filterAction}
          htmlFor="filtro-accion"
          count={query.data === undefined ? undefined : rows.length}
        >
          <select
            id="filtro-accion"
            className="cursor-pointer border border-border-control bg-card px-2.5 py-1.5 text-xs text-foreground transition-colors duration-150 ease-out hover:border-foreground motion-reduce:transition-none"
            value={actionFilter}
            onChange={(event) => {
              setActionFilter(event.target.value)
            }}
          >
            <option value="">{MESSAGES.catalog.filterAll}</option>
            {AUDIT_ACTIONS.map((value) => (
              <option key={value} value={value}>
                {AUDIT_ACTION_LABELS[value]}
              </option>
            ))}
          </select>
        </Toolbar>

        {query.isPending ? (
          <TableSkeleton columns={6} />
        ) : query.isError ? (
          <ErrorState
            message={MESSAGES.adminAudit.error}
            onRetry={() => {
              void query.refetch()
            }}
          />
        ) : rows.length === 0 ? (
          actionFilter.length > 0 ? (
            <EmptyState
              message={MESSAGES.adminAudit.emptyFiltered}
              actionLabel={MESSAGES.adminAudit.showAll}
              onAction={() => {
                setActionFilter('')
              }}
            />
          ) : (
            <EmptyState message={MESSAGES.adminAudit.empty} />
          )
        ) : (
          <TableWrapper>
            <TableHead>
              <TableHeaderCell numeric className="w-16">
                {MESSAGES.table.id}
              </TableHeaderCell>
              <TableHeaderCell className="w-32">{MESSAGES.table.action}</TableHeaderCell>
              <TableHeaderCell>{MESSAGES.adminAudit.affectedProperty}</TableHeaderCell>
              <TableHeaderCell>{MESSAGES.adminAudit.details}</TableHeaderCell>
              <TableHeaderCell className="w-40">{MESSAGES.table.user}</TableHeaderCell>
              <TableHeaderCell className="w-44">{MESSAGES.table.date}</TableHeaderCell>
              <TableHeaderCell className="w-32">{MESSAGES.table.actions}</TableHeaderCell>
            </TableHead>
            <TableBody>
              {rows.map(({ entry, summary, recordedTitle }) => (
                <TableRow key={entry.id}>
                  <TableCell numeric className="text-muted-foreground">
                    {entry.id}
                  </TableCell>
                  <TableCell>
                    <Badge tone={actionTone(entry.accion)}>
                      {AUDIT_ACTION_LABELS[entry.accion]}
                    </Badge>
                  </TableCell>
                  <TableCell className="max-w-[16rem]">
                    {entry.propiedadTitulo !== null ? (
                      <span className="line-clamp-2 font-medium">{entry.propiedadTitulo}</span>
                    ) : (
                      <span className="flex flex-col gap-0.5">
                        <span className="line-clamp-2 font-medium text-muted-foreground line-through">
                          {recordedTitle ?? MESSAGES.adminAudit.unknownProperty}
                        </span>
                        <span className="text-xs uppercase tracking-widest text-muted-foreground">
                          {MESSAGES.adminAudit.deletedProperty}
                          <span className="tabular-nums"> #{entry.propiedadId}</span>
                        </span>
                      </span>
                    )}
                  </TableCell>
                  <TableCell className="max-w-sm">
                    {summary.length === 0 ? (
                      <span className="text-muted-foreground">{MESSAGES.table.empty}</span>
                    ) : (
                      <ul className="flex flex-wrap gap-x-3 gap-y-1">
                        {summary.map((field) => (
                          <li key={field.key} className="text-xs text-muted-foreground">
                            <span className="uppercase tracking-widest">{field.label}</span>
                            <span aria-hidden="true"> · </span>
                            <span
                              className={
                                field.key === 'Precio'
                                  ? 'font-medium tabular-nums text-foreground'
                                  : 'font-medium text-foreground'
                              }
                            >
                              {field.value}
                            </span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {entry.usuarioNombre ?? MESSAGES.adminAudit.systemUser}
                  </TableCell>
                  <TableCell className="whitespace-nowrap tabular-nums text-muted-foreground">
                    {formatTimestamp(entry.fechaOperacion)}
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => {
                        setSelected(entry)
                      }}
                    >
                      {MESSAGES.adminAudit.viewDetails}
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </TableWrapper>
        )}
      </div>

      <AuditDetailsDialog
        entry={selected}
        onClose={() => {
          setSelected(null)
        }}
      />
    </>
  )
}
