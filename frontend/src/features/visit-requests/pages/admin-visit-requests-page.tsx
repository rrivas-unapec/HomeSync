import { useMemo, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { ConfirmDialog } from '@/components/ui/confirm-dialog'
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
import { isApiError } from '@/lib/api-error'
import { VISIT_SLOT_LABELS, VISIT_STATES, VISIT_STATE_LABELS, type VisitState } from '@/lib/domain'
import { formatIsoDate } from '@/lib/format'
import { MESSAGES } from '@/lib/messages'
import { queryKeys } from '@/lib/query-keys'
import {
  cancelVisitRequest,
  fetchVisitRequests,
  updateVisitRequestState,
} from '../api/visit-requests-api'
import type { VisitRequest } from '../types/visit-request'

const CONTROL_CLASS =
  'border border-border-control bg-card px-2 py-1.5 text-xs text-foreground transition-colors duration-150 ease-out hover:border-foreground motion-reduce:transition-none cursor-pointer'

export function AdminVisitRequestsPage() {
  const queryClient = useQueryClient()
  const [stateFilter, setStateFilter] = useState<string>('')
  const [cancelling, setCancelling] = useState<VisitRequest | null>(null)

  const query = useQuery({
    queryKey: queryKeys.visitRequests.list(),
    queryFn: fetchVisitRequests,
  })

  function invalidate() {
    void queryClient.invalidateQueries({ queryKey: queryKeys.visitRequests.all })
    void queryClient.invalidateQueries({ queryKey: queryKeys.reports.all })
  }

  const stateMutation = useMutation({
    mutationFn: ({ id, estado }: { id: number; estado: VisitState }) =>
      updateVisitRequestState(id, estado),
    onSuccess: () => {
      toast.success(MESSAGES.adminVisits.stateUpdated)
      invalidate()
    },
    onError: (error: unknown) => {
      toast.error(isApiError(error) ? error.message : MESSAGES.errors.unknown)
    },
  })

  const cancelMutation = useMutation({
    mutationFn: (id: number) => cancelVisitRequest(id),
    onSuccess: () => {
      toast.success(MESSAGES.adminVisits.cancelled)
      setCancelling(null)
      invalidate()
    },
    onError: (error: unknown) => {
      toast.error(isApiError(error) ? error.message : MESSAGES.errors.unknown)
    },
  })

  const rows = useMemo(() => {
    const data = query.data ?? []
    if (stateFilter.length === 0) return data
    return data.filter((row) => row.estado === stateFilter)
  }, [query.data, stateFilter])

  return (
    <>
      <PageHeader title={MESSAGES.adminVisits.title}>
        <div className="flex items-center gap-2">
          <label
            htmlFor="filtro-estado"
            className="text-xs font-medium uppercase tracking-wide text-muted-foreground"
          >
            {MESSAGES.adminVisits.filterState}
          </label>
          <select
            id="filtro-estado"
            className={CONTROL_CLASS}
            value={stateFilter}
            onChange={(event) => {
              setStateFilter(event.target.value)
            }}
          >
            <option value="">{MESSAGES.catalog.filterAll}</option>
            {VISIT_STATES.map((value) => (
              <option key={value} value={value}>
                {VISIT_STATE_LABELS[value]}
              </option>
            ))}
          </select>
        </div>
      </PageHeader>

      <div className="px-6 py-8 md:px-8">
        {query.isPending ? (
          <Skeleton className="h-64 w-full" />
        ) : query.isError ? (
          <ErrorState
            message={MESSAGES.adminVisits.error}
            onRetry={() => {
              void query.refetch()
            }}
          />
        ) : rows.length === 0 ? (
          stateFilter.length > 0 ? (
            <EmptyState
              message={MESSAGES.adminVisits.emptyFiltered}
              actionLabel={MESSAGES.adminVisits.showAll}
              onAction={() => {
                setStateFilter('')
              }}
            />
          ) : (
            <EmptyState message={MESSAGES.adminVisits.empty} />
          )
        ) : (
          <TableWrapper>
            <TableHead>
              <TableHeaderCell numeric>{MESSAGES.table.id}</TableHeaderCell>
              <TableHeaderCell>{MESSAGES.table.property}</TableHeaderCell>
              <TableHeaderCell>{MESSAGES.table.client}</TableHeaderCell>
              <TableHeaderCell>{MESSAGES.table.suggestedDate}</TableHeaderCell>
              <TableHeaderCell>{MESSAGES.table.slot}</TableHeaderCell>
              <TableHeaderCell>{MESSAGES.table.state}</TableHeaderCell>
              <TableHeaderCell>{MESSAGES.table.actions}</TableHeaderCell>
            </TableHead>
            <TableBody>
              {rows.map((row) => (
                <TableRow key={row.id}>
                  <TableCell numeric className="text-muted-foreground">
                    {row.id}
                  </TableCell>
                  <TableCell className="max-w-xs">
                    <span className="line-clamp-2">
                      {row.propiedadTitulo ?? MESSAGES.table.empty}
                    </span>
                  </TableCell>
                  <TableCell>{row.clienteNombre ?? MESSAGES.table.empty}</TableCell>
                  <TableCell className="tabular-nums">{formatIsoDate(row.fechaSugerida)}</TableCell>
                  <TableCell>{VISIT_SLOT_LABELS[row.horario]}</TableCell>
                  <TableCell>
                    <select
                      aria-label={`${MESSAGES.table.state} ${String(row.id)}`}
                      className={CONTROL_CLASS}
                      value={row.estado}
                      disabled={stateMutation.isPending}
                      onChange={(event) => {
                        stateMutation.mutate({
                          id: row.id,
                          estado: event.target.value as VisitState,
                        })
                      }}
                    >
                      {VISIT_STATES.map((value) => (
                        <option key={value} value={value}>
                          {VISIT_STATE_LABELS[value]}
                        </option>
                      ))}
                    </select>
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-destructive hover:text-destructive"
                      onClick={() => {
                        setCancelling(row)
                      }}
                    >
                      {MESSAGES.actions.cancel}
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </TableWrapper>
        )}
      </div>

      <ConfirmDialog
        open={cancelling !== null}
        onOpenChange={(next) => {
          if (!next) setCancelling(null)
        }}
        title={MESSAGES.adminVisits.cancelTitle}
        body={MESSAGES.adminVisits.cancelBody}
        confirmLabel={MESSAGES.adminVisits.confirmCancel}
        cancelLabel={MESSAGES.adminVisits.keep}
        pending={cancelMutation.isPending}
        onConfirm={() => {
          if (cancelling !== null) cancelMutation.mutate(cancelling.id)
        }}
      />
    </>
  )
}
