import { createBrowserRouter, createRoutesFromElements, Route } from 'react-router-dom'
import { Suspense, lazy } from 'react'
import ErrorPage from '@/components/ErrorPage'
import { C4ELogo } from './components/C4ELogo'

const HubLayout = lazy(() => import('@/layouts/HubLayout'))
const CompanyMemoLayout = lazy(() => import('@/layouts/CompanyMemoLayout'))
const IdeaLisitPage = lazy(() => import('@/pages/IdeaListPage'))
const NewIdeaPage = lazy(() => import('@/pages/NewIdeaPage'))
const IdeaDetailsPage = lazy(() => import('@/pages/IdeaDetailsPage'))

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
      <Route path="company-memo" element={<CompanyMemoLayout />}>
        <Route path=":id" element={<div>test</div>} />
      </Route>
    </Route>
  )
)
