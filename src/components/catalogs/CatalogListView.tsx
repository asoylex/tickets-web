import { getErrorMessage } from '@/api/errors'
import EmptyState from '@/components/common/EmptyState'
import PageHeader from '@/components/common/PageHeader'
import Input from '@/components/form/Input'
import Label from '@/components/form/Label'
import Select from '@/components/form/Select'
import Badge from '@/components/ui/Badge'
import Button from '@/components/ui/Button'
import Card from '@/components/ui/Card'
import Pagination from '@/components/ui/Pagination'
import Spinner from '@/components/ui/Spinner'
import { Table, TableBody, TableCell, TableHeader, TableRow } from '@/components/ui/Table'
import { useAuth } from '@/hooks/useAuth'
import { useCatalogList } from '@/hooks/useCatalogList'
import { useDebounce } from '@/hooks/useDebounce'
import type { CatalogItem, CatalogResource } from '@/interfaces'
import { confirmDelete, showError, showSuccess } from '@/utils/alerts'
import { cn } from '@/utils/cn'
import { MagnifyingGlassIcon, PencilSquareIcon, PlusIcon, TrashIcon } from '@heroicons/react/24/outline'
import { useState } from 'react'
import CatalogFormModal from './CatalogFormModal'

const PAGE_SIZE = 20

interface CatalogListViewProps {
  resource: CatalogResource
}

export default function CatalogListView({ resource }: CatalogListViewProps) {
  const { user } = useAuth()
  const isAdmin = user?.role === 'admin'
  const Icon = resource.icon

  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('')
  // undefined = el modal está cerrado; null = se está creando uno nuevo.
  const [editing, setEditing] = useState<CatalogItem | null | undefined>(undefined)

  const debouncedSearch = useDebounce(search)

  const filtersKey = [debouncedSearch.trim(), status].join('|')
  const [pageState, setPageState] = useState({ page: 1, filtersKey })
  if (pageState.filtersKey !== filtersKey) {
    setPageState({ page: 1, filtersKey })
  }
  const page = pageState.filtersKey === filtersKey ? pageState.page : 1
  const changePage = (nextPage: number) => setPageState({ page: nextPage, filtersKey })

  const { items, meta, loading, error, reload } = useCatalogList(resource.list, {
    search: debouncedSearch.trim() || undefined,
    isActive: status === '' ? undefined : status === 'true',
    page,
    limit: PAGE_SIZE,
  })

  const hasFilters = Boolean(search || status)

  const clearFilters = () => {
    setSearch('')
    setStatus('')
  }

  const handleSaved = () => {
    setEditing(undefined)
    reload()
  }

  const handleDelete = async (item: CatalogItem) => {
    const confirmed = await confirmDelete(`Se eliminará ${resource.singular} ${item.name} (${item.code}).`)
    if (!confirmed) return

    try {
      await resource.remove(item.id)
      showSuccess('Registro eliminado')
      // Si era el único de la última página, se retrocede una página para no quedar en una vacía.
      if (items.length === 1 && page > 1) changePage(page - 1)
      else reload()
    } catch (error) {
      showError(getErrorMessage(error))
    }
  }

  return (
    <>
      <PageHeader
        title={resource.title}
        description={resource.description}
        actions={
          isAdmin && (
            <Button startIcon={<PlusIcon className="size-4" />} onClick={() => setEditing(null)}>
              {resource.newLabel}
            </Button>
          )
        }
      />

      <Card>
        <div className="grid gap-4 p-5 sm:grid-cols-2">
          <div>
            <Label htmlFor="search">Buscar</Label>
            <Input
              id="search"
              icon={<MagnifyingGlassIcon className="size-5" />}
              placeholder="Código o nombre"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="status-filter">Estado</Label>
            <Select id="status-filter" value={status} onChange={(event) => setStatus(event.target.value)}>
              <option value="">Todos</option>
              <option value="true">Activos</option>
              <option value="false">Inactivos</option>
            </Select>
          </div>
        </div>

        {hasFilters && (
          <div className="flex justify-end px-5 pb-4">
            <Button variant="outline" size="sm" onClick={clearFilters}>
              Limpiar filtros
            </Button>
          </div>
        )}

        <div className="border-t border-gray-100 dark:border-gray-800">
          {error && (
            <div className="flex flex-col items-center gap-4 px-6 py-12 text-center">
              <p className="text-theme-sm text-error-600 dark:text-error-500">{error}</p>
              <Button variant="outline" size="sm" onClick={reload}>
                Reintentar
              </Button>
            </div>
          )}

          {loading && items.length === 0 && (
            <div className="flex justify-center py-16">
              <Spinner className="size-8 text-brand-500" />
            </div>
          )}

          {!loading && !error && items.length === 0 && (
            <EmptyState
              icon={Icon}
              title={resource.emptyTitle}
              description={hasFilters ? 'Prueba con otros filtros.' : 'Todavía no hay registros.'}
            />
          )}

          {items.length > 0 && (
            <div className={cn('transition-opacity', loading && 'opacity-60')}>
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent dark:hover:bg-transparent">
                    <TableCell header>Código</TableCell>
                    <TableCell header>Nombre</TableCell>
                    <TableCell header>Estado</TableCell>
                    {isAdmin && (
                      <TableCell header align="right">
                        Acciones
                      </TableCell>
                    )}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {items.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium text-gray-800 dark:text-white/90">{item.code}</TableCell>
                      <TableCell>{item.name}</TableCell>
                      <TableCell>
                        <Badge color={item.isActive ? 'success' : 'light'}>{item.isActive ? 'Activo' : 'Inactivo'}</Badge>
                      </TableCell>
                      {isAdmin && (
                        <TableCell align="right">
                          <div className="flex justify-end gap-1">
                            <button
                              type="button"
                              aria-label={`Editar ${item.name}`}
                              onClick={() => setEditing(item)}
                              className="flex size-9 items-center justify-center rounded-lg text-gray-500 transition hover:bg-gray-100 hover:text-brand-500 dark:text-gray-400 dark:hover:bg-white/5"
                            >
                              <PencilSquareIcon className="size-5" />
                            </button>
                            <button
                              type="button"
                              aria-label={`Eliminar ${item.name}`}
                              onClick={() => handleDelete(item)}
                              className="flex size-9 items-center justify-center rounded-lg text-gray-500 transition hover:bg-error-50 hover:text-error-600 dark:text-gray-400 dark:hover:bg-error-500/15"
                            >
                              <TrashIcon className="size-5" />
                            </button>
                          </div>
                        </TableCell>
                      )}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </div>

        {meta && (
          <Pagination page={meta.page} totalPages={meta.totalPages} total={meta.total} limit={meta.limit} onPageChange={changePage} />
        )}
      </Card>

      {editing !== undefined && (
        <CatalogFormModal resource={resource} item={editing} onClose={() => setEditing(undefined)} onSaved={handleSaved} />
      )}
    </>
  )
}
