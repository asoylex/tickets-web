import { cn } from '@/utils/cn'
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline'

interface PaginationProps {
  page: number
  totalPages: number
  total: number
  limit: number
  onPageChange: (page: number) => void
}

// Muestra siempre la primera y la última página, y las vecinas de la actual.
const getPageNumbers = (page: number, totalPages: number) => {
  if (totalPages <= 7) return Array.from({ length: totalPages }, (_, index) => index + 1)

  const pages: (number | string)[] = [1]
  const start = Math.max(2, page - 1)
  const end = Math.min(totalPages - 1, page + 1)

  if (start > 2) pages.push('gap-start')
  for (let current = start; current <= end; current++) pages.push(current)
  if (end < totalPages - 1) pages.push('gap-end')
  pages.push(totalPages)

  return pages
}

const arrowClass =
  'flex size-9 items-center justify-center rounded-lg text-gray-700 ring-1 ring-inset ring-gray-300 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 dark:text-gray-400 dark:ring-gray-700 dark:hover:bg-white/5'

export default function Pagination({ page, totalPages, total, limit, onPageChange }: PaginationProps) {
  if (total === 0) return null

  const from = (page - 1) * limit + 1
  const to = Math.min(page * limit, total)

  return (
    <div className="flex flex-col items-center justify-between gap-3 border-t border-gray-100 px-5 py-4 sm:flex-row dark:border-gray-800">
      <p className="text-theme-sm text-gray-500 dark:text-gray-400">
        Mostrando {from}–{to} de {total}
      </p>

      {totalPages > 1 && (
        <nav className="flex items-center gap-1.5" aria-label="Paginación">
          <button
            type="button"
            className={arrowClass}
            disabled={page <= 1}
            onClick={() => onPageChange(page - 1)}
            aria-label="Página anterior"
          >
            <ChevronLeftIcon className="size-4" />
          </button>

          {getPageNumbers(page, totalPages).map((item) =>
            typeof item === 'string' ? (
              <span key={item} className="px-1 text-gray-400">
                …
              </span>
            ) : (
              <button
                key={item}
                type="button"
                aria-current={item === page ? 'page' : undefined}
                onClick={() => onPageChange(item)}
                className={cn(
                  'size-9 rounded-lg text-sm font-medium transition',
                  item === page
                    ? 'bg-brand-500 text-white'
                    : 'text-gray-700 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-white/5',
                )}
              >
                {item}
              </button>
            ),
          )}

          <button
            type="button"
            className={arrowClass}
            disabled={page >= totalPages}
            onClick={() => onPageChange(page + 1)}
            aria-label="Página siguiente"
          >
            <ChevronRightIcon className="size-4" />
          </button>
        </nav>
      )}
    </div>
  )
}
