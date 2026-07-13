import { z } from 'zod'
import { FIELD_LIMITS } from '@/lib/domain'
import { MESSAGES } from '@/lib/messages'

export const loginSchema = z.object({
  correo: z
    .string()
    .trim()
    .min(1, MESSAGES.validation.required)
    .email(MESSAGES.validation.email)
    .max(FIELD_LIMITS.userEmail, MESSAGES.validation.maxLength(FIELD_LIMITS.userEmail)),
  contrasena: z.string().min(1, MESSAGES.validation.required),
})

export type LoginInput = z.infer<typeof loginSchema>

export const registerSchema = z.object({
  nombre: z
    .string()
    .trim()
    .min(1, MESSAGES.validation.required)
    .max(FIELD_LIMITS.userName, MESSAGES.validation.maxLength(FIELD_LIMITS.userName)),
  correo: z
    .string()
    .trim()
    .min(1, MESSAGES.validation.required)
    .email(MESSAGES.validation.email)
    .max(FIELD_LIMITS.userEmail, MESSAGES.validation.maxLength(FIELD_LIMITS.userEmail)),
  contrasena: z.string().min(8, MESSAGES.validation.minLength(8)),
})

export type RegisterInput = z.infer<typeof registerSchema>
