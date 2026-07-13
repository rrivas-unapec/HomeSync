import { z } from 'zod'
import { FIELD_LIMITS } from '@/lib/domain'
import { MESSAGES } from '@/lib/messages'

const nameSchema = z
  .string()
  .trim()
  .min(1, MESSAGES.validation.required)
  .max(FIELD_LIMITS.clientName, MESSAGES.validation.maxLength(FIELD_LIMITS.clientName))

const phoneSchema = z
  .string()
  .trim()
  .max(FIELD_LIMITS.clientPhone, MESSAGES.validation.maxLength(FIELD_LIMITS.clientPhone))
  .transform((value) => (value.length === 0 ? null : value))

export const clientCreateSchema = z.object({
  nombreCompleto: nameSchema,
  correo: z
    .string()
    .trim()
    .min(1, MESSAGES.validation.required)
    .email(MESSAGES.validation.email)
    .max(FIELD_LIMITS.clientEmail, MESSAGES.validation.maxLength(FIELD_LIMITS.clientEmail)),
  telefono: phoneSchema,
})

export const clientUpdateSchema = z.object({
  nombreCompleto: nameSchema,
  telefono: phoneSchema,
})

export type ClientCreateFormValues = z.input<typeof clientCreateSchema>
export type ClientCreateInput = z.output<typeof clientCreateSchema>
export type ClientUpdateFormValues = z.input<typeof clientUpdateSchema>
export type ClientUpdateInput = z.output<typeof clientUpdateSchema>
