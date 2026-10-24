import Card from '@/components/ui/Card'
import type { ImportAnalysis, ImportOptions, ImportPreview } from '@/interfaces'
import { formatCount } from '@/utils/format'
import type { ReactNode } from 'react'

interface ImportReportProps {
  analysis: ImportAnalysis
  options: ImportOptions
  preview: ImportPreview
  onOptionChange: <K extends keyof ImportOptions>(key: K, value: ImportOptions[K]) => void
}

const SAMPLE_SIZE = 5

function Section({ title, description, children }: { title: string; description: string; children: ReactNode }) {
  return (
    <div className="border-b border-gray-100 p-5 last:border-b-0 dark:border-gray-800">
      <h3 className="text-base font-medium text-gray-800 dark:text-white/90">{title}</h3>
      <p className="mt-1 mb-3 text-theme-sm text-gray-500 dark:text-gray-400">{description}</p>
      {children}
    </div>
  )
}

function Sample({ items, total }: { items: string[]; total: number }) {
  return (
    <ul className="mt-3 space-y-1 text-theme-xs text-gray-500 dark:text-gray-400">
      {items.slice(0, SAMPLE_SIZE).map((item) => (
        <li key={item}>{item}</li>
      ))}
      {total > SAMPLE_SIZE && <li>… y {total - SAMPLE_SIZE} más</li>}
    </ul>
  )
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <Card className="p-4">
      <p className="text-theme-xs text-gray-500 dark:text-gray-400">{label}</p>
      <p className="mt-1 text-xl font-semibold text-gray-800 dark:text-white/90">{value}</p>
    </Card>
  )
}

const catalogLabels = { suppliers: 'Proveedores', lands: 'Ubicaciones', products: 'Productos' } as const

