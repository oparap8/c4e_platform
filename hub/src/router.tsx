import { createBrowserRouter, createRoutesFromElements, Route } from 'react-router-dom'
import { Suspense, lazy } from 'react'
import ErrorPage from '@/components/ErrorPage'
import { C4ELogo } from './components/C4ELogo'

const HubLayout = lazy(() => import('@/layouts/HubLayout'))
const Dashboard = lazy(() => import('@/pages/dashboard'))

export const router = createBrowserRouter(
  createRoutesFromElements(
    <Route
      path="/"
      element={
        // This Suspense handles the lazy loading of HubLayout
        <Suspense
          fallback={
            <div className="flex h-screen items-center justify-center">
              <C4ELogo className="animate-pulse" size="2xl" />
            </div>
          }
        >
          <HubLayout />
        </Suspense>
      }
      // 👇 Attach the errorElement to the root route here
      errorElement={<ErrorPage />}
    >
      <Route index element={<Dashboard />} />
      <Route path="/about" element={<h1>About</h1>} />
    </Route>
  )
)
