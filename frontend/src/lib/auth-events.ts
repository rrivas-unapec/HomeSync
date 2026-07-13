type UnauthorizedListener = () => void

const listeners = new Set<UnauthorizedListener>()

export const authEvents = {
  onUnauthorized(listener: UnauthorizedListener): () => void {
    listeners.add(listener)
    return () => {
      listeners.delete(listener)
    }
  },

  emitUnauthorized(): void {
    for (const listener of listeners) {
      listener()
    }
  },
}
