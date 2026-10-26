import type { ComponentType, SVGProps } from 'react'
import type { CatalogFilters, CatalogItem, CatalogPayload } from './catalog.interface'
import type { Paginated } from './pagination.interface'

// Todo lo que cambia entre proveedores, ubicaciones y productos: los textos y las llamadas a la API.
export interface CatalogResource {
  title: string
  description: string
  newLabel: string
  singular: string
  icon: ComponentType<SVGProps<SVGSVGElement>>
  emptyTitle: string
  list: (filters: CatalogFilters) => Promise<Paginated<CatalogItem>>
  create: (payload: CatalogPayload) => Promise<CatalogItem>
  update: (id: number, payload: CatalogPayload) => Promise<CatalogItem>
  remove: (id: number) => Promise<void>
}
