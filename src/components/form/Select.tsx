import { cn } from '@/utils/cn'
import { ChevronDownIcon } from '@heroicons/react/24/outline'
import type { SelectHTMLAttributes } from 'react'

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  error?: string
}

export default function Select({ error, disabled, className, children, ...props }: SelectProps) {
  return (
    <div>
      <div className="relative">
        <select
          disabled={disabled}
          className={cn(
            'h-11 w-full appearance-none rounded-lg border bg-transparent py-2.5 pr-11 pl-4 text-sm text-gray-800 shadow-theme-xs focus:ring-3 focus:outline-hidden dark:bg-gray-900 dark:text-white/90',
            disabled && 'cursor-not-allowed border-gray-300 bg-gray-100 opacity-60 dark:border-gray-700 dark:bg-gray-800',
            !disabled && error && 'border-error-500 focus:border-error-300 focus:ring-error-500/20',
            !disabled &&
              !error &&
              'border-gray-300 focus:border-brand-300 focus:ring-brand-500/20 dark:border-gray-700 dark:focus:border-brand-800',
            className,
          )}
          {...props}
        >
          {children}
        </select>
        <ChevronDownIcon className="pointer-events-none absolute top-1/2 right-4 size-4 -translate-y-1/2 text-gray-500 dark:text-gray-400" />
      </div>
      {error && <p className="mt-1.5 text-xs text-error-500">{error}</p>}
    </div>
  )
}
