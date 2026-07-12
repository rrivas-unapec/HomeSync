import { Button } from '@/components/ui/button'
import { MESSAGES } from '@/lib/messages'

interface EmptyStateProps {
  message: string
  actionLabel?: string
  onAction?: () => void
}

export function EmptyState({ message, actionLabel, onAction }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center gap-4 border border-dashed border-border-control bg-card px-6 py-20 text-center">
      <p className="max-w-sm text-sm text-muted-foreground text-pretty">{message}</p>
      {actionLabel !== undefined && onAction !== undefined && (
        <Button variant="secondary" size="md" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  )
}

interface ErrorStateProps {
  message: string
  onRetry?: () => void
}

export function ErrorState({ message, onRetry }: ErrorStateProps) {
  return (
    <div
      role="alert"
      className="flex flex-col items-center gap-4 border border-destructive/40 bg-card px-6 py-20 text-center"
    >
      <p className="max-w-sm text-sm font-medium text-destructive text-pretty">{message}</p>
      {onRetry !== undefined && (
        <Button variant="secondary" size="md" onClick={onRetry}>
          {MESSAGES.actions.retry}
        </Button>
      )}
    </div>
  )
}

interface PageHeaderProps {
  title: string
  subtitle?: string
  children?: React.ReactNode
}

export function PageHeader({ title, subtitle, children }: PageHeaderProps) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-4 border-b border-border bg-card px-6 py-6 md:px-8">
      <div className="min-w-0">
        <h1 className="text-xl font-semibold text-foreground text-balance">{title}</h1>
        {subtitle !== undefined && (
          <p className="mt-1 max-w-prose text-sm text-muted-foreground text-pretty">{subtitle}</p>
        )}
      </div>
      {children}
    </div>
  )
}

interface ToolbarProps {
  label: string
  htmlFor: string
  count?: number
  children: React.ReactNode
}

export function Toolbar({ label, htmlFor, count, children }: ToolbarProps) {
  return (
    <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
      <label
        htmlFor={htmlFor}
        className="text-xs font-medium uppercase tracking-widest text-muted-foreground"
      >
        {label}
      </label>
      {children}
      {count !== undefined && (
        <p aria-live="polite" className="ml-auto text-xs tabular-nums text-muted-foreground">
          {count === 1 ? MESSAGES.table.oneResult : MESSAGES.table.manyResults(count)}
        </p>
      )}
    </div>
  )
}
