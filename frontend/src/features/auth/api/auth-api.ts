import { httpClient } from '@/lib/http-client'
import type { Role } from '@/lib/domain'
import type { Session } from '../lib/session-storage'
import type { LoginInput, RegisterInput } from '../schemas/auth-schema'

interface LoginResponse {
  token: string
  expiraEn: string
  usuario: {
    id: number
    nombre: string
    correo: string
    rol: Role
    fechaCreacion: string
  }
}

export async function login(input: LoginInput): Promise<Session> {
  const { data } = await httpClient.post<LoginResponse>('/auth/login', input, {
    skipAuthHandling: true,
  })

  return {
    token: data.token,
    expiresAt: data.expiraEn,
    user: data.usuario,
  }
}

export async function register(input: RegisterInput): Promise<void> {
  await httpClient.post('/usuarios', {
    nombre: input.nombre,
    correo: input.correo,
    contrasena: input.contrasena,
    rol: 'cliente',
  })
}
