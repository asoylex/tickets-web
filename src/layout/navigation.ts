import type { Role } from '@/interfaces'
import { BanknotesIcon, DocumentTextIcon } from '@heroicons/react/24/outline'

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
]
