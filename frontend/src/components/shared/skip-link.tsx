import { MESSAGES } from '@/lib/messages'

export function SkipLink() {
  return (
    <a
      href="#contenido"
      className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:border focus:border-foreground focus:bg-card focus:px-4 focus:py-2 focus:text-xs focus:font-medium focus:uppercase focus:tracking-widest"
    >
      {MESSAGES.a11y.mainContent}
    </a>
  )
}
