import { z } from 'zod'
import { FIELD_LIMITS, VISIT_SLOTS } from '@/lib/domain'
import { isIsoDateInPast } from '@/lib/format'
import { MESSAGES } from '@/lib/messages'

export const visitRequestSchema = z.object({
  nombreCompleto: z
    .string()
    .trim()
    .min(1, MESSAGES.validation.required)
    .max(FIELD_LIMITS.clientName, MESSAGES.validation.maxLength(FIELD_LIMITS.clientName)),
  correo: z
    .string()
    .trim()
    .min(1, MESSAGES.validation.required)
    .email(MESSAGES.validation.email)
    .max(FIELD_LIMITS.clientEmail, MESSAGES.validation.maxLength(FIELD_LIMITS.clientEmail)),
  telefono: z
    .string()
    .trim()
    .max(FIELD_LIMITS.clientPhone, MESSAGES.validation.maxLength(FIELD_LIMITS.clientPhone))
    .transform((value) => (value.length === 0 ? null : value)),
  fechaSugerida: z
    .string()
    .min(1, MESSAGES.validation.required)
    .refine((value) => /^\d{4}-\d{2}-\d{2}$/.test(value), MESSAGES.validation.invalidDate)
    .refine((value) => !isIsoDateInPast(value), MESSAGES.validation.dateInPast),
  horario: z.enum(VISIT_SLOTS, { required_error: MESSAGES.validation.required }),
})

export type VisitRequestFormValues = z.input<typeof visitRequestSchema>
export type VisitRequestInput = z.output<typeof visitRequestSchema>
