import { useEffect, useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Button } from '@/components/ui/button'
import { Dialog, DialogBody, DialogContent, DialogFooter } from '@/components/ui/dialog'
import { TextField } from '@/components/ui/field'
import { VISIT_SLOTS, VISIT_SLOT_LABELS } from '@/lib/domain'
import { todayAsIsoDate } from '@/lib/format'
import { MESSAGES } from '@/lib/messages'
import { applyApiErrorToForm } from '@/lib/apply-api-error'
import { queryKeys } from '@/lib/query-keys'
import { cn } from '@/lib/utils'
import type { Property } from '@/features/properties/types/property'
import { createVisitRequest } from '../api/visit-requests-api'
import {
  visitRequestSchema,
  type VisitRequestFormValues,
  type VisitRequestInput,
} from '../schemas/visit-request-schema'

interface VisitRequestDialogProps {
  property: Property | null
  onClose: () => void
}

const EMPTY_VALUES: VisitRequestFormValues = {
  nombreCompleto: '',
  correo: '',
  telefono: '',
  fechaSugerida: '',
  horario: 'manana',
}

export function VisitRequestDialog({ property, onClose }: VisitRequestDialogProps) {
  const queryClient = useQueryClient()
  const [formError, setFormError] = useState<string | null>(null)
  const [succeeded, setSucceeded] = useState(false)

  const {
    register,
    handleSubmit,
    control,
    reset,
    setError,
    formState: { errors },
  } = useForm<VisitRequestFormValues, unknown, VisitRequestInput>({
    resolver: zodResolver(visitRequestSchema),
    mode: 'onBlur',
    defaultValues: EMPTY_VALUES,
  })

  useEffect(() => {
    if (property !== null) {
      reset(EMPTY_VALUES)
      setFormError(null)
      setSucceeded(false)
    }
  }, [property, reset])

  const mutation = useMutation({
    mutationFn: (values: VisitRequestInput) => {
      if (property === null) throw new Error('No hay propiedad seleccionada.')
      return createVisitRequest(property.id, values)
    },
    onSuccess: () => {
      setSucceeded(true)
      void queryClient.invalidateQueries({ queryKey: queryKeys.visitRequests.all })
      void queryClient.invalidateQueries({ queryKey: queryKeys.reports.all })
    },
    onError: (error: unknown) => {
      setFormError(
        applyApiErrorToForm(error, setError, [
          'nombreCompleto',
          'correo',
          'telefono',
          'fechaSugerida',
          'horario',
        ]),
      )
    },
  })

  function onSubmit(values: VisitRequestInput) {
    setFormError(null)
    mutation.mutate(values)
  }

  return (
    <Dialog
      open={property !== null}
      onOpenChange={(next) => {
        if (!next) onClose()
      }}
    >
      {property !== null && (
        <DialogContent title={MESSAGES.visit.title} description={property.titulo}>
          {succeeded ? (
            <div className="flex flex-col items-center gap-4 px-7 py-10 text-center">
              <p className="text-sm font-semibold text-foreground">{MESSAGES.visit.successTitle}</p>
              <p className="max-w-xs text-xs leading-relaxed text-muted-foreground text-pretty">
                {MESSAGES.visit.successBody}
              </p>
              <p className="max-w-xs text-xs leading-relaxed text-muted-foreground text-pretty">
                {MESSAGES.visit.existingClientNotice}
              </p>
              <Button variant="primary" size="md" className="mt-2" onClick={onClose}>
                {MESSAGES.actions.close}
              </Button>
            </div>
          ) : (
            <form onSubmit={(event) => void handleSubmit(onSubmit)(event)} noValidate>
              <DialogBody>
                <TextField
                  label={MESSAGES.visit.nameLabel}
                  autoComplete="name"
                  placeholder={MESSAGES.visit.namePlaceholder}
                  error={errors.nombreCompleto?.message}
                  {...register('nombreCompleto')}
                />

                <TextField
                  label={MESSAGES.visit.emailLabel}
                  type="email"
                  autoComplete="email"
                  spellCheck={false}
                  placeholder={MESSAGES.visit.emailPlaceholder}
                  error={errors.correo?.message}
                  {...register('correo')}
                />

                <TextField
                  label={MESSAGES.visit.phoneLabel}
                  type="tel"
                  autoComplete="tel"
                  spellCheck={false}
                  placeholder={MESSAGES.visit.phonePlaceholder}
                  error={errors.telefono?.message}
                  {...register('telefono')}
                />

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <TextField
                    label={MESSAGES.visit.dateLabel}
                    type="date"
                    min={todayAsIsoDate()}
                    error={errors.fechaSugerida?.message}
                    {...register('fechaSugerida')}
                  />

                  <Controller
                    control={control}
                    name="horario"
                    render={({ field }) => (
                      <fieldset className="flex flex-col gap-1.5">
                        <legend className="mb-1.5 text-xs font-medium uppercase tracking-wide text-foreground">
                          {MESSAGES.visit.slotLabel}
                        </legend>
                        <div className="flex">
                          {VISIT_SLOTS.map((slot, index) => (
                            <button
                              key={slot}
                              type="button"
                              aria-pressed={field.value === slot}
                              onClick={() => {
                                field.onChange(slot)
                              }}
                              className={cn(
                                'flex-1 cursor-pointer border px-2 py-2.5 text-xs font-medium uppercase tracking-wide transition-colors duration-150 ease-out motion-reduce:transition-none',
                                index > 0 && '-ml-px',
                                field.value === slot
                                  ? 'border-foreground bg-foreground text-white'
                                  : 'border-border bg-transparent text-muted-foreground hover:border-foreground hover:text-foreground',
                              )}
                            >
                              {VISIT_SLOT_LABELS[slot]}
                            </button>
                          ))}
                        </div>
                      </fieldset>
                    )}
                  />
                </div>

                {formError !== null && (
                  <p
                    role="alert"
                    className="border border-destructive px-3 py-2 text-xs font-medium text-destructive"
                  >
                    {formError}
                  </p>
                )}
              </DialogBody>

              <DialogFooter>
                <Button variant="secondary" size="md" onClick={onClose}>
                  {MESSAGES.actions.cancel}
                </Button>
                <Button type="submit" size="md" disabled={mutation.isPending}>
                  {mutation.isPending ? MESSAGES.visit.submitting : MESSAGES.visit.submit}
                </Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      )}
    </Dialog>
  )
}
