import { createBrowserRouter, createRoutesFromElements, Route } from 'react-router-dom'

import HubLayout from './layouts/HubLayout'
import Dashboard from './pages/dashboard'

export const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<HubLayout />}>
      <Route index element={<Dashboard />} />
      <Route path="/about" element={<h1>About</h1>} />
    </Route>
  )
)
