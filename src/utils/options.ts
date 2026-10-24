interface Selectable {
  id: number
  isActive: boolean
}

// En un selector solo se ofrecen los registros activos, más el que ya está elegido aunque se haya desactivado.
export const selectableOptions = <T extends Selectable>(options: T[], selectedId: string) =>
  options.filter((option) => option.isActive || String(option.id) === selectedId)
