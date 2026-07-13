import { MESSAGES } from '@/lib/messages'
import { cn } from '@/lib/utils'

export function Wordmark({ className }: { className?: string }) {
  return (
    <span
      translate="no"
      className={cn(
        'inline-flex items-baseline gap-1.5 text-sm font-semibold uppercase tracking-[0.2em] text-foreground',
        className,
      )}
    >
      <span aria-hidden="true" className="h-2 w-2 self-center bg-foreground" />
      {MESSAGES.app.name}
    </span>
  )
}
