import * as AlertDialogPrimitive from '@radix-ui/react-alert-dialog'
import { MESSAGES } from '@/lib/messages'
import { cn } from '@/lib/utils'

interface ConfirmDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  body: string
  confirmLabel?: string
  cancelLabel?: string
  destructive?: boolean
  pending?: boolean
  onConfirm: () => void
  children?: React.ReactNode
}

const ACTION_CLASS =
  'inline-flex cursor-pointer items-center justify-center border px-6 py-2.5 text-xs font-medium uppercase tracking-wide transition-[background-color,color,border-color,opacity] duration-150 ease-out active:scale-[0.97] disabled:pointer-events-none disabled:opacity-40 motion-reduce:transition-none motion-reduce:active:scale-100'

export function ConfirmDialog({
  open,
  onOpenChange,
  title,
  body,
  confirmLabel = MESSAGES.actions.delete,
  cancelLabel = MESSAGES.actions.cancel,
  destructive = true,
  pending = false,
  onConfirm,
  children,
}: ConfirmDialogProps) {
  return (
    <AlertDialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
      <AlertDialogPrimitive.Portal>
        <AlertDialogPrimitive.Overlay className="dialog-overlay fixed inset-0 z-50 bg-overlay" />
        <AlertDialogPrimitive.Content className="dialog-content fixed left-1/2 top-1/2 z-50 w-[calc(100%-2rem)] max-w-md -translate-x-1/2 -translate-y-1/2 border border-border bg-card">
          <div className="border-b border-border px-7 py-5">
            <AlertDialogPrimitive.Title className="text-base font-semibold text-foreground">
              {title}
            </AlertDialogPrimitive.Title>
          </div>
          <div className="px-7 py-6">
            <AlertDialogPrimitive.Description className="text-sm leading-relaxed text-muted-foreground">
              {body}
            </AlertDialogPrimitive.Description>
            {children}
          </div>
          <div className="flex justify-end gap-3 border-t border-border px-7 py-5">
            <AlertDialogPrimitive.Cancel
              className={cn(
                ACTION_CLASS,
                'border-border bg-transparent text-muted-foreground hover:border-foreground hover:text-foreground',
              )}
            >
              {cancelLabel}
            </AlertDialogPrimitive.Cancel>
            <AlertDialogPrimitive.Action
              disabled={pending}
              onClick={(event) => {
                event.preventDefault()
                onConfirm()
              }}
              className={cn(
                ACTION_CLASS,
                destructive
                  ? 'border-destructive bg-destructive text-destructive-foreground hover:opacity-80'
                  : 'border-foreground bg-foreground text-background hover:opacity-80',
              )}
            >
              {confirmLabel}
            </AlertDialogPrimitive.Action>
          </div>
        </AlertDialogPrimitive.Content>
      </AlertDialogPrimitive.Portal>
    </AlertDialogPrimitive.Root>
  )
}
