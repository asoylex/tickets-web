import type { Role } from '@/interfaces'
import {
  ArrowUpTrayIcon,
  BanknotesIcon,
  BuildingStorefrontIcon,
  CubeIcon,
  DocumentTextIcon,
  MapPinIcon,
} from '@heroicons/react/24/outline'

export interface NavItem {
  label: string
  path: string
  icon: typeof DocumentTextIcon
  roles?: Role[]
}

export interface NavGroup {
  title: string
  items: NavItem[]
}

// Si un item no define "roles", lo ve cualquier usuario con sesión.
export const navigation: NavGroup[] = [
  {
    title: 'Operación',
    items: [
      { label: 'Tickets', path: '/tickets', icon: DocumentTextIcon },
      { label: 'Pagos', path: '/payments', icon: BanknotesIcon },
    ],
  },
  {
    title: 'Catálogos',
    items: [
      { label: 'Proveedores', path: '/suppliers', icon: BuildingStorefrontIcon },
      { label: 'Ubicaciones', path: '/lands', icon: MapPinIcon },
      { label: 'Productos', path: '/products', icon: CubeIcon },
    ],
  },
  {
    title: 'Administración',
    items: [{ label: 'Importar', path: '/imports', icon: ArrowUpTrayIcon, roles: ['admin'] }],
  },
]
