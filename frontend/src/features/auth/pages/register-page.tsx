import { useState } from 'react'
import { Link, useNavigate } from 'react-router'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { TextField } from '@/components/ui/field'
import { ThemeToggle } from '@/components/shared/theme-toggle'
import { Wordmark } from '@/components/shared/wordmark'
import { MESSAGES } from '@/lib/messages'
import { applyApiErrorToForm } from '@/lib/apply-api-error'
import { register as registerUser } from '../api/auth-api'
import { registerSchema, type RegisterInput } from '../schemas/auth-schema'

export function RegisterPage() {
  const navigate = useNavigate()
  const [formError, setFormError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
    mode: 'onBlur',
    defaultValues: { nombre: '', correo: '', contrasena: '' },
  })

  const mutation = useMutation({
    mutationFn: registerUser,
    onSuccess: () => {
      toast.success(MESSAGES.auth.registerSuccess)
      void navigate('/login', { replace: true })
    },
    onError: (error: unknown) => {
      setFormError(applyApiErrorToForm(error, setError, ['nombre', 'correo', 'contrasena']))
    },
  })

  function onSubmit(values: RegisterInput) {
    setFormError(null)
    mutation.mutate(values)
  }

  return (
    <main className="relative flex min-h-screen items-center justify-center bg-background px-4 py-12">
      <div className="absolute right-4 top-4">
        <ThemeToggle />
      </div>

      <div className="w-full max-w-sm border border-border bg-card px-8 py-12 sm:px-10">
        <div className="mb-10">
          <Link to="/" className="mb-6 inline-block">
            <Wordmark />
          </Link>
          <p className="mb-3 text-xs font-medium uppercase tracking-widest text-muted-foreground">
            {MESSAGES.app.tagline}
          </p>
          <h1 className="text-2xl font-semibold leading-tight text-foreground">
            {MESSAGES.auth.registerTitle}
          </h1>
        </div>

        <form
          onSubmit={(event) => void handleSubmit(onSubmit)(event)}
          className="flex flex-col gap-5"
          noValidate
        >
          <TextField
            label={MESSAGES.auth.nameLabel}
            autoComplete="name"
            placeholder={MESSAGES.auth.namePlaceholder}
            error={errors.nombre?.message}
            {...register('nombre')}
          />

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
            autoComplete="new-password"
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
            {mutation.isPending ? MESSAGES.auth.registerSubmitting : MESSAGES.actions.register}
          </Button>
        </form>

        <p className="mt-8 border-t border-border pt-6 text-xs leading-relaxed text-muted-foreground">
          {MESSAGES.auth.haveAccount}{' '}
          <Link
            to="/login"
            className="font-medium text-foreground underline underline-offset-2 transition-opacity duration-150 ease-out hover:opacity-60 motion-reduce:transition-none"
          >
            {MESSAGES.actions.signIn}
          </Link>
        </p>
      </div>
    </main>
  )
}
