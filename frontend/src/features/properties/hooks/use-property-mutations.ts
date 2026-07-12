import { useMutation, useQueryClient } from '@tanstack/react-query'
import { queryKeys } from '@/lib/query-keys'
import { createProperty, deleteProperty, updateProperty } from '../api/properties-api'
import type { PropertyCreateInput, PropertyUpdateInput } from '../schemas/property-schema'

function useInvalidateProperties() {
  const queryClient = useQueryClient()
  return () => {
    void queryClient.invalidateQueries({ queryKey: queryKeys.properties.all })
    void queryClient.invalidateQueries({ queryKey: queryKeys.reports.all })
    void queryClient.invalidateQueries({ queryKey: queryKeys.audit.all })
  }
}

export function useCreateProperty() {
  const invalidate = useInvalidateProperties()
  return useMutation({
    mutationFn: (input: PropertyCreateInput) => createProperty(input),
    onSuccess: invalidate,
  })
}

export function useUpdateProperty() {
  const invalidate = useInvalidateProperties()
  return useMutation({
    mutationFn: ({ id, input }: { id: number; input: PropertyUpdateInput }) =>
      updateProperty(id, input),
    onSuccess: invalidate,
  })
}

export function useDeleteProperty() {
  const invalidate = useInvalidateProperties()
  return useMutation({
    mutationFn: (id: number) => deleteProperty(id),
    onSettled: invalidate,
  })
}
