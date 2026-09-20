import { createBrowserRouter, createRoutesFromElements, Route } from 'react-router-dom'

import { lazy } from 'react'

const HubLayout = lazy(() => import('@/layouts/HubLayout'))
const Dashboard = lazy(() => import('@/pages/dashboard'))

export const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<HubLayout />}>
      <Route index element={<Dashboard />} />
      <Route path="/about" element={<h1>About</h1>} />
    </Route>
  )
)
