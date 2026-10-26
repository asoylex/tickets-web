import { createSupplier, deleteSupplier, listSuppliers, updateSupplier } from '@/api/suppliers'
import CatalogListView from '@/components/catalogs/CatalogListView'
import type { CatalogResource } from '@/interfaces'
import { BuildingStorefrontIcon } from '@heroicons/react/24/outline'

const resource: CatalogResource = {
  title: 'Proveedores',
  description: 'Administra los proveedores de los tickets.',
  newLabel: 'Nuevo proveedor',
  singular: 'el proveedor',
  icon: BuildingStorefrontIcon,
  emptyTitle: 'No hay proveedores',
  list: listSuppliers,
  create: createSupplier,
  update: updateSupplier,
  remove: deleteSupplier,
}

export default function SupplierListPage() {
  return <CatalogListView resource={resource} />
}
