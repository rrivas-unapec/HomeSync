import { useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts'
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
import { PROPERTY_TYPE_LABELS } from '@/lib/domain'
import { formatNumber, formatPercent } from '@/lib/format'
import { MESSAGES } from '@/lib/messages'
import { queryKeys } from '@/lib/query-keys'
import { fetchTopRequested, fetchTypeDistribution } from '../api/reports-api'

const SLICE_COLORS = ['var(--chart-1)', 'var(--chart-3)', 'var(--chart-2)', 'var(--chart-4)']
const TOP_COUNT = 5

function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return false
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

export function ReportsPage() {
  const distributionQuery = useQuery({
    queryKey: queryKeys.reports.distribution(),
    queryFn: fetchTypeDistribution,
  })

  const topQuery = useQuery({
    queryKey: queryKeys.reports.topRequested(TOP_COUNT),
    queryFn: () => fetchTopRequested(TOP_COUNT),
  })

  const distribution = useMemo(() => {
    const rows = distributionQuery.data ?? []
    const total = rows.reduce((sum, row) => sum + row.total, 0)
    return {
      total,
      rows: rows.map((row) => ({
        ...row,
        label: PROPERTY_TYPE_LABELS[row.tipo],
        share: total === 0 ? 0 : row.total / total,
      })),
    }
  }, [distributionQuery.data])

  const summary = distribution.rows
    .map((row) => `${row.label} ${formatPercent(row.share)}`)
    .join(', ')

  return (
    <>
      <PageHeader title={MESSAGES.reports.title} subtitle={MESSAGES.reports.subtitle} />

      <div className="grid grid-cols-1 gap-8 px-6 py-8 md:px-8 lg:grid-cols-2">
        <section aria-labelledby="reporte-distribucion">
          <h2
            id="reporte-distribucion"
            className="mb-4 text-xs font-medium uppercase tracking-widest text-muted-foreground"
          >
            {MESSAGES.reports.distributionTitle}
          </h2>

          {distributionQuery.isPending ? (
            <Skeleton className="h-80 w-full" />
          ) : distributionQuery.isError ? (
            <ErrorState
              message={MESSAGES.reports.error}
              onRetry={() => {
                void distributionQuery.refetch()
              }}
            />
          ) : distribution.total === 0 ? (
            <EmptyState message={MESSAGES.reports.distributionEmpty} />
          ) : (
            <div className="border border-border bg-card p-6">
              <div
                role="img"
                aria-label={MESSAGES.reports.distributionSummary(summary)}
                aria-describedby="tabla-distribucion"
                className="h-64 w-full"
                data-testid="distribution-chart"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={distribution.rows}
                      dataKey="total"
                      nameKey="label"
                      innerRadius="55%"
                      outerRadius="85%"
                      paddingAngle={2}
                      startAngle={90}
                      endAngle={-270}
                      isAnimationActive={!prefersReducedMotion()}
                    >
                      {distribution.rows.map((row, index) => (
                        <Cell
                          key={row.tipo}
                          fill={SLICE_COLORS[index % SLICE_COLORS.length]}
                          stroke="var(--card)"
                          strokeWidth={2}
                        />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(value: number, name: string) => [formatNumber(value), name]}
                      contentStyle={{
                        border: '1px solid var(--border)',
                        backgroundColor: 'var(--card)',
                        borderRadius: 0,
                        fontSize: 12,
                      }}
                    />
                    <Legend
                      verticalAlign="bottom"
                      formatter={(value: string) => (
                        <span className="text-xs text-muted-foreground">{value}</span>
                      )}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <div id="tabla-distribucion" className="mt-6">
                <TableWrapper>
                  <TableHead>
                    <TableHeaderCell>{MESSAGES.reports.columnType}</TableHeaderCell>
                    <TableHeaderCell numeric>{MESSAGES.reports.columnTotal}</TableHeaderCell>
                    <TableHeaderCell numeric>{MESSAGES.reports.columnShare}</TableHeaderCell>
                  </TableHead>
                  <TableBody>
                    {distribution.rows.map((row) => (
                      <TableRow key={row.tipo}>
                        <TableCell>{row.label}</TableCell>
                        <TableCell numeric>{formatNumber(row.total)}</TableCell>
                        <TableCell numeric>{formatPercent(row.share)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </TableWrapper>
              </div>
            </div>
          )}
        </section>

        <section aria-labelledby="reporte-top">
          <h2
            id="reporte-top"
            className="mb-4 text-xs font-medium uppercase tracking-widest text-muted-foreground"
          >
            {MESSAGES.reports.topTitle}
          </h2>

          {topQuery.isPending ? (
            <Skeleton className="h-80 w-full" />
          ) : topQuery.isError ? (
            <ErrorState
              message={MESSAGES.reports.error}
              onRetry={() => {
                void topQuery.refetch()
              }}
            />
          ) : topQuery.data.length === 0 ? (
            <EmptyState message={MESSAGES.reports.topEmpty} />
          ) : (
            <TableWrapper>
              <TableHead>
                <TableHeaderCell numeric>{MESSAGES.table.id}</TableHeaderCell>
                <TableHeaderCell>{MESSAGES.reports.columnProperty}</TableHeaderCell>
                <TableHeaderCell numeric>{MESSAGES.reports.columnRequests}</TableHeaderCell>
              </TableHead>
              <TableBody>
                {topQuery.data.map((row) => (
                  <TableRow key={row.propiedadId}>
                    <TableCell numeric className="text-muted-foreground">
                      {row.propiedadId}
                    </TableCell>
                    <TableCell>
                      <span className="line-clamp-2">{row.titulo}</span>
                    </TableCell>
                    <TableCell numeric>{formatNumber(row.totalSolicitudes)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </TableWrapper>
          )}
        </section>
      </div>
    </>
  )
}
