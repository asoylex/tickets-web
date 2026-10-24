import { getErrorMessage } from '@/api/errors'
import { deleteTicket } from '@/api/tickets'
import EmptyState from '@/components/common/EmptyState'
import PageHeader from '@/components/common/PageHeader'
import Input from '@/components/form/Input'
import Label from '@/components/form/Label'
import Select from '@/components/form/Select'
import Button from '@/components/ui/Button'
import Card from '@/components/ui/Card'
import Pagination from '@/components/ui/Pagination'
import Spinner from '@/components/ui/Spinner'
import { Table, TableBody, TableCell, TableHeader, TableRow } from '@/components/ui/Table'
import { useAuth } from '@/hooks/useAuth'
import { useLandOptions, useSupplierOptions } from '@/hooks/useCatalogOptions'
import { useDebounce } from '@/hooks/useDebounce'
import { useTickets } from '@/hooks/useTickets'
import type { TicketListItem } from '@/interfaces'
import { confirmDelete, showError, showSuccess } from '@/utils/alerts'
import { cn } from '@/utils/cn'
import { formatAmount, formatDate } from '@/utils/format'
import { DocumentTextIcon, MagnifyingGlassIcon, PencilSquareIcon, PlusIcon, TrashIcon } from '@heroicons/react/24/outline'
import { useState } from 'react'
import { useNavigate } from 'react-router'

const PAGE_SIZE = 20

