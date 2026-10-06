import { useId, type Ref, type SelectHTMLAttributes } from 'react'
import chevronDownIcon from '@/assets/icons/chevron-down.svg'
import { cn } from '@/lib/cn'

interface SelectFieldProps extends SelectHTMLAttributes<HTMLSelectElement> {
  ref?: Ref<HTMLSelectElement>
  label: string
  options: readonly { value: string; label: string }[]
  placeholder: string
  hint?: string
  error?: string
}

/** Select nativo con el estilo del input del kit. Compatible con `register()` de React Hook Form. */
export function SelectField({
  ref,
  label,
  options,
  placeholder,
  hint,
  error,
  className,
  ...props
}: SelectFieldProps) {
  const id = useId()
  const messageId = `${id}-message`
  const message = error ?? hint

  return (
    <div className={cn('flex flex-col gap-2', className)}>
      <label htmlFor={id} className="text-small">
        {label}
      </label>
      <div className="relative">
        <select
          ref={ref}
          id={id}
          aria-invalid={Boolean(error)}
          aria-describedby={message ? messageId : undefined}
          className={cn(
            'w-full appearance-none rounded-4xl border border-border bg-input py-2 pr-10 pl-4',
            'text-field font-normal text-text-primary outline-none focus:border-brand',
            error && 'border-danger',
          )}
          {...props}
        >
          <option value="">{placeholder}</option>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <img
          src={chevronDownIcon}
          alt=""
          width={16}
          height={16}
          className="pointer-events-none absolute top-1/2 right-4 -translate-y-1/2"
        />
      </div>
      {message && (
        <p
          id={messageId}
          role={error ? 'alert' : undefined}
          className={cn('text-tiny', error ? 'text-danger' : 'text-text-secondary')}
        >
          {message}
        </p>
      )}
    </div>
  )
}
