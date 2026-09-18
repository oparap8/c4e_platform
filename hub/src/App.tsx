import { RouterProvider } from 'react-router-dom'
import { Toaster } from '@/components/ui/sonner'
import { router } from '@/router'

export function App() {
  return (
    <>
      <RouterProvider router={router} />
      <Toaster
        position="bottom-right"
        toastOptions={{
          classNames: {
            success: '!border-green-200 !bg-green-50 !text-green-800',
            error: '!border-red-200 !bg-red-50 !text-red-800',
            warning: '!border-amber-200 !bg-amber-50 !text-amber-800',
            info: '!border-blue-200 !bg-blue-50 !text-blue-800',
            icon: 'mt-0.5',
            title: 'font-semibold',
            description: 'text-muted-foreground',
            actionButton: 'bg-primary text-primary-foreground',
            cancelButton: 'bg-muted text-muted-foreground'
          }
        }}
      />
    </>
  )
}
