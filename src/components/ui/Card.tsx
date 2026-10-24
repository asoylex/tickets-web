import { cn } from '@/utils/cn'
import type { ReactNode } from 'react'

interface CardProps {
  children: ReactNode
  className?: string
}

export default function Card({ children, className }: CardProps) {
  return (
    <div className={cn('rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/3', className)}>
      {children}
    </div>
  )
}
