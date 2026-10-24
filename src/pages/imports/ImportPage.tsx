import PageHeader from '@/components/common/PageHeader'
import ImportReport from '@/components/imports/ImportReport'
import Button from '@/components/ui/Button'
import Card from '@/components/ui/Card'
import Spinner from '@/components/ui/Spinner'
import { useImportFlow } from '@/hooks/useImportFlow'
import type { ImportPreview } from '@/interfaces'
import { confirmAction, showSuccess } from '@/utils/alerts'
import { cn } from '@/utils/cn'
import { formatCount } from '@/utils/format'
import { ArrowUpTrayIcon, CheckCircleIcon } from '@heroicons/react/24/outline'
import { useEffect, useRef, useState, type DragEvent } from 'react'
import { useNavigate } from 'react-router'

// Segunda confirmación: el texto se arma solo con números y frases propias, nunca con datos del archivo.
const buildConfirmationHtml = (preview: ImportPreview) => {
  const items = [
    `<b>${formatCount(preview.ticketsToCreate, 'ticket nuevo', 'tickets nuevos')}</b> y <b>${formatCount(preview.linesToCreate, 'línea', 'líneas')}</b> en total`,
  ]
  if (preview.ticketsToReplace > 0) {
    items.push(`<b style="color:#d92d20">${formatCount(preview.ticketsToReplace, 'ticket existente se borrará', 'tickets existentes se borrarán')} y se creará de nuevo con los datos del archivo</b>`)
  }
  if (preview.ticketsToSkip > 0) items.push(`${formatCount(preview.ticketsToSkip, 'ticket existente se omitirá', 'tickets existentes se omitirán')}`)
  if (preview.skippedDuplicateLines > 0) items.push(`${formatCount(preview.skippedDuplicateLines, 'línea repetida se descartará', 'líneas repetidas se descartarán')}`)
  if (preview.skippedZeroLines > 0) items.push(`${formatCount(preview.skippedZeroLines, 'línea con cantidad 0 se descartará', 'líneas con cantidad 0 se descartarán')}`)

  return `<ul style="text-align:left;padding-left:1.25rem;list-style:disc">${items.map((item) => `<li>${item}</li>`).join('')}</ul>`
}

export default function ImportPage() {
  const navigate = useNavigate()
  const { phase, file, analysis, options, result, error, preview, selectFile, setOption, execute, reset } = useImportFlow()
  const [dragging, setDragging] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (phase === 'done') showSuccess('Importación completada')
  }, [phase])

  const pickFile = (files: FileList | File[] | null | undefined) => {
    const picked = files?.[0]
    if (picked) selectFile(picked)
  }

  const handleDrop = (event: DragEvent<HTMLLabelElement>) => {
    event.preventDefault()
    setDragging(false)
    pickFile(event.dataTransfer.files)
  }

  const handleImport = async () => {
    if (!preview) return
    const confirmed = await confirmAction({
      title: preview.isDestructive ? '¿Reemplazar tickets existentes?' : '¿Importar los datos?',
      html: buildConfirmationHtml(preview),
      confirmText: 'Sí, importar',
      danger: preview.isDestructive,
    })
    if (confirmed) await execute()
  }

  return (
    <>
      <PageHeader
        title="Importar tickets"
        description="Carga un archivo Excel con los tickets. Primero se analiza y se te muestra qué pasaría; no se guarda nada hasta que confirmes."
      />

      {(phase === 'idle' || phase === 'analyzing') && (
        <Card>
          <div className="p-5">
            <label
              onDragOver={(event) => {
                event.preventDefault()
                setDragging(true)
              }}
              onDragLeave={() => setDragging(false)}
              onDrop={handleDrop}
              className={cn(
                'flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed px-6 py-14 text-center transition',
                dragging ? 'border-brand-500 bg-brand-50 dark:bg-brand-500/10' : 'border-gray-300 hover:border-brand-300 dark:border-gray-700',
                phase === 'analyzing' && 'pointer-events-none opacity-60',
              )}
            >
              {phase === 'analyzing' ? <Spinner className="size-8 text-brand-500" /> : <ArrowUpTrayIcon className="size-8 text-gray-400" />}
              <span className="mt-3 text-theme-sm font-medium text-gray-800 dark:text-white/90">
                {phase === 'analyzing' ? `Analizando ${file?.name ?? 'el archivo'}…` : 'Arrastra tu archivo aquí o haz clic para elegirlo'}
              </span>
              <span className="mt-1 text-theme-xs text-gray-500 dark:text-gray-400">Excel .xlsx, máximo 5 MB</span>
              <input
                ref={inputRef}
                type="file"
                aria-label="Archivo Excel"
                accept=".xlsx"
                className="sr-only"
                onChange={(event) => {
                  pickFile(event.target.files)
                  event.target.value = ''
                }}
              />
            </label>
            {error && <p className="mt-4 text-theme-sm text-error-600 dark:text-error-500">{error}</p>}
          </div>
        </Card>
      )}

      {(phase === 'review' || phase === 'executing') && analysis && preview && (
        <div className="space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="text-theme-sm text-gray-600 dark:text-gray-400">
              Archivo: <strong className="text-gray-800 dark:text-white/90">{file?.name}</strong>
            </p>
            <Button variant="outline" size="sm" onClick={reset} disabled={phase === 'executing'}>
              Cambiar archivo
            </Button>
          </div>

          <ImportReport analysis={analysis} options={options} preview={preview} onOptionChange={setOption} />

          {error && <p className="text-theme-sm text-error-600 dark:text-error-500">{error}</p>}

          <div className="flex justify-end">
            <Button onClick={handleImport} loading={phase === 'executing'} disabled={!analysis.canImport}>
              {phase === 'executing' ? 'Importando…' : 'Importar'}
            </Button>
          </div>
        </div>
      )}

      {phase === 'done' && result && (
        <Card>
          <div className="flex flex-col items-center px-6 py-12 text-center">
            <CheckCircleIcon className="size-12 text-success-500" />
            <h2 className="mt-3 text-lg font-semibold text-gray-800 dark:text-white/90">Importación completada</h2>
            <ul className="mt-4 space-y-1 text-theme-sm text-gray-600 dark:text-gray-400">
              <li>{formatCount(result.tickets.created, 'ticket creado', 'tickets creados')} con {formatCount(result.lines.created, 'línea', 'líneas')}</li>
              {result.tickets.replaced > 0 && <li>{formatCount(result.tickets.replaced, 'ticket reemplazado', 'tickets reemplazados')}</li>}
              {result.tickets.skippedExisting > 0 && <li>{formatCount(result.tickets.skippedExisting, 'ticket existente omitido', 'tickets existentes omitidos')}</li>}
              {result.lines.skippedDuplicates > 0 && <li>{formatCount(result.lines.skippedDuplicates, 'línea repetida descartada', 'líneas repetidas descartadas')}</li>}
              {result.lines.skippedZeroQuantity > 0 && <li>{formatCount(result.lines.skippedZeroQuantity, 'línea con cantidad 0 descartada', 'líneas con cantidad 0 descartadas')}</li>}
              <li>
                Catálogos nuevos: {result.catalogs.suppliers.created} proveedores, {result.catalogs.lands.created} ubicaciones y {result.catalogs.products.created} productos
              </li>
            </ul>
            <div className="mt-6 flex gap-3">
              <Button variant="outline" onClick={reset}>
                Importar otro archivo
              </Button>
              <Button onClick={() => navigate('/tickets')}>Ver tickets</Button>
            </div>
          </div>
        </Card>
      )}
    </>
  )
}
