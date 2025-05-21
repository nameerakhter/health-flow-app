export function Spinner() {
  return (
    <div className="flex h-screen w-screen items-center justify-center">
      <div className="h-10 w-10 animate-spin rounded-full border-t-2 border-b-2 border-gray-900 dark:border-white" />
    </div>
  )
}