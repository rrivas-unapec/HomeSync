import { httpClient } from '@/lib/http-client'
import type { Client } from '../types/client'
import type { ClientCreateInput, ClientUpdateInput } from '../schemas/client-schema'

export async function fetchClients(): Promise<Client[]> {
  const { data } = await httpClient.get<Client[]>('/clientes')
  return data
}

export async function createClient(input: ClientCreateInput): Promise<Client> {
  const { data } = await httpClient.post<Client>('/clientes', input)
  return data
}

export async function updateClient(id: number, input: ClientUpdateInput): Promise<Client> {
  const { data } = await httpClient.put<Client>(`/clientes/${String(id)}`, input)
  return data
}
