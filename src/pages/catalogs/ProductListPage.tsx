import { createProduct, deleteProduct, listProducts, updateProduct } from '@/api/products'
import CatalogListView from '@/components/catalogs/CatalogListView'
import type { CatalogResource } from '@/interfaces'
import { CubeIcon } from '@heroicons/react/24/outline'

const resource: CatalogResource = {
  title: 'Productos',
  description: 'Administra los productos que se venden en los tickets.',
  newLabel: 'Nuevo producto',
  singular: 'el producto',
  icon: CubeIcon,
  emptyTitle: 'No hay productos',
  list: listProducts,
  create: createProduct,
  update: updateProduct,
  remove: deleteProduct,
}

export default function ProductListPage() {
  return <CatalogListView resource={resource} />
}
