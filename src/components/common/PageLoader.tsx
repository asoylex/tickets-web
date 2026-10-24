import Spinner from '@/components/ui/Spinner'

export default function PageLoader() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <Spinner className="size-8 text-brand-500" />
    </div>
  )
}
