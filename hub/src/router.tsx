import { createBrowserRouter, createRoutesFromElements, Route } from 'react-router-dom'
import { Suspense, lazy } from 'react'
import ErrorPage from '@/components/ErrorPage'
import { C4ELogo } from './components/C4ELogo'

const HubLayout = lazy(() => import('@/layouts/HubLayout'))
const IdeaLisitPage = lazy(() => import('@/pages/IdeaLisitPage'))

export const router = createBrowserRouter(
  createRoutesFromElements(
    <Route
      path="/"
      element={
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
      errorElement={<ErrorPage />}
    >
      <Route index element={<IdeaLisitPage />} />
      <Route path="/about" element={<h1>About</h1>} />
    </Route>
  )
)
