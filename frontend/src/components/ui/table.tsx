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
        'px-3 py-2.5 align-middle text-foreground',
        numeric === true && 'text-right tabular-nums',
        className,
      )}
      {...props}
    />
  )
}
