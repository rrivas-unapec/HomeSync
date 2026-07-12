import * as DialogPrimitive from '@radix-ui/react-dialog'
import { X } from 'lucide-react'
import { MESSAGES } from '@/lib/messages'
import { cn } from '@/lib/utils'

export const Dialog = DialogPrimitive.Root
export const DialogTrigger = DialogPrimitive.Trigger
export const DialogClose = DialogPrimitive.Close

interface DialogContentProps
  extends React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content> {
  title: string
  description?: string
  className?: string
}

export function DialogContent({
  title,
  description,
  className,
  children,
  ...props
}: DialogContentProps) {
  return (
    <DialogPrimitive.Portal>
      <DialogPrimitive.Overlay
        className="dialog-overlay fixed inset-0 z-50 bg-overlay"
        style={{ overscrollBehavior: 'contain' }}
      />
      <DialogPrimitive.Content
        className={cn(
          'dialog-content fixed left-1/2 top-1/2 z-50 max-h-[calc(100vh-2rem)] w-[calc(100%-2rem)] max-w-md -translate-x-1/2 -translate-y-1/2 overflow-y-auto border border-border bg-card',
          className,
        )}
        {...props}
      >
        <div className="flex items-start justify-between gap-4 border-b border-border px-7 py-5">
          <div className="min-w-0">
            <DialogPrimitive.Title className="text-base font-semibold text-foreground">
              {title}
            </DialogPrimitive.Title>
            {description !== undefined && description.length > 0 && (
              <DialogPrimitive.Description className="mt-0.5 truncate text-xs text-muted-foreground">
                {description}
              </DialogPrimitive.Description>
            )}
          </div>
          <DialogPrimitive.Close
            aria-label={MESSAGES.a11y.closeDialog}
            className="flex h-7 w-7 shrink-0 cursor-pointer items-center justify-center border border-border text-muted-foreground transition-colors duration-150 ease-out hover:border-foreground hover:text-foreground motion-reduce:transition-none"
          >
            <X className="h-3.5 w-3.5" aria-hidden="true" />
          </DialogPrimitive.Close>
        </div>
        {children}
      </DialogPrimitive.Content>
    </DialogPrimitive.Portal>
  )
}

export function DialogBody({
  className,
  children,
}: {
  className?: string
  children: React.ReactNode
}) {
  return <div className={cn('flex flex-col gap-4 px-7 py-6', className)}>{children}</div>
}

export function DialogFooter({ children }: { children: React.ReactNode }) {
  return <div className="flex justify-end gap-3 border-t border-border px-7 py-5">{children}</div>
}
