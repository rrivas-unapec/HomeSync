import { useState } from 'react'
import { toast } from 'sonner'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ConfirmDialog } from '@/components/ui/confirm-dialog'
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
import { isApiError } from '@/lib/api-error'
import { PROPERTY_STATE_LABELS, PROPERTY_TYPE_LABELS } from '@/lib/domain'
import { formatCurrency } from '@/lib/format'
import { MESSAGES } from '@/lib/messages'
import { PropertyFormDialog } from '../components/property-form-dialog'
import { useProperties } from '../hooks/use-properties'
import { useDeleteProperty, useUpdateProperty } from '../hooks/use-property-mutations'
import type { Property } from '../types/property'

export function AdminPropertiesPage() {
  const query = useProperties({})
  const deleteMutation = useDeleteProperty()
  const updateMutation = useUpdateProperty()

  const [formOpen, setFormOpen] = useState(false)
  const [editing, setEditing] = useState<Property | null>(null)
  const [deleting, setDeleting] = useState<Property | null>(null)
  const [deleteBlocked, setDeleteBlocked] = useState(false)

  function openCreate() {
    setEditing(null)
    setFormOpen(true)
  }

  function openEdit(property: Property) {
    setEditing(property)
    setFormOpen(true)
  }

  function closeForm() {
    setFormOpen(false)
    setEditing(null)
  }

  function closeDelete() {
    setDeleting(null)
    setDeleteBlocked(false)
  }

  function confirmDelete() {
    if (deleting === null) return

    deleteMutation.mutate(deleting.id, {
      onSuccess: () => {
        toast.success(MESSAGES.adminProperties.deleted)
        closeDelete()
      },
      onError: (error: unknown) => {
        if (isApiError(error) && error.kind === 'server') {
          setDeleteBlocked(true)
          return
        }
        toast.error(isApiError(error) ? error.message : MESSAGES.errors.unknown)
        closeDelete()
      },
    })
  }

  function markInactive() {
    if (deleting === null) return

    updateMutation.mutate(
      {
        id: deleting.id,
        input: {
          titulo: deleting.titulo,
          descripcion: deleting.descripcion,
          tipo: deleting.tipo,
          precio: deleting.precio,
          ubicacionZona: deleting.ubicacionZona,
          habitaciones: deleting.habitaciones,
          banos: deleting.banos,
          parqueos: deleting.parqueos,
          fotoUrl: deleting.fotoUrl,
          estado: 'inactiva',
        },
      },
      {
        onSuccess: () => {
          toast.success(MESSAGES.adminProperties.markedInactive)
          closeDelete()
        },
        onError: () => {
          toast.error(MESSAGES.errors.server)
        },
      },
    )
  }

  return (
    <>
      <PageHeader title={MESSAGES.adminProperties.title}>
        <Button size="md" onClick={openCreate}>
          {MESSAGES.adminProperties.createTitle}
        </Button>
      </PageHeader>

      <div className="px-6 py-8 md:px-8">
        {query.isPending ? (
          <Skeleton className="h-64 w-full" />
        ) : query.isError ? (
          <ErrorState
            message={MESSAGES.adminProperties.error}
            onRetry={() => {
              void query.refetch()
            }}
          />
        ) : query.data.length === 0 ? (
          <EmptyState
            message={MESSAGES.adminProperties.empty}
            actionLabel={MESSAGES.adminProperties.createTitle}
            onAction={openCreate}
          />
        ) : (
          <TableWrapper>
            <TableHead>
              <TableHeaderCell numeric>{MESSAGES.table.id}</TableHeaderCell>
              <TableHeaderCell>{MESSAGES.table.title}</TableHeaderCell>
              <TableHeaderCell>{MESSAGES.table.type}</TableHeaderCell>
              <TableHeaderCell numeric>{MESSAGES.table.price}</TableHeaderCell>
              <TableHeaderCell>{MESSAGES.table.zone}</TableHeaderCell>
              <TableHeaderCell>{MESSAGES.table.state}</TableHeaderCell>
              <TableHeaderCell>{MESSAGES.table.actions}</TableHeaderCell>
            </TableHead>
            <TableBody>
              {query.data.map((property) => (
                <TableRow key={property.id}>
                  <TableCell numeric className="text-muted-foreground">
                    {property.id}
                  </TableCell>
                  <TableCell className="max-w-xs">
                    <span className="line-clamp-2" title={property.titulo}>
                      {property.titulo}
                    </span>
                  </TableCell>
                  <TableCell>{PROPERTY_TYPE_LABELS[property.tipo]}</TableCell>
                  <TableCell numeric>{formatCurrency(property.precio)}</TableCell>
                  <TableCell className="text-muted-foreground">{property.ubicacionZona}</TableCell>
                  <TableCell>
                    <Badge tone={property.estado === 'disponible' ? 'neutral' : 'outline'}>
                      {PROPERTY_STATE_LABELS[property.estado]}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => {
                          openEdit(property)
                        }}
                      >
                        {MESSAGES.actions.edit}
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-destructive hover:text-destructive"
                        onClick={() => {
                          setDeleting(property)
                        }}
                      >
                        {MESSAGES.actions.delete}
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </TableWrapper>
        )}
      </div>

      <PropertyFormDialog open={formOpen} property={editing} onClose={closeForm} />

      <ConfirmDialog
        open={deleting !== null}
        onOpenChange={(next) => {
          if (!next) closeDelete()
        }}
        title={MESSAGES.adminProperties.deleteTitle}
        body={
          deleting === null
            ? ''
            : deleteBlocked
              ? MESSAGES.adminProperties.deleteBlocked
              : MESSAGES.adminProperties.deleteBody(deleting.titulo)
        }
        confirmLabel={
          deleteBlocked ? MESSAGES.adminProperties.markInactive : MESSAGES.actions.delete
        }
        destructive={!deleteBlocked}
        pending={deleteMutation.isPending || updateMutation.isPending}
        onConfirm={deleteBlocked ? markInactive : confirmDelete}
      />
    </>
  )
}
