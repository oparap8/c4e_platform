import { createBrowserRouter, createRoutesFromElements, Navigate, Route } from 'react-router-dom'
import { Suspense, lazy } from 'react'
import ErrorPage from '@/components/ErrorPage'
import { C4ELogo } from './components/C4ELogo'

const HubLayout = lazy(() => import('@/layouts/HubLayout'))
const CompanyMemoLayout = lazy(() => import('@/layouts/CompanyMemoLayout'))
const IdeaLisitPage = lazy(() => import('@/pages/IdeaListPage'))
const NewIdeaPage = lazy(() => import('@/pages/NewIdeaPage'))
const IdeaDetailsPage = lazy(() => import('@/pages/IdeaDetailsPage'))
const CompanyMemoSection = lazy(() => import('@/components/companyMemo/CompanyMemoSection'))

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
        <Route path=":id">
          <Route index element={<Navigate to="purpose" replace />} />
          <Route path="purpose" element={<CompanyMemoSection sectionKey={'purpose'} />} />
          <Route path="problem" element={<CompanyMemoSection sectionKey={'problem'} />} />
          <Route path="solution" element={<CompanyMemoSection sectionKey={'solution'} />} />
          <Route path="why-now" element={<CompanyMemoSection sectionKey={'why_now'} />} />
          <Route
            path="market-potential"
            element={<CompanyMemoSection sectionKey={'market_potential'} />}
          />
          <Route path="competition" element={<CompanyMemoSection sectionKey={'competition'} />} />
          <Route
            path="business-model"
            element={<CompanyMemoSection sectionKey={'business_model'} />}
          />
          <Route path="team" element={<CompanyMemoSection sectionKey={'team'} />} />
          <Route path="traction" element={<CompanyMemoSection sectionKey={'traction'} />} />
          <Route
            path="what-you-need"
            element={<CompanyMemoSection sectionKey={'what_you_need'} />}
          />
          <Route path="vision" element={<CompanyMemoSection sectionKey={'vision'} />} />
        </Route>
      </Route>
    </Route>
  )
)