export default function TicketListPage() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const isAdmin = user?.role === 'admin'

  const [search, setSearch] = useState('')
  const [supplierId, setSupplierId] = useState('')
  const [landId, setLandId] = useState('')
  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo] = useState('')

  const debouncedSearch = useDebounce(search)

  // La página se guarda junto con los filtros con los que se eligió; si los filtros cambian, se reinicia a la primera.
  const filtersKey = [debouncedSearch.trim(), supplierId, landId, dateFrom, dateTo].join('|')
  const [pageState, setPageState] = useState({ page: 1, filtersKey })
  if (pageState.filtersKey !== filtersKey) {
    setPageState({ page: 1, filtersKey })
  }
  const page = pageState.filtersKey === filtersKey ? pageState.page : 1
  const changePage = (nextPage: number) => setPageState({ page: nextPage, filtersKey })

  const suppliers = useSupplierOptions()
  const lands = useLandOptions()
  const { tickets, meta, loading, error, reload } = useTickets({
    search: debouncedSearch.trim(),
    supplierId,
    landId,
    dateFrom,
    dateTo,
    page,
    limit: PAGE_SIZE,
  })

  const hasFilters = Boolean(search || supplierId || landId || dateFrom || dateTo)
  const invalidRange = Boolean(dateFrom && dateTo && dateFrom > dateTo)

  const clearFilters = () => {
    setSearch('')
    setSupplierId('')
    setLandId('')
    setDateFrom('')
    setDateTo('')
  }

  const handleDelete = async (ticket: TicketListItem) => {
    const confirmed = await confirmDelete(`Se eliminará el ticket ${ticket.code} junto con todas sus líneas.`)
    if (!confirmed) return

    try {
      await deleteTicket(ticket.id)
      showSuccess('Ticket eliminado')
      // Si era el único de la última página, se retrocede una página para no quedar en una vacía.
      if (tickets.length === 1 && page > 1) changePage(page - 1)
      else reload()
    } catch (error) {
      showError(getErrorMessage(error))
    }
  }

  return (
    <>
      <PageHeader
        title="Tickets"
        description="Consulta y administra los tickets de compra."
        actions={
          <Button startIcon={<PlusIcon className="size-4" />} onClick={() => navigate('/tickets/new')}>
            Nuevo ticket
          </Button>
        }
      />

      <Card>
        <div className="grid gap-4 p-5 sm:grid-cols-2 xl:grid-cols-5">
          <div>
            <Label htmlFor="search">Buscar</Label>
            <Input
              id="search"
              icon={<MagnifyingGlassIcon className="size-5" />}
              placeholder="Código del ticket"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="supplier">Proveedor</Label>
            <Select id="supplier" value={supplierId} onChange={(event) => setSupplierId(event.target.value)}>
              <option value="">Todos</option>
              {suppliers.map((supplier) => (
                <option key={supplier.id} value={supplier.id}>
                  {supplier.name}
                </option>
              ))}
            </Select>
          </div>
          <div>
            <Label htmlFor="land">Ubicación</Label>
            <Select id="land" value={landId} onChange={(event) => setLandId(event.target.value)}>
              <option value="">Todas</option>
              {lands.map((land) => (
                <option key={land.id} value={land.id}>
                  {land.name}
                </option>
              ))}
            </Select>
          </div>
          <div>
            <Label htmlFor="dateFrom">Desde</Label>
            <Input id="dateFrom" type="date" value={dateFrom} onChange={(event) => setDateFrom(event.target.value)} />
          </div>
          <div>
            <Label htmlFor="dateTo">Hasta</Label>
            <Input
              id="dateTo"
              type="date"
              value={dateTo}
              error={invalidRange ? 'Debe ser igual o posterior a la fecha inicial' : undefined}
              onChange={(event) => setDateTo(event.target.value)}
            />
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

          {loading && tickets.length === 0 && (
            <div className="flex justify-center py-16">
              <Spinner className="size-8 text-brand-500" />
            </div>
          )}

          {!loading && !error && tickets.length === 0 && (
            <EmptyState
              icon={DocumentTextIcon}
              title="No hay tickets"
              description={hasFilters ? 'Prueba con otros filtros.' : 'Todavía no hay tickets registrados.'}
            />
          )}

          {tickets.length > 0 && (
            <div className={cn('transition-opacity', loading && 'opacity-60')}>
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent dark:hover:bg-transparent">
                    <TableCell header>Código</TableCell>
                    <TableCell header>Fecha</TableCell>
                    <TableCell header>Proveedor</TableCell>
                    <TableCell header>Ubicación</TableCell>
                    <TableCell header align="center">
                      Líneas
                    </TableCell>
                    <TableCell header align="right">
                      Total
                    </TableCell>
                    <TableCell header align="right">
                      Acciones
                    </TableCell>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {tickets.map((ticket) => (
                    <TableRow key={ticket.id}>
                      <TableCell className="font-medium text-gray-800 dark:text-white/90">{ticket.code}</TableCell>
                      <TableCell>{formatDate(ticket.date)}</TableCell>
                      <TableCell>
                        <span className="block">{ticket.supplier.name}</span>
                        <span className="block text-theme-xs text-gray-500">{ticket.supplier.code}</span>
                      </TableCell>
                      <TableCell>{ticket.land.name}</TableCell>
                      <TableCell align="center">{ticket.itemsCount}</TableCell>
                      <TableCell align="right" className="font-medium text-gray-800 dark:text-white/90">
                        {formatAmount(ticket.total)}
                      </TableCell>
                      <TableCell align="right">
                        <div className="flex justify-end gap-1">
                          <button
                            type="button"
                            aria-label={`Editar el ticket ${ticket.code}`}
                            onClick={() => navigate(`/tickets/${ticket.id}/edit`)}
                            className="flex size-9 items-center justify-center rounded-lg text-gray-500 transition hover:bg-gray-100 hover:text-brand-500 dark:text-gray-400 dark:hover:bg-white/5"
                          >
                            <PencilSquareIcon className="size-5" />
                          </button>
                          {isAdmin && (
                            <button
                              type="button"
                              aria-label={`Eliminar el ticket ${ticket.code}`}
                              onClick={() => handleDelete(ticket)}
                              className="flex size-9 items-center justify-center rounded-lg text-gray-500 transition hover:bg-error-50 hover:text-error-600 dark:text-gray-400 dark:hover:bg-error-500/15"
                            >
                              <TrashIcon className="size-5" />
                            </button>
                          )}
                        </div>
                      </TableCell>
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
    </>
  )
}
