import { useEffect, useMemo, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Dialog, DialogBody, DialogContent, DialogFooter } from '@/components/ui/dialog'
import { TextField } from '@/components/ui/field'
import { Skeleton } from '@/components/ui/skeleton'
import {
  TableBody,
  TableCell,
  TableHead,
  TableHeaderCell,
  TableRow,
  TableWrapper,
} from '@/components/ui/table'
import { EmptyState, ErrorState, PageHeader } from '@/components/shared/states'
import { formatTimestamp } from '@/lib/format'
import { MESSAGES } from '@/lib/messages'
import { applyApiErrorToForm } from '@/lib/apply-api-error'
import { queryKeys } from '@/lib/query-keys'
import { createClient, fetchClients, updateClient } from '../api/clients-api'
import {
  clientCreateSchema,
  clientUpdateSchema,
  type ClientCreateFormValues,
  type ClientCreateInput,
  type ClientUpdateFormValues,
  type ClientUpdateInput,
} from '../schemas/client-schema'
import type { Client } from '../types/client'

export function AdminClientsPage() {
  const queryClient = useQueryClient()
  const [creating, setCreating] = useState(false)
  const [editing, setEditing] = useState<Client | null>(null)

  const query = useQuery({
    queryKey: queryKeys.clients.list(),
    queryFn: fetchClients,
  })

  const rows = useMemo(() => {
    const data = query.data ?? []
    return [...data].sort((a, b) => a.nombreCompleto.localeCompare(b.nombreCompleto, 'es'))
  }, [query.data])

  function invalidate() {
    void queryClient.invalidateQueries({ queryKey: queryKeys.clients.all })
  }

  return (
    <>
      <PageHeader title={MESSAGES.adminClients.title}>
        <Button
          size="md"
          onClick={() => {
            setCreating(true)
          }}
        >
          {MESSAGES.adminClients.createTitle}
        </Button>
      </PageHeader>

      <div className="px-6 py-8 md:px-8">
        {query.isPending ? (
          <Skeleton className="h-64 w-full" />
        ) : query.isError ? (
          <ErrorState
            message={MESSAGES.adminClients.error}
            onRetry={() => {
              void query.refetch()
            }}
          />
        ) : rows.length === 0 ? (
          <EmptyState
            message={MESSAGES.adminClients.empty}
            actionLabel={MESSAGES.adminClients.createTitle}
            onAction={() => {
              setCreating(true)
            }}
          />
        ) : (
          <TableWrapper>
            <TableHead>
              <TableHeaderCell numeric>{MESSAGES.table.id}</TableHeaderCell>
              <TableHeaderCell>{MESSAGES.table.name}</TableHeaderCell>
              <TableHeaderCell>{MESSAGES.table.email}</TableHeaderCell>
              <TableHeaderCell>{MESSAGES.table.phone}</TableHeaderCell>
              <TableHeaderCell>{MESSAGES.table.registeredOn}</TableHeaderCell>
              <TableHeaderCell>{MESSAGES.table.actions}</TableHeaderCell>
            </TableHead>
            <TableBody>
              {rows.map((client) => (
                <TableRow key={client.id}>
                  <TableCell numeric className="text-muted-foreground">
                    {client.id}
                  </TableCell>
                  <TableCell>{client.nombreCompleto}</TableCell>
                  <TableCell className="text-muted-foreground">{client.correo}</TableCell>
                  <TableCell className="tabular-nums text-muted-foreground">
                    {client.telefono ?? MESSAGES.table.noPhone}
                  </TableCell>
                  <TableCell className="tabular-nums text-muted-foreground">
                    {formatTimestamp(client.fechaRegistro)}
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => {
                        setEditing(client)
                      }}
                    >
                      {MESSAGES.actions.edit}
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </TableWrapper>
        )}
      </div>

      <CreateClientDialog
        open={creating}
        onClose={() => {
          setCreating(false)
        }}
        onSaved={invalidate}
      />

      <EditClientDialog
        client={editing}
        onClose={() => {
          setEditing(null)
        }}
        onSaved={invalidate}
      />
    </>
  )
}

interface CreateClientDialogProps {
  open: boolean
  onClose: () => void
  onSaved: () => void
}

function CreateClientDialog({ open, onClose, onSaved }: CreateClientDialogProps) {
  const [formError, setFormError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors },
  } = useForm<ClientCreateFormValues, unknown, ClientCreateInput>({
    resolver: zodResolver(clientCreateSchema),
    mode: 'onBlur',
    defaultValues: { nombreCompleto: '', correo: '', telefono: '' },
  })

  const mutation = useMutation({
    mutationFn: createClient,
    onSuccess: () => {
      toast.success(MESSAGES.adminClients.created)
      reset()
      onSaved()
      onClose()
    },
    onError: (error: unknown) => {
      setFormError(applyApiErrorToForm(error, setError, ['nombreCompleto', 'correo', 'telefono']))
    },
  })

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        if (!next) onClose()
      }}
    >
      {open && (
        <DialogContent title={MESSAGES.adminClients.createTitle}>
          <form
            onSubmit={(event) =>
              void handleSubmit((values) => {
                setFormError(null)
                mutation.mutate(values)
              })(event)
            }
            noValidate
          >
            <DialogBody>
              <TextField
                label={MESSAGES.adminClients.fieldName}
                autoComplete="name"
                error={errors.nombreCompleto?.message}
                {...register('nombreCompleto')}
              />
              <TextField
                label={MESSAGES.adminClients.fieldEmail}
                type="email"
                spellCheck={false}
                error={errors.correo?.message}
                {...register('correo')}
              />
              <TextField
                label={MESSAGES.adminClients.fieldPhone}
                type="tel"
                spellCheck={false}
                error={errors.telefono?.message}
                {...register('telefono')}
              />
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
                {MESSAGES.actions.create}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      )}
    </Dialog>
  )
}

