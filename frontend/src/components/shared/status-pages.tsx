import { Link } from 'react-router'
import { Button } from '@/components/ui/button'
import { MESSAGES } from '@/lib/messages'

interface StatusPageProps {
  code: string
  title: string
  body: string
}

function StatusPage({ code, title, body }: StatusPageProps) {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-6 py-20 text-center">
      <p className="text-xs font-medium uppercase tracking-[0.2em] tabular-nums text-muted-foreground">
        {MESSAGES.a11y.errorCode} {code}
      </p>
      <h1 className="mt-4 max-w-md text-2xl font-semibold text-foreground text-balance">{title}</h1>
      <p className="mt-3 max-w-sm text-sm leading-relaxed text-muted-foreground text-pretty">
        {body}
      </p>
      <Button asChild variant="secondary" size="md" className="mt-8">
        <Link to="/">{MESSAGES.actions.goHome}</Link>
      </Button>
    </div>
  )
}

export function NotFoundPage() {
  return <StatusPage code="404" title={MESSAGES.notFound.title} body={MESSAGES.notFound.body} />
}

export function ForbiddenPage() {
  return <StatusPage code="403" title={MESSAGES.forbidden.title} body={MESSAGES.forbidden.body} />
}
