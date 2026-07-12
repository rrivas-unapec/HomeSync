import { useMemo, useState } from 'react'
import { toast } from 'sonner'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ConfirmDialog } from '@/components/ui/confirm-dialog'
import {
  SortableHeaderCell,
  TableBody,
  TableCell,
  TableHead,
  TableHeaderCell,
  TableRow,
  TableSkeleton,
  TableWrapper,
  type SortDirection,
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

type SortKey = 'titulo' | 'precio' | 'ubicacionZona'

interface SortState {
  key: SortKey | null
  direction: SortDirection
}

export function AdminPropertiesPage() {
  const query = useProperties({})
  const deleteMutation = useDeleteProperty()
  const updateMutation = useUpdateProperty()

  const [formOpen, setFormOpen] = useState(false)
  const [editing, setEditing] = useState<Property | null>(null)
  const [deleting, setDeleting] = useState<Property | null>(null)
  const [deleteBlocked, setDeleteBlocked] = useState(false)
  const [sort, setSort] = useState<SortState>({ key: null, direction: null })

  function toggleSort(key: SortKey) {
    setSort((current) => {
      if (current.key !== key) return { key, direction: 'asc' }
      if (current.direction === 'asc') return { key, direction: 'desc' }
      return { key: null, direction: null }
    })
  }

  const rows = useMemo(() => {
    const data = query.data ?? []
    const { key, direction } = sort
    if (key === null || direction === null) return data

    const factor = direction === 'asc' ? 1 : -1
    return [...data].sort((a, b) => {
      if (key === 'precio') return (a.precio - b.precio) * factor
      return a[key].localeCompare(b[key], 'es') * factor
    })
  }, [query.data, sort])

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
      <PageHeader
        title={MESSAGES.adminProperties.title}
        subtitle={MESSAGES.adminProperties.subtitle}
      >
        <Button size="md" onClick={openCreate}>
          {MESSAGES.adminProperties.createTitle}
        </Button>
      </PageHeader>

      <div className="px-6 py-8 md:px-8">
        {query.isPending ? (
          <TableSkeleton columns={7} />
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
              <TableHeaderCell numeric className="w-16">
                {MESSAGES.table.id}
              </TableHeaderCell>
              <SortableHeaderCell
                label={MESSAGES.table.title}
                direction={sort.key === 'titulo' ? sort.direction : null}
                onToggle={() => {
                  toggleSort('titulo')
                }}
              />
              <TableHeaderCell className="w-28">{MESSAGES.table.type}</TableHeaderCell>
              <SortableHeaderCell
                numeric
                label={MESSAGES.table.price}
                direction={sort.key === 'precio' ? sort.direction : null}
                onToggle={() => {
                  toggleSort('precio')
                }}
              />
              <SortableHeaderCell
                label={MESSAGES.table.zone}
                direction={sort.key === 'ubicacionZona' ? sort.direction : null}
                onToggle={() => {
                  toggleSort('ubicacionZona')
                }}
              />
              <TableHeaderCell className="w-32">{MESSAGES.table.state}</TableHeaderCell>
              <TableHeaderCell className="w-44">{MESSAGES.table.actions}</TableHeaderCell>
            </TableHead>
            <TableBody>
              {rows.map((property) => (
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
