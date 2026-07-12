import { forwardRef, useId } from 'react'
import { cn } from '@/lib/utils'

const CONTROL_CLASS =
  'w-full border border-border bg-transparent px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground transition-colors duration-150 ease-out hover:border-foreground/40 aria-[invalid=true]:border-destructive disabled:cursor-not-allowed disabled:opacity-50 motion-reduce:transition-none'

const LABEL_CLASS = 'text-xs font-medium uppercase tracking-wide text-foreground'

interface FieldShellProps {
  label: string
  htmlFor: string
  error?: string | undefined
  hint?: string | undefined
  errorId: string
  hintId: string
  children: React.ReactNode
  className?: string
}

function FieldShell({
  label,
  htmlFor,
  error,
  hint,
  errorId,
  hintId,
  children,
  className,
}: FieldShellProps) {
  return (
    <div className={cn('flex flex-col gap-1.5', className)}>
      <label htmlFor={htmlFor} className={LABEL_CLASS}>
        {label}
      </label>
      {children}
      {hint !== undefined && hint.length > 0 && (
        <p id={hintId} className="text-xs text-muted-foreground">
          {hint}
        </p>
      )}
      {error !== undefined && error.length > 0 && (
        <p id={errorId} role="alert" className="text-xs font-medium text-destructive">
          {error}
        </p>
      )}
    </div>
  )
}

function describedBy(
  error: string | undefined,
  hint: string | undefined,
  errorId: string,
  hintId: string,
): string | undefined {
  const ids = [
    hint !== undefined && hint.length > 0 ? hintId : null,
    error !== undefined && error.length > 0 ? errorId : null,
  ].filter((id): id is string => id !== null)
  return ids.length > 0 ? ids.join(' ') : undefined
}

export interface TextFieldProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'id'> {
  label: string
  error?: string | undefined
  hint?: string | undefined
  wrapperClassName?: string
}

export const TextField = forwardRef<HTMLInputElement, TextFieldProps>(
  ({ label, error, hint, wrapperClassName, className, ...props }, ref) => {
    const id = useId()
    const errorId = `${id}-error`
    const hintId = `${id}-hint`
    return (
      <FieldShell
        label={label}
        htmlFor={id}
        error={error}
        hint={hint}
        errorId={errorId}
        hintId={hintId}
        className={wrapperClassName}
      >
        <input
          ref={ref}
          id={id}
          aria-invalid={error !== undefined && error.length > 0}
          aria-describedby={describedBy(error, hint, errorId, hintId)}
          className={cn(CONTROL_CLASS, className)}
          {...props}
        />
      </FieldShell>
    )
  },
)
TextField.displayName = 'TextField'

export interface TextAreaFieldProps
  extends Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, 'id'> {
  label: string
  error?: string | undefined
  hint?: string | undefined
  wrapperClassName?: string
}

export const TextAreaField = forwardRef<HTMLTextAreaElement, TextAreaFieldProps>(
  ({ label, error, hint, wrapperClassName, className, ...props }, ref) => {
    const id = useId()
    const errorId = `${id}-error`
    const hintId = `${id}-hint`
    return (
      <FieldShell
        label={label}
        htmlFor={id}
        error={error}
        hint={hint}
        errorId={errorId}
        hintId={hintId}
        className={wrapperClassName}
      >
        <textarea
          ref={ref}
          id={id}
          aria-invalid={error !== undefined && error.length > 0}
          aria-describedby={describedBy(error, hint, errorId, hintId)}
          className={cn(CONTROL_CLASS, 'min-h-24 resize-y', className)}
          {...props}
        />
      </FieldShell>
    )
  },
)
TextAreaField.displayName = 'TextAreaField'

export interface SelectFieldProps
  extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'id'> {
  label: string
  error?: string | undefined
  hint?: string | undefined
  wrapperClassName?: string
}

export const SelectField = forwardRef<HTMLSelectElement, SelectFieldProps>(
  ({ label, error, hint, wrapperClassName, className, children, ...props }, ref) => {
    const id = useId()
    const errorId = `${id}-error`
    const hintId = `${id}-hint`
    return (
      <FieldShell
        label={label}
        htmlFor={id}
        error={error}
        hint={hint}
        errorId={errorId}
        hintId={hintId}
        className={wrapperClassName}
      >
        <select
          ref={ref}
          id={id}
          aria-invalid={error !== undefined && error.length > 0}
          aria-describedby={describedBy(error, hint, errorId, hintId)}
          className={cn(CONTROL_CLASS, 'cursor-pointer bg-card py-2', className)}
          {...props}
        >
          {children}
        </select>
      </FieldShell>
    )
  },
)
SelectField.displayName = 'SelectField'
