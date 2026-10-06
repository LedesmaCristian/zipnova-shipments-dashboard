import { CheckIcon } from './CheckIcon'

interface ToastProps {
  message: { id: number; text: string } | null
}

/**
 * Confirmación breve de una acción. `<output>` es una región `status` implícita; queda
 * siempre montada para que los lectores de pantalla anuncien cada mensaje nuevo.
 */
export function Toast({ message }: ToastProps) {
  return (
    <output
      aria-live="polite"
      className="pointer-events-none fixed inset-x-0 bottom-6 z-50 flex justify-center px-4"
    >
      {message && (
        // `key`: un mensaje repetido se vuelve a montar y se anuncia de nuevo.
        <p
          key={message.id}
          className="flex items-center gap-2 rounded-4xl border border-border bg-input py-2 pr-4 pl-2 text-small shadow-popover"
        >
          <span className="flex size-5 items-center justify-center rounded-full bg-brand">
            <CheckIcon />
          </span>
          {message.text}
        </p>
      )}
    </output>
  )
}
