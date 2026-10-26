import { createLand, deleteLand, listLands, updateLand } from '@/api/lands'
import CatalogListView from '@/components/catalogs/CatalogListView'
import type { CatalogResource } from '@/interfaces'
import { MapPinIcon } from '@heroicons/react/24/outline'

const resource: CatalogResource = {
  title: 'Ubicaciones',
  description: 'Administra las ubicaciones donde se registran los tickets.',
  newLabel: 'Nueva ubicación',
  singular: 'la ubicación',
  icon: MapPinIcon,
  emptyTitle: 'No hay ubicaciones',
  list: listLands,
  create: createLand,
  update: updateLand,
  remove: deleteLand,
}

export default function LandListPage() {
  return <CatalogListView resource={resource} />
}
