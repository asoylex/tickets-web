import { Link } from 'react-router'

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 p-6 text-center dark:bg-gray-900">
      <p className="text-title-lg font-bold text-brand-500">404</p>
      <h1 className="mt-2 mb-2 text-xl font-semibold text-gray-800 dark:text-white/90">Página no encontrada</h1>
      <p className="mb-6 text-sm text-gray-500 dark:text-gray-400">La dirección que buscas no existe o fue movida.</p>
      <Link
        to="/"
        className="inline-flex items-center justify-center rounded-lg bg-brand-500 px-5 py-3 text-sm font-medium text-white shadow-theme-xs transition hover:bg-brand-600"
      >
        Volver al inicio
      </Link>
    </div>
  )
}
