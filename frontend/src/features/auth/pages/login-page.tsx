import { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { useAuth } from '@/app/providers/auth-context'
import { Button } from '@/components/ui/button'
import { TextField } from '@/components/ui/field'
import { Wordmark } from '@/components/shared/wordmark'
import { MESSAGES } from '@/lib/messages'
import { applyApiErrorToForm } from '@/lib/apply-api-error'
import { login } from '../api/auth-api'
import { loginSchema, type LoginInput } from '../schemas/auth-schema'
import { safeReturnUrl } from '../lib/return-url'

export function LoginPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { signIn } = useAuth()
  const [formError, setFormError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    mode: 'onBlur',
    defaultValues: { correo: '', contrasena: '' },
  })

  const mutation = useMutation({
    mutationFn: login,
    onSuccess: (session) => {
      signIn(session)
      const fallback = session.user.rol === 'administrador' ? '/admin/propiedades' : '/'
      void navigate(safeReturnUrl(searchParams.get('returnUrl')) ?? fallback, { replace: true })
    },
    onError: (error: unknown) => {
      setFormError(applyApiErrorToForm(error, setError, ['correo', 'contrasena']))
    },
  })

  function onSubmit(values: LoginInput) {
    setFormError(null)
    mutation.mutate(values)
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-4 py-12">
      <div className="w-full max-w-sm border border-border bg-card px-8 py-12 sm:px-10">
        <div className="mb-10">
          <Link to="/" className="mb-6 inline-block">
            <Wordmark />
          </Link>
          <p className="mb-3 text-xs font-medium uppercase tracking-widest text-muted-foreground">
            {MESSAGES.app.tagline}
          </p>
          <h1 className="text-2xl font-semibold leading-tight text-foreground">
            {MESSAGES.auth.title}
          </h1>
        </div>

        <form
          onSubmit={(event) => void handleSubmit(onSubmit)(event)}
          className="flex flex-col gap-5"
          noValidate
        >
          <TextField
            label={MESSAGES.auth.emailLabel}
            type="email"
            autoComplete="email"
            spellCheck={false}
            placeholder={MESSAGES.auth.emailPlaceholder}
            error={errors.correo?.message}
            {...register('correo')}
          />

          <TextField
            label={MESSAGES.auth.passwordLabel}
            type="password"
            autoComplete="current-password"
            placeholder={MESSAGES.auth.passwordPlaceholder}
            error={errors.contrasena?.message}
            {...register('contrasena')}
          />

          {formError !== null && (
            <p
              role="alert"
              className="border border-destructive px-3 py-2 text-xs font-medium text-destructive"
            >
              {formError}
            </p>
          )}

          <Button type="submit" size="lg" disabled={mutation.isPending} className="mt-2">
            {mutation.isPending ? MESSAGES.auth.submitting : MESSAGES.actions.signIn}
          </Button>
        </form>

        <p className="mt-8 border-t border-border pt-6 text-xs leading-relaxed text-muted-foreground">
          {MESSAGES.auth.noAccount}{' '}
          <Link
            to="/registro"
            className="font-medium text-foreground underline underline-offset-2 transition-opacity duration-150 ease-out hover:opacity-60 motion-reduce:transition-none"
          >
            {MESSAGES.actions.register}
          </Link>
        </p>
      </div>
    </main>
  )
}
