import Swal from 'sweetalert2'

// SweetAlert2 inserta sus ventanas al final del body, por eso se estilizan con clases de Tailwind.
const customClass = {
  popup: 'rounded-2xl! bg-white! dark:bg-gray-900! dark:text-white/90!',
  title: 'text-gray-800! dark:text-white/90! text-xl! font-semibold!',
  htmlContainer: 'text-gray-500! dark:text-gray-400! text-sm!',
  actions: 'gap-3!',
  confirmButton:
    'rounded-lg bg-brand-500 px-5 py-3 text-sm font-medium text-white shadow-theme-xs transition hover:bg-brand-600',
  cancelButton:
    'rounded-lg bg-white px-5 py-3 text-sm font-medium text-gray-700 ring-1 ring-inset ring-gray-300 transition hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-300 dark:ring-gray-700 dark:hover:bg-white/5',
}

const dangerClass = {
  ...customClass,
  confirmButton:
    'rounded-lg bg-error-500 px-5 py-3 text-sm font-medium text-white shadow-theme-xs transition hover:bg-error-600',
}

const toast = Swal.mixin({
  toast: true,
  position: 'top-end',
  showConfirmButton: false,
  timer: 3000,
  timerProgressBar: true,
  customClass: { popup: 'rounded-xl! bg-white! dark:bg-gray-900! dark:text-white/90!' },
})

interface ConfirmOptions {
  title: string
  text?: string
  confirmText?: string
}

export const confirmAction = async ({ title, text, confirmText = 'Aceptar' }: ConfirmOptions) => {
  const result = await Swal.fire({
    title,
    text,
    icon: 'question',
    showCancelButton: true,
    confirmButtonText: confirmText,
    cancelButtonText: 'Cancelar',
    buttonsStyling: false,
    reverseButtons: true,
    customClass,
  })
  return result.isConfirmed
}

export const confirmDelete = async (text: string) => {
  const result = await Swal.fire({
    title: '¿Eliminar registro?',
    text,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Sí, eliminar',
    cancelButtonText: 'Cancelar',
    buttonsStyling: false,
    reverseButtons: true,
    customClass: dangerClass,
  })
  return result.isConfirmed
}

export const showSuccess = (title: string) => toast.fire({ icon: 'success', title })

export const showError = (text: string, title = 'No se pudo completar la acción') =>
  Swal.fire({
    title,
    text,
    icon: 'error',
    confirmButtonText: 'Entendido',
    buttonsStyling: false,
    customClass,
  })
