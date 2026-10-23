import type { ComponentType, SVGProps } from 'react'

interface EmptyStateProps {
  icon: ComponentType<SVGProps<SVGSVGElement>>
  title: string
  description?: string
}

export default function EmptyState({ icon: Icon, title, description }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
      <span className="mb-4 flex size-14 items-center justify-center rounded-full bg-gray-100 text-gray-400 dark:bg-white/5">
        <Icon className="size-7" />
      </span>
      <h3 className="text-base font-medium text-gray-800 dark:text-white/90">{title}</h3>
      {description && <p className="mt-1 text-theme-sm text-gray-500 dark:text-gray-400">{description}</p>}
    </div>
  )
}
