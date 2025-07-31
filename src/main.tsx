import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'

import { Provider } from 'react-redux'
import { store } from './store/store.tsx'
import App from './App'

import {
  createBrowserRouter,
  RouterProvider,
} from 'react-router-dom'

// If App contains the <Routes> inside, just wrap it as a single route
const router = createBrowserRouter([
  {
    path: '*',
    element: <App />
  }
])

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  </StrictMode>
)
