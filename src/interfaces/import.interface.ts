export type ExistingTicketsAction = 'skip' | 'replace'

// Decisiones del usuario sobre los conflictos, que se envían junto con el archivo.
export interface ImportOptions {
  existingTickets: ExistingTicketsAction
  skipDuplicateLines: boolean
  skipZeroQuantity: boolean
}

export interface ImportSummary {
  rows: number
  tickets: number
  lines: number
}

export interface ImportTicketCounts {
  total: number
  new: number
  existing: number
}

export interface ImportCatalogCounts {
  total: number
  new: number
  existing: number
}

export interface ImportCatalogsReport {
  suppliers: ImportCatalogCounts
  lands: ImportCatalogCounts
  products: ImportCatalogCounts
}

export interface ExistingTicketConflict {
  code: string
  lines: number
}

export interface DuplicateLineConflict {
  rowNumber: number
  duplicateOf: number
  ticketCode: string
  productCode: string
  quantity: number
}

export interface ZeroQuantityConflict {
  rowNumber: number
  ticketCode: string
  productCode: string
}

export interface NameMismatchConflict {
  catalog: 'suppliers' | 'lands' | 'products'
  code: string
  fileName: string
  storedName: string
}

export interface ImportConflicts {
  existingTickets: ExistingTicketConflict[]
  duplicateLines: DuplicateLineConflict[]
  zeroQuantityLines: ZeroQuantityConflict[]
  nameMismatches: NameMismatchConflict[]
}

export interface ImportRowIssue {
  rowNumber: number
  message: string
}

// Informe del análisis: no escribe nada, solo describe lo que pasaría al importar.
export interface ImportAnalysis {
  summary: ImportSummary
  tickets: ImportTicketCounts
  catalogs: ImportCatalogsReport
  conflicts: ImportConflicts
  errors: ImportRowIssue[]
  warnings: ImportRowIssue[]
  canImport: boolean
}

export interface ImportCreatedCount {
  created: number
}

export interface ImportResultCatalogs {
  suppliers: ImportCreatedCount
  lands: ImportCreatedCount
  products: ImportCreatedCount
}

export interface ImportResultTickets {
  created: number
  replaced: number
  skippedExisting: number
}

export interface ImportResultLines {
  created: number
  skippedDuplicates: number
  skippedZeroQuantity: number
}

export interface ImportResult {
  options: ImportOptions
  catalogs: ImportResultCatalogs
  tickets: ImportResultTickets
  lines: ImportResultLines
}
