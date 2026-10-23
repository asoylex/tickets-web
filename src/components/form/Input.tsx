import { cn } from '@/utils/cn'
import type { InputHTMLAttributes } from 'react'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: string
  hint?: string
}

export default function Input({ error, hint, disabled, className, ...props }: InputProps) {
  return (
    <div>
      <input
        disabled={disabled}
        className={cn(
          'h-11 w-full appearance-none rounded-lg border px-4 py-2.5 text-sm shadow-theme-xs placeholder:text-gray-400 focus:ring-3 focus:outline-hidden dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30',
          disabled && 'cursor-not-allowed border-gray-300 bg-gray-100 text-gray-500 opacity-60 dark:border-gray-700 dark:bg-gray-800',
          !disabled && error && 'border-error-500 focus:border-error-300 focus:ring-error-500/20 dark:border-error-500',
          !disabled &&
            !error &&
            'border-gray-300 bg-transparent text-gray-800 focus:border-brand-300 focus:ring-brand-500/20 dark:border-gray-700 dark:focus:border-brand-800',
          className,
        )}
        {...props}
      />
      {error && <p className="mt-1.5 text-xs text-error-500">{error}</p>}
      {!error && hint && <p className="mt-1.5 text-xs text-gray-500">{hint}</p>}
    </div>
  )
}
