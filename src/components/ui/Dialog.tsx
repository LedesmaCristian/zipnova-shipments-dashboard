import { useEffect, useId, useRef, type ReactNode } from 'react'
import closeIcon from '@/assets/icons/x.svg'
import { IconButton } from './IconButton'

interface DialogProps {
  onClose: () => void
  title: string
  description?: string
  children: ReactNode
}

/**
 * Modal sobre `<dialog>` nativo: el navegador resuelve foco atrapado, Escape y backdrop.
 * Montarlo lo abre y desmontarlo lo cierra: el padre decide con un render condicional.
 */
export function Dialog({ onClose, title, description, children }: DialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const titleId = useId()
  const descriptionId = useId()

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return
    // El navegador solo restaura el foco en close(), no si el <dialog> se desmonta:
    // lo devolvemos a mano al elemento que lo abrió.
    const trigger = document.activeElement instanceof HTMLElement ? document.activeElement : null
    dialog.showModal()
    return () => {
      dialog.close()
      if (trigger?.isConnected) trigger.focus()
    }
  }, [])

  return (
    // Click en el backdrop = cerrar; el equivalente de teclado es Escape (evento `cancel`).
    // oxlint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-noninteractive-element-interactions
    <dialog
      ref={dialogRef}
      aria-labelledby={titleId}
      aria-describedby={description ? descriptionId : undefined}
      // Escape dispara `cancel`: lo convertimos en onClose para que React siga siendo la fuente de verdad.
      onCancel={(event) => {
        event.preventDefault()
        onClose()
      }}
      onClick={(event) => {
        // Click en el backdrop (el propio <dialog>, fuera del contenido) cierra.
        if (event.target === event.currentTarget) onClose()
      }}
      className="m-auto w-[min(420px,calc(100vw-32px))] rounded-l border border-border bg-surface-01 p-0 text-text-primary shadow-popover backdrop:bg-bg-accent/70"
    >
      <div className="flex flex-col gap-4 p-5">
        <header className="flex items-start justify-between gap-4">
          <div className="flex flex-col gap-1">
            <h2 id={titleId} className="text-regular font-semibold">
              {title}
            </h2>
            {description && (
              <p id={descriptionId} className="text-small text-text-secondary">
                {description}
              </p>
            )}
          </div>
          <IconButton
            icon={closeIcon}
            iconSize={16}
            label="Cerrar"
            onClick={onClose}
            className="p-1 hover:bg-row-hover"
          />
        </header>
        {children}
      </div>
    </dialog>
  )
}
