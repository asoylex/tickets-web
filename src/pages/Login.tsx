import { getErrorMessage } from '@/api/errors'
import PageLoader from '@/components/common/PageLoader'
import ThemeToggleButton from '@/components/common/ThemeToggleButton'
import Input from '@/components/form/Input'
import Label from '@/components/form/Label'
import Button from '@/components/ui/Button'
import { useAuth } from '@/hooks/useAuth'
import { showError } from '@/utils/alerts'
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline'
import { useState, type FormEvent } from 'react'
import { Navigate, useLocation } from 'react-router'

interface LocationState {
  from?: { pathname: string }
}

export default function Login() {
  const { user, loading, login } = useAuth()
  const location = useLocation()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({})

  if (loading) return <PageLoader />

  const from = (location.state as LocationState | null)?.from?.pathname ?? '/'
  if (user) return <Navigate to={from} replace />

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault()

    const nextErrors: typeof errors = {}
    if (!email.trim()) nextErrors.email = 'Ingresa tu correo'
    if (!password) nextErrors.password = 'Ingresa tu contraseña'
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) return

    setSubmitting(true)
    try {
      // Al guardarse el usuario, este componente redirige solo a la ruta de origen.
      await login(email.trim(), password)
    } catch (error) {
      setSubmitting(false)
      showError(getErrorMessage(error), 'No se pudo iniciar sesión')
    }
  }

  return (
    <div className="relative z-1 bg-white dark:bg-gray-900">
      <div className="flex min-h-screen w-full flex-col lg:flex-row">
        <div className="flex flex-1 items-center justify-center p-6">
          <div className="w-full max-w-md">
            <div className="mb-8">
              <h1 className="mb-2 text-title-sm font-semibold text-gray-800 sm:text-title-md dark:text-white/90">
                Iniciar sesión
              </h1>
              <p className="text-sm text-gray-500 dark:text-gray-400">Ingresa tu correo y contraseña para continuar.</p>
            </div>

            <form onSubmit={handleSubmit} noValidate className="space-y-6">
              <div>
                <Label htmlFor="email" required>
                  Correo electrónico
                </Label>
                <Input
                  id="email"
                  type="email"
                  autoComplete="username"
                  placeholder="correo@ejemplo.com"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  error={errors.email}
                />
              </div>

              <div>
                <Label htmlFor="password" required>
                  Contraseña
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="current-password"
                    placeholder="Tu contraseña"
                    className="pr-12"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    error={errors.password}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((current) => !current)}
                    aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                    className="absolute top-0 right-0 flex h-11 w-12 items-center justify-center text-gray-500 dark:text-gray-400"
                  >
                    {showPassword ? <EyeSlashIcon className="size-5" /> : <EyeIcon className="size-5" />}
                  </button>
                </div>
              </div>

              <Button type="submit" className="w-full" loading={submitting}>
                Iniciar sesión
              </Button>
            </form>
          </div>
        </div>

        <div className="hidden items-center justify-center bg-brand-950 lg:flex lg:w-1/2 dark:bg-white/5">
          <div className="flex max-w-xs flex-col items-center text-center">
            <img src="/favicon.svg" alt="" className="mb-5 size-14" />
            <h2 className="mb-2 text-2xl font-semibold text-white">Gestión de Tickets</h2>
            <p className="text-gray-400 dark:text-white/60">
              Registro de tickets de compra y pagos semanales por proveedor.
            </p>
          </div>
        </div>

        <div className="fixed right-6 bottom-6 z-50">
          <ThemeToggleButton />
        </div>
      </div>
    </div>
  )
}
