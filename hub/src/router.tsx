import { createBrowserRouter, createRoutesFromElements, Route } from 'react-router-dom'
import { Suspense, lazy } from 'react'
import ErrorPage from '@/components/ErrorPage'
import { C4ELogo } from './components/C4ELogo'
import IdeaDetailsPage from './pages/IdeaDetailsPage'

const HubLayout = lazy(() => import('@/layouts/HubLayout'))
const IdeaLisitPage = lazy(() => import('@/pages/IdeaListPage'))
const NewIdeaPage = lazy(() => import('@/pages/NewIdeaPage'))

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
      <Route path="idea">
        <Route index element={<IdeaLisitPage />} />
        <Route path="new" element={<NewIdeaPage />} />
        <Route path=":id" element={<IdeaDetailsPage />} />
      </Route>
    </Route>
  )
)