interface EditClientDialogProps {
  client: Client | null
  onClose: () => void
  onSaved: () => void
}

function EditClientDialog({ client, onClose, onSaved }: EditClientDialogProps) {
  const [formError, setFormError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors },
  } = useForm<ClientUpdateFormValues, unknown, ClientUpdateInput>({
    resolver: zodResolver(clientUpdateSchema),
    mode: 'onBlur',
    defaultValues: { nombreCompleto: '', telefono: '' },
  })

  useEffect(() => {
    if (client === null) return
    reset({ nombreCompleto: client.nombreCompleto, telefono: client.telefono ?? '' })
    setFormError(null)
  }, [client, reset])

  const mutation = useMutation({
    mutationFn: (values: ClientUpdateInput) => {
      if (client === null) throw new Error('No hay cliente seleccionado.')
      return updateClient(client.id, values)
    },
    onSuccess: () => {
      toast.success(MESSAGES.adminClients.updated)
      onSaved()
      onClose()
    },
    onError: (error: unknown) => {
      setFormError(applyApiErrorToForm(error, setError, ['nombreCompleto', 'telefono']))
    },
  })

  return (
    <Dialog
      open={client !== null}
      onOpenChange={(next) => {
        if (!next) onClose()
      }}
    >
      {client !== null && (
        <DialogContent
          title={MESSAGES.adminClients.editTitle}
          description={MESSAGES.adminClients.editDescription}
        >
          <form
            onSubmit={(event) =>
              void handleSubmit((values) => {
                setFormError(null)
                mutation.mutate(values)
              })(event)
            }
            noValidate
          >
            <DialogBody>
              <TextField
                label={MESSAGES.adminClients.fieldEmail}
                value={client.correo}
                readOnly
                disabled
              />
              <TextField
                label={MESSAGES.adminClients.fieldName}
                autoComplete="name"
                error={errors.nombreCompleto?.message}
                {...register('nombreCompleto')}
              />
              <TextField
                label={MESSAGES.adminClients.fieldPhone}
                type="tel"
                spellCheck={false}
                error={errors.telefono?.message}
                {...register('telefono')}
              />
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
                {MESSAGES.actions.save}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      )}
    </Dialog>
  )
}
