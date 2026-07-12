import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Dialog, DialogBody, DialogContent, DialogFooter } from '@/components/ui/dialog'
import { SelectField, TextAreaField, TextField } from '@/components/ui/field'
import {
  PROPERTY_STATES,
  PROPERTY_STATE_LABELS,
  PROPERTY_TYPES,
  PROPERTY_TYPE_LABELS,
} from '@/lib/domain'
import { MESSAGES } from '@/lib/messages'
import { applyApiErrorToForm } from '@/lib/apply-api-error'
import { useCreateProperty, useUpdateProperty } from '../hooks/use-property-mutations'
import {
  propertyCreateSchema,
  propertyUpdateSchema,
  type PropertyCreateInput,
  type PropertyFormValues,
  type PropertyUpdateInput,
} from '../schemas/property-schema'
import type { Property } from '../types/property'

interface PropertyFormDialogProps {
  open: boolean
  property: Property | null
  onClose: () => void
}

const FIELD_NAMES = [
  'titulo',
  'descripcion',
  'tipo',
  'precio',
  'ubicacionZona',
  'habitaciones',
  'banos',
  'parqueos',
  'fotoUrl',
  'estado',
] as const

const EMPTY_VALUES: PropertyFormValues = {
  titulo: '',
  descripcion: '',
  tipo: 'alquiler',
  precio: '',
  ubicacionZona: '',
  habitaciones: '0',
  banos: '0',
  parqueos: '0',
  fotoUrl: '',
  estado: 'disponible',
}

function toFormValues(property: Property): PropertyFormValues {
  return {
    titulo: property.titulo,
    descripcion: property.descripcion ?? '',
    tipo: property.tipo,
    precio: String(property.precio),
    ubicacionZona: property.ubicacionZona,
    habitaciones: String(property.habitaciones),
    banos: String(property.banos),
    parqueos: String(property.parqueos),
    fotoUrl: property.fotoUrl ?? '',
    estado: property.estado,
  }
}

export function PropertyFormDialog({ open, property, onClose }: PropertyFormDialogProps) {
  const isEdit = property !== null
  const [formError, setFormError] = useState<string | null>(null)

  const createMutation = useCreateProperty()
  const updateMutation = useUpdateProperty()
  const isPending = createMutation.isPending || updateMutation.isPending

  const {
    register,
    handleSubmit,
    reset,
    setError,
    setFocus,
    formState: { errors },
  } = useForm<PropertyFormValues, unknown, PropertyUpdateInput>({
    resolver: zodResolver(isEdit ? propertyUpdateSchema : propertyCreateSchema),
    mode: 'onBlur',
    defaultValues: EMPTY_VALUES,
  })

  useEffect(() => {
    if (!open) return
    reset(property !== null ? toFormValues(property) : EMPTY_VALUES)
    setFormError(null)
  }, [open, property, reset])

  function onSubmit(values: PropertyUpdateInput) {
    setFormError(null)

    const handleError = (error: unknown) => {
      const message = applyApiErrorToForm(error, setError, FIELD_NAMES)
      setFormError(message)
      const firstInvalid = FIELD_NAMES.find((name) => name in errors)
      if (firstInvalid !== undefined) setFocus(firstInvalid)
    }

    if (isEdit) {
      updateMutation.mutate(
        { id: property.id, input: values },
        {
          onSuccess: () => {
            toast.success(MESSAGES.adminProperties.updated)
            onClose()
          },
          onError: handleError,
        },
      )
      return
    }

    const createInput: PropertyCreateInput = {
      titulo: values.titulo,
      descripcion: values.descripcion,
      tipo: values.tipo,
      precio: values.precio,
      ubicacionZona: values.ubicacionZona,
      habitaciones: values.habitaciones,
      banos: values.banos,
      parqueos: values.parqueos,
      fotoUrl: values.fotoUrl,
    }

    createMutation.mutate(createInput, {
      onSuccess: () => {
        toast.success(MESSAGES.adminProperties.created)
        onClose()
      },
      onError: handleError,
    })
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        if (!next) onClose()
      }}
    >
      {open && (
        <DialogContent
          title={isEdit ? MESSAGES.adminProperties.editTitle : MESSAGES.adminProperties.createTitle}
          description={
            isEdit
              ? MESSAGES.adminProperties.editDescription
              : MESSAGES.adminProperties.createDescription
          }
          className="max-w-lg"
        >
          <form onSubmit={(event) => void handleSubmit(onSubmit)(event)} noValidate>
            <DialogBody>
              <TextField
                label={MESSAGES.adminProperties.fieldTitle}
                error={errors.titulo?.message}
                {...register('titulo')}
              />

              <TextAreaField
                label={MESSAGES.adminProperties.fieldDescription}
                error={errors.descripcion?.message}
                {...register('descripcion')}
              />

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <SelectField
                  label={MESSAGES.adminProperties.fieldType}
                  error={errors.tipo?.message}
                  {...register('tipo')}
                >
                  {PROPERTY_TYPES.map((value) => (
                    <option key={value} value={value}>
                      {PROPERTY_TYPE_LABELS[value]}
                    </option>
                  ))}
                </SelectField>

                <TextField
                  label={MESSAGES.adminProperties.fieldPrice}
                  inputMode="decimal"
                  className="tabular-nums"
                  error={errors.precio?.message}
                  {...register('precio')}
                />
              </div>

              <TextField
                label={MESSAGES.adminProperties.fieldZone}
                error={errors.ubicacionZona?.message}
                {...register('ubicacionZona')}
              />

              <div className="grid grid-cols-3 gap-4">
                <TextField
                  label={MESSAGES.adminProperties.fieldBedrooms}
                  inputMode="numeric"
                  className="tabular-nums"
                  error={errors.habitaciones?.message}
                  {...register('habitaciones')}
                />
                <TextField
                  label={MESSAGES.adminProperties.fieldBathrooms}
                  inputMode="numeric"
                  className="tabular-nums"
                  error={errors.banos?.message}
                  {...register('banos')}
                />
                <TextField
                  label={MESSAGES.adminProperties.fieldParking}
                  inputMode="numeric"
                  className="tabular-nums"
                  error={errors.parqueos?.message}
                  {...register('parqueos')}
                />
              </div>

              <TextField
                label={MESSAGES.adminProperties.fieldPhotoUrl}
                type="url"
                spellCheck={false}
                hint={MESSAGES.adminProperties.fieldPhotoUrlHint}
                error={errors.fotoUrl?.message}
                {...register('fotoUrl')}
              />

              {isEdit && (
                <SelectField
                  label={MESSAGES.adminProperties.fieldState}
                  error={errors.estado?.message}
                  {...register('estado')}
                >
                  {PROPERTY_STATES.map((value) => (
                    <option key={value} value={value}>
                      {PROPERTY_STATE_LABELS[value]}
                    </option>
                  ))}
                </SelectField>
              )}

              {formError !== null && (
                <p
                  role="alert"
                  className="bg-destructive/10 px-3 py-2 text-xs font-medium text-destructive"
                >
                  {formError}
                </p>
              )}
            </DialogBody>

            <DialogFooter>
              <Button variant="secondary" size="md" onClick={onClose}>
                {MESSAGES.actions.cancel}
              </Button>
              <Button type="submit" size="md" disabled={isPending}>
                {isEdit ? MESSAGES.actions.save : MESSAGES.actions.create}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      )}
    </Dialog>
  )
}
