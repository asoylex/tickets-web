import type { ImportAnalysis, ImportOptions, ImportPreview } from '@/interfaces'

export const MAX_IMPORT_FILE_SIZE = 5 * 1024 * 1024

export const DEFAULT_IMPORT_OPTIONS: ImportOptions = {
  existingTickets: 'skip',
  skipDuplicateLines: false,
  skipZeroQuantity: false,
}

// Las mismas reglas que aplica el servidor, para avisar antes de enviar un archivo que sería rechazado.
export const validateImportFile = (file: File): string | null => {
  if (!file.name.toLowerCase().endsWith('.xlsx')) return 'El archivo debe ser un Excel con extensión .xlsx'
  if (file.size > MAX_IMPORT_FILE_SIZE) return 'El archivo supera el tamaño máximo de 5 MB'
  return null
}

// Calcula qué se creará, reemplazará y omitirá con las opciones elegidas, igual que lo hará el servidor.
export const buildImportPreview = (analysis: ImportAnalysis, options: ImportOptions): ImportPreview => {
  const { existingTickets, duplicateLines, zeroQuantityLines } = analysis.conflicts
  const replace = options.existingTickets === 'replace'

  const existingCodes = new Set(existingTickets.map((ticket) => ticket.code))
  const isWritten = (ticketCode: string) => replace || !existingCodes.has(ticketCode)

  const skippedLinesOfExisting = replace ? 0 : existingTickets.reduce((sum, ticket) => sum + ticket.lines, 0)
  const writtenLines = analysis.summary.lines - skippedLinesOfExisting

  const skippedZeroLines = options.skipZeroQuantity ? zeroQuantityLines.filter((line) => isWritten(line.ticketCode)).length : 0

  // Con las líneas de cantidad 0 descartadas, sus copias ya no cuentan como duplicadas (el servidor las quita primero).
  const skippedDuplicateLines = options.skipDuplicateLines
    ? duplicateLines.filter((line) => isWritten(line.ticketCode) && !(options.skipZeroQuantity && line.quantity === 0)).length
    : 0

  return {
    ticketsToCreate: analysis.tickets.new,
    ticketsToReplace: replace ? analysis.tickets.existing : 0,
    ticketsToSkip: replace ? 0 : analysis.tickets.existing,
    linesToCreate: writtenLines - skippedZeroLines - skippedDuplicateLines,
    skippedDuplicateLines,
    skippedZeroLines,
    newCatalogs: {
      suppliers: analysis.catalogs.suppliers.new,
      lands: analysis.catalogs.lands.new,
      products: analysis.catalogs.products.new,
    },
    isDestructive: replace && analysis.tickets.existing > 0,
  }
}
