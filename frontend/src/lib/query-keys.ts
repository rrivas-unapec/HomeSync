import type { PropertyFilters } from '@/features/properties/types/property'

export const queryKeys = {
  properties: {
    all: ['properties'] as const,
    list: (filters: PropertyFilters) => ['properties', 'list', filters] as const,
    detail: (id: number) => ['properties', 'detail', id] as const,
  },
  visitRequests: {
    all: ['visit-requests'] as const,
    list: () => ['visit-requests', 'list'] as const,
  },
  clients: {
    all: ['clients'] as const,
    list: () => ['clients', 'list'] as const,
  },
  users: {
    all: ['users'] as const,
    list: () => ['users', 'list'] as const,
  },
  audit: {
    all: ['audit'] as const,
    list: () => ['audit', 'list'] as const,
  },
  reports: {
    all: ['reports'] as const,
    distribution: () => ['reports', 'distribution'] as const,
    topRequested: (top: number) => ['reports', 'top-requested', top] as const,
  },
} as const