export default function ImportReport({ analysis, options, preview, onOptionChange }: ImportReportProps) {
  const { conflicts, errors, warnings, catalogs } = analysis
  const hasConflicts =
    conflicts.existingTickets.length > 0 ||
    conflicts.duplicateLines.length > 0 ||
    conflicts.zeroQuantityLines.length > 0 ||
    conflicts.nameMismatches.length > 0

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-3 xl:grid-cols-6">
        <Stat label="Filas" value={String(analysis.summary.rows)} />
        <Stat label="Tickets" value={`${analysis.tickets.new} nuevos de ${analysis.tickets.total}`} />
        {(Object.keys(catalogLabels) as (keyof typeof catalogLabels)[]).map((key) => (
          <Stat key={key} label={catalogLabels[key]} value={`${catalogs[key].new} nuevos de ${catalogs[key].total}`} />
        ))}
        <Stat label="Líneas" value={String(analysis.summary.lines)} />
      </div>

      {errors.length > 0 && (
        <Card className="border-error-200 bg-error-50 p-5 dark:border-error-500/30 dark:bg-error-500/10">
          <h3 className="font-medium text-error-700 dark:text-error-500">
            El archivo tiene {formatCount(errors.length, 'error', 'errores')} y no se puede importar
          </h3>
          <ul className="mt-2 space-y-1 text-theme-sm text-error-700 dark:text-error-500">
            {errors.slice(0, 10).map((error) => (
              <li key={`${error.rowNumber}-${error.message}`}>
                Fila {error.rowNumber}: {error.message}
              </li>
            ))}
            {errors.length > 10 && <li>… y {errors.length - 10} más</li>}
          </ul>
          <p className="mt-3 text-theme-xs text-error-700 dark:text-error-500">Corrige el archivo y súbelo de nuevo.</p>
        </Card>
      )}

      {warnings.length > 0 && (
        <Card className="border-warning-200 bg-warning-50 p-5 dark:border-warning-500/30 dark:bg-warning-500/10">
          <h3 className="font-medium text-warning-700 dark:text-orange-400">{formatCount(warnings.length, 'aviso', 'avisos')} (no bloquean la importación)</h3>
          <ul className="mt-2 space-y-1 text-theme-sm text-warning-700 dark:text-orange-400">
            {warnings.slice(0, SAMPLE_SIZE).map((warning) => (
              <li key={`${warning.rowNumber}-${warning.message}`}>
                Fila {warning.rowNumber}: {warning.message}
              </li>
            ))}
            {warnings.length > SAMPLE_SIZE && <li>… y {warnings.length - SAMPLE_SIZE} más</li>}
          </ul>
        </Card>
      )}

      {hasConflicts && (
        <Card>
          <div className="border-b border-gray-100 p-5 dark:border-gray-800">
            <h2 className="text-base font-semibold text-gray-800 dark:text-white/90">Decide qué hacer con los conflictos</h2>
          </div>

          {conflicts.existingTickets.length > 0 && (
            <Section
              title={`${formatCount(conflicts.existingTickets.length, 'ticket ya existe', 'tickets ya existen')} en el sistema`}
              description="El código del ticket ya está registrado."
            >
              <div className="space-y-2">
                <label className="flex items-start gap-3 text-theme-sm text-gray-700 dark:text-gray-300">
                  <input
                    type="radio"
                    name="existingTickets"
                    checked={options.existingTickets === 'skip'}
                    onChange={() => onOptionChange('existingTickets', 'skip')}
                    className="mt-1"
                  />
                  <span>
                    <strong>Omitirlos</strong> (recomendado): se dejan como están.
                  </span>
                </label>
                <label className="flex items-start gap-3 text-theme-sm text-gray-700 dark:text-gray-300">
                  <input
                    type="radio"
                    name="existingTickets"
                    checked={options.existingTickets === 'replace'}
                    onChange={() => onOptionChange('existingTickets', 'replace')}
                    className="mt-1"
                  />
                  <span>
                    <strong>Reemplazarlos</strong>: se borra el ticket actual con sus líneas y se crea de nuevo con los datos del archivo.
                  </span>
                </label>
              </div>
              <Sample items={conflicts.existingTickets.map((ticket) => `Ticket ${ticket.code} (${formatCount(ticket.lines, 'línea', 'líneas')})`)} total={conflicts.existingTickets.length} />
            </Section>
          )}

          {conflicts.duplicateLines.length > 0 && (
            <Section
              title={`${formatCount(conflicts.duplicateLines.length, 'línea repetida', 'líneas repetidas')}`}
              description="Mismo ticket, producto, cantidad y precio que otra línea anterior. Pueden ser cargas distintas o un error de captura."
            >
              <label className="flex items-center gap-3 text-theme-sm text-gray-700 dark:text-gray-300">
                <input type="checkbox" checked={options.skipDuplicateLines} onChange={(event) => onOptionChange('skipDuplicateLines', event.target.checked)} />
                Descartar las líneas repetidas
              </label>
              <Sample
                items={conflicts.duplicateLines.map((line) => `Fila ${line.rowNumber} repite la fila ${line.duplicateOf} (ticket ${line.ticketCode}, ${line.productCode})`)}
                total={conflicts.duplicateLines.length}
              />
            </Section>
          )}

          {conflicts.zeroQuantityLines.length > 0 && (
            <Section
              title={`${formatCount(conflicts.zeroQuantityLines.length, 'línea con cantidad 0', 'líneas con cantidad 0')}`}
              description="No aportan nada al pago, pero forman parte del archivo original."
            >
              <label className="flex items-center gap-3 text-theme-sm text-gray-700 dark:text-gray-300">
                <input type="checkbox" checked={options.skipZeroQuantity} onChange={(event) => onOptionChange('skipZeroQuantity', event.target.checked)} />
                Descartar las líneas con cantidad 0
              </label>
              <Sample
                items={conflicts.zeroQuantityLines.map((line) => `Fila ${line.rowNumber} (ticket ${line.ticketCode}, ${line.productCode})`)}
                total={conflicts.zeroQuantityLines.length}
              />
            </Section>
          )}

          {conflicts.nameMismatches.length > 0 && (
            <Section
              title={`${formatCount(conflicts.nameMismatches.length, 'nombre distinto', 'nombres distintos')} al guardado`}
              description="El código ya existe con otro nombre. Se conserva el nombre que ya está guardado."
            >
              <Sample
                items={conflicts.nameMismatches.map((item) => `${item.code}: en el archivo "${item.fileName}", guardado "${item.storedName}"`)}
                total={conflicts.nameMismatches.length}
              />
            </Section>
          )}
        </Card>
      )}

      <Card className="p-5">
        <h3 className="text-base font-medium text-gray-800 dark:text-white/90">Con estas opciones</h3>
        <ul className="mt-2 space-y-1 text-theme-sm text-gray-600 dark:text-gray-400">
          <li>Se crearán {formatCount(preview.ticketsToCreate, 'ticket', 'tickets')} y {formatCount(preview.linesToCreate, 'línea', 'líneas')} en total.</li>
          {preview.ticketsToReplace > 0 && <li className="font-medium text-error-600 dark:text-error-500">Se reemplazarán {formatCount(preview.ticketsToReplace, 'ticket existente', 'tickets existentes')}.</li>}
          {preview.ticketsToSkip > 0 && <li>Se omitirán {formatCount(preview.ticketsToSkip, 'ticket existente', 'tickets existentes')}.</li>}
          {preview.skippedDuplicateLines > 0 && <li>Se descartarán {formatCount(preview.skippedDuplicateLines, 'línea repetida', 'líneas repetidas')}.</li>}
          {preview.skippedZeroLines > 0 && <li>Se descartarán {formatCount(preview.skippedZeroLines, 'línea con cantidad 0', 'líneas con cantidad 0')}.</li>}
        </ul>
      </Card>
    </div>
  )
}
