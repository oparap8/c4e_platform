import { createBrowserRouter, createRoutesFromElements, Route } from 'react-router-dom'

import HubLayout from './layouts/HubLayout'

export const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<HubLayout />}>
      <Route index element={<h1>Home</h1>} />
      <Route path="/about" element={<h1>About</h1>} />
    </Route>
  )
)
