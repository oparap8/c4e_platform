import { useRouteError, isRouteErrorResponse } from 'react-router-dom'

export default function ErrorPage() {
  const error = useRouteError()

  let errorMessage = 'An unexpected error occurred.'
  if (isRouteErrorResponse(error)) {
    errorMessage = error.statusText || error.data
  } else if (error instanceof Error) {
    errorMessage = error.message
  }

  return (
    <div className="flex h-screen flex-col items-center justify-center bg-slate-50 text-slate-900">
      <h1 className="mb-4 text-4xl font-bold">Oops!</h1>
      <p className="mb-2 text-lg">Sorry, an unexpected error has occurred.</p>
      <p className="rounded bg-red-50 p-2 font-mono text-sm text-red-500">{errorMessage}</p>
    </div>
  )
}
