import { cn } from '@/utils/cn'
import type { ReactNode } from 'react'

interface BaseProps {
  children: ReactNode
  className?: string
}

export function Table({ children, className }: BaseProps) {
  return (
    <div className="overflow-x-auto">
      <table className={cn('min-w-full', className)}>{children}</table>
    </div>
  )
}

export function TableHeader({ children, className }: BaseProps) {
  return <thead className={cn('border-b border-gray-100 dark:border-gray-800', className)}>{children}</thead>
}

export function TableBody({ children, className }: BaseProps) {
  return <tbody className={cn('divide-y divide-gray-100 dark:divide-gray-800', className)}>{children}</tbody>
}

export function TableRow({ children, className }: BaseProps) {
  return <tr className={cn('transition-colors hover:bg-gray-50 dark:hover:bg-white/2', className)}>{children}</tr>
}

interface TableCellProps extends BaseProps {
  header?: boolean
  align?: 'left' | 'center' | 'right'
}

const alignments = { left: 'text-left', center: 'text-center', right: 'text-right' }

export function TableCell({ children, className, header = false, align = 'left' }: TableCellProps) {
  const Tag = header ? 'th' : 'td'
  return (
    <Tag
      className={cn(
        'px-5 py-4',
        alignments[align],
        header
          ? 'py-3 text-theme-xs font-medium whitespace-nowrap text-gray-500 dark:text-gray-400'
          : 'text-theme-sm text-gray-700 dark:text-gray-400',
        className,
      )}
    >
      {children}
    </Tag>
  )
}
