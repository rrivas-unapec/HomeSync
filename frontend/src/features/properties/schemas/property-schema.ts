import { z } from 'zod'
import { FIELD_LIMITS, PROPERTY_STATES, PROPERTY_TYPES } from '@/lib/domain'
import { MESSAGES } from '@/lib/messages'

const priceSchema = z
  .string()
  .trim()
  .min(1, MESSAGES.validation.required)
  .refine((value) => /^\d+(\.\d{1,2})?$/.test(value), MESSAGES.validation.priceScale)
  .refine((value) => Number(value) > 0, MESSAGES.validation.positiveNumber)
  .transform(Number)

const countSchema = z
  .string()
  .trim()
  .min(1, MESSAGES.validation.required)
  .refine((value) => /^\d+$/.test(value), MESSAGES.validation.nonNegativeInteger)
  .transform(Number)
  .refine((value) => value <= 999, MESSAGES.validation.nonNegativeInteger)

const optionalUrlSchema = z
  .string()
  .trim()
  .max(FIELD_LIMITS.propertyPhotoUrl, MESSAGES.validation.maxLength(FIELD_LIMITS.propertyPhotoUrl))
  .refine((value) => value.length === 0 || /^https?:\/\/\S+$/.test(value), MESSAGES.validation.url)
  .transform((value) => (value.length === 0 ? null : value))

const optionalTextSchema = z
  .string()
  .trim()
  .transform((value) => (value.length === 0 ? null : value))

const propertyBaseSchema = z.object({
  titulo: z
    .string()
    .trim()
    .min(1, MESSAGES.validation.required)
    .max(FIELD_LIMITS.propertyTitle, MESSAGES.validation.maxLength(FIELD_LIMITS.propertyTitle)),
  descripcion: optionalTextSchema,
  tipo: z.enum(PROPERTY_TYPES),
  precio: priceSchema,
  ubicacionZona: z
    .string()
    .trim()
    .min(1, MESSAGES.validation.required)
    .max(FIELD_LIMITS.propertyZone, MESSAGES.validation.maxLength(FIELD_LIMITS.propertyZone)),
  habitaciones: countSchema,
  banos: countSchema,
  parqueos: countSchema,
  fotoUrl: optionalUrlSchema,
})

export const propertyCreateSchema = propertyBaseSchema

export const propertyUpdateSchema = propertyBaseSchema.extend({
  estado: z.enum(PROPERTY_STATES),
})

export type PropertyFormValues = z.input<typeof propertyUpdateSchema>
export type PropertyCreateInput = z.output<typeof propertyCreateSchema>
export type PropertyUpdateInput = z.output<typeof propertyUpdateSchema>
