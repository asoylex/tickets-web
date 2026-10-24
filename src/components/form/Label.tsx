import { cn } from '@/utils/cn'
import type { LabelHTMLAttributes } from 'react'

interface LabelProps extends LabelHTMLAttributes<HTMLLabelElement> {
  required?: boolean
}

export default function Label({ required, className, children, ...props }: LabelProps) {
  return (
    <label className={cn('mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400', className)} {...props}>
      {children}
      {required && <span className="text-error-500"> *</span>}
    </label>
  )
}
