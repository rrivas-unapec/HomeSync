import { useQuery } from '@tanstack/react-query'
import { Badge } from '@/components/ui/badge'
import {
  TableBody,
  TableCell,
  TableHead,
  TableHeaderCell,
  TableRow,
  TableSkeleton,
  TableWrapper,
} from '@/components/ui/table'
import { EmptyState, ErrorState, PageHeader } from '@/components/shared/states'
import { httpClient } from '@/lib/http-client'
import { ROLE_LABELS, type Role } from '@/lib/domain'
import { formatTimestamp } from '@/lib/format'
import { MESSAGES } from '@/lib/messages'
import { queryKeys } from '@/lib/query-keys'

interface User {
  id: number
  nombre: string
  correo: string
  rol: Role
  fechaCreacion: string
}

async function fetchUsers(): Promise<User[]> {
  const { data } = await httpClient.get<User[]>('/usuarios')
  return data
}

export function AdminUsersPage() {
  const query = useQuery({
    queryKey: queryKeys.users.list(),
    queryFn: fetchUsers,
  })

  return (
    <>
      <PageHeader title={MESSAGES.adminUsers.title} subtitle={MESSAGES.adminUsers.subtitle} />

      <div className="px-6 py-8 md:px-8">
        {query.isPending ? (
          <TableSkeleton columns={5} />
        ) : query.isError ? (
          <ErrorState
            message={MESSAGES.adminUsers.error}
            onRetry={() => {
              void query.refetch()
            }}
          />
        ) : query.data.length === 0 ? (
          <EmptyState message={MESSAGES.adminUsers.empty} />
        ) : (
          <TableWrapper>
            <TableHead>
              <TableHeaderCell numeric>{MESSAGES.table.id}</TableHeaderCell>
              <TableHeaderCell>{MESSAGES.table.name}</TableHeaderCell>
              <TableHeaderCell>{MESSAGES.table.email}</TableHeaderCell>
              <TableHeaderCell>{MESSAGES.table.role}</TableHeaderCell>
              <TableHeaderCell>{MESSAGES.table.createdOn}</TableHeaderCell>
            </TableHead>
            <TableBody>
              {query.data.map((user) => (
                <TableRow key={user.id}>
                  <TableCell numeric className="text-muted-foreground">
                    {user.id}
                  </TableCell>
                  <TableCell>{user.nombre}</TableCell>
                  <TableCell className="text-muted-foreground">{user.correo}</TableCell>
                  <TableCell>
                    <Badge tone={user.rol === 'administrador' ? 'outline' : 'neutral'}>
                      {ROLE_LABELS[user.rol]}
                    </Badge>
                  </TableCell>
                  <TableCell className="tabular-nums text-muted-foreground">
                    {formatTimestamp(user.fechaCreacion)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </TableWrapper>
        )}
      </div>
    </>
  )
}
