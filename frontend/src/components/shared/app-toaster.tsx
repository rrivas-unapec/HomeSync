import { Toaster } from 'sonner'
import { useTheme } from '@/app/providers/theme-context'

export function AppToaster() {
  const { resolved } = useTheme()

  return (
    <Toaster
      theme={resolved}
      position="bottom-right"
      closeButton
      toastOptions={{
        classNames: {
          toast:
            'border border-border bg-card text-foreground text-sm shadow-none rounded-none font-sans',
          description: 'text-muted-foreground',
          actionButton: 'bg-foreground text-background',
          cancelButton: 'bg-muted text-muted-foreground',
        },
      }}
    />
  )
}
