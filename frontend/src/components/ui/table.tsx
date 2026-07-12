import { ChevronDown, ChevronsUpDown, ChevronUp } from 'lucide-react'
import { Skeleton } from './skeleton'
import { cn } from '@/lib/utils'

export function TableWrapper({ children }: { children: React.ReactNode }) {
  return (
    <div className="w-full overflow-x-auto border border-border bg-card">
      <table className="w-full border-collapse text-sm">{children}</table>
    </div>
  )
}

export function TableHead({ children }: { children: React.ReactNode }) {
  return (
    <thead className="sticky top-0 z-10 bg-card">
      <tr className="border-b border-border">{children}</tr>
    </thead>
  )
}

interface TableHeaderCellProps extends React.ThHTMLAttributes<HTMLTableCellElement> {
  numeric?: boolean
}

export function TableHeaderCell({ className, numeric, ...props }: TableHeaderCellProps) {
  return (
    <th
      scope="col"
      className={cn(
        'whitespace-nowrap px-3 py-2.5 text-xs font-medium uppercase tracking-widest text-muted-foreground',
        numeric === true && 'text-right',
        className,
      )}
      {...props}
    />
  )
}

export type SortDirection = 'asc' | 'desc' | null

interface SortableHeaderCellProps {
  label: string
  direction: SortDirection
  onToggle: () => void
  numeric?: boolean
  className?: string
}

export function SortableHeaderCell({
  label,
  direction,
  onToggle,
  numeric,
  className,
}: SortableHeaderCellProps) {
  const ariaSort = direction === 'asc' ? 'ascending' : direction === 'desc' ? 'descending' : 'none'
  const Icon = direction === 'asc' ? ChevronUp : direction === 'desc' ? ChevronDown : ChevronsUpDown

  return (
    <th
      scope="col"
      aria-sort={ariaSort}
      className={cn('whitespace-nowrap p-0', numeric === true && 'text-right', className)}
    >
      <button
        type="button"
        onClick={onToggle}
        className={cn(
          'flex w-full cursor-pointer items-center gap-1.5 px-3 py-2.5 text-xs font-medium uppercase tracking-widest transition-colors duration-150 ease-out motion-reduce:transition-none',
          direction === null ? 'text-muted-foreground' : 'text-foreground',
          'hover:text-foreground',
          numeric === true && 'justify-end',
        )}
      >
        {label}
        <Icon className="h-3 w-3 shrink-0" aria-hidden="true" />
      </button>
    </th>
  )
}

export function TableBody({ children }: { children: React.ReactNode }) {
  return <tbody>{children}</tbody>
}

export function TableRow({ className, ...props }: React.HTMLAttributes<HTMLTableRowElement>) {
  return (
    <tr
      className={cn(
        'border-b border-border transition-colors duration-150 ease-out last:border-b-0 hover:bg-muted motion-reduce:transition-none',
        className,
      )}
      {...props}
    />
  )
}

interface TableCellProps extends React.TdHTMLAttributes<HTMLTableCellElement> {
  numeric?: boolean
}

export function TableCell({ className, numeric, ...props }: TableCellProps) {
  return (
    <td
      className={cn(
        'px-3 py-3 align-middle text-foreground',
        numeric === true && 'text-right tabular-nums',
        className,
      )}
      {...props}
    />
  )
}

export function TableSkeleton({ columns, rows = 6 }: { columns: number; rows?: number }) {
  return (
    <div className="w-full border border-border bg-card" aria-hidden="true">
      <div className="flex gap-3 border-b border-border px-3 py-2.5">
        {Array.from({ length: columns }, (_, index) => (
          <Skeleton key={index} className="h-3 flex-1" />
        ))}
      </div>
      {Array.from({ length: rows }, (_, rowIndex) => (
        <div key={rowIndex} className="flex gap-3 border-b border-border px-3 py-3 last:border-b-0">
          {Array.from({ length: columns }, (_, index) => (
            <Skeleton key={index} className="h-4 flex-1" />
          ))}
        </div>
      ))}
    </div>
  )
}
