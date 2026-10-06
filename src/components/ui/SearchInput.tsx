import type { InputHTMLAttributes, Ref } from 'react'
import searchIcon from '@/assets/icons/search.svg'
import { cn } from '@/lib/cn'

interface SearchInputProps extends InputHTMLAttributes<HTMLInputElement> {
  ref?: Ref<HTMLInputElement>
  /** Clases del contenedor (borde, radio). El input ocupa el resto. */
  containerClassName?: string
}

/** Input del kit con ícono de búsqueda. Compatible con `register()` de React Hook Form. */
export function SearchInput({ ref, containerClassName, className, ...props }: SearchInputProps) {
  return (
    <div
      className={cn(
        'flex items-center gap-3 rounded-4xl border border-border bg-input px-4 py-2',
        'focus-within:border-brand',
        containerClassName,
      )}
    >
      <input
        ref={ref}
        type="search"
        autoComplete="off"
        className={cn(
          'min-w-0 flex-1 bg-transparent text-field font-normal text-text-primary outline-none',
          'placeholder:text-placeholder [&::-webkit-search-cancel-button]:hidden',
          className,
        )}
        {...props}
      />
      <img src={searchIcon} alt="" width={16} height={16} />
    </div>
  )
}
