import { Button } from '@/components/ui/button'
import { MESSAGES } from '@/lib/messages'

interface EmptyStateProps {
  message: string
  actionLabel?: string
  onAction?: () => void
}

export function EmptyState({ message, actionLabel, onAction }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center gap-4 border border-border bg-card px-6 py-20 text-center">
      <p className="text-sm text-muted-foreground">{message}</p>
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
      className="flex flex-col items-center gap-4 border border-border bg-card px-6 py-20 text-center"
    >
      <p className="text-sm font-medium text-destructive">{message}</p>
      {onRetry !== undefined && (
        <Button variant="secondary" size="md" onClick={onRetry}>
          {MESSAGES.actions.retry}
        </Button>
      )}
    </div>
  )
}

export function PageHeader({ title, children }: { title: string; children?: React.ReactNode }) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border bg-card px-6 py-5 md:px-8">
      <h1 className="text-xl font-semibold text-foreground text-balance">{title}</h1>
      {children}
    </div>
  )
}
