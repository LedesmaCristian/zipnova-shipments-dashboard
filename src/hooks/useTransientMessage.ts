import { useCallback, useEffect, useState } from 'react'

const DEFAULT_DURATION_MS = 3500

interface TransientMessage {
  id: number
  text: string
}

/**
 * Mensaje que se borra solo después de `durationMs` (feedback de acciones).
 * Cada `show` es un mensaje nuevo, aunque el texto se repita: reinicia el timer.
 */
export function useTransientMessage(durationMs = DEFAULT_DURATION_MS) {
  const [message, setMessage] = useState<TransientMessage | null>(null)

  useEffect(() => {
    if (!message) return
    const timeout = setTimeout(() => setMessage(null), durationMs)
    return () => clearTimeout(timeout)
  }, [message, durationMs])

  const show = useCallback(
    (text: string) => setMessage((previous) => ({ id: (previous?.id ?? 0) + 1, text })),
    [],
  )

  return [message, show] as const
}
