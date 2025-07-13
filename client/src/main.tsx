import ReactDOM from 'react-dom/client'
import { RouterProvider, createRouter } from '@tanstack/react-router'
import { QueryClientProvider } from '@tanstack/react-query'

// Import the generated route tree
import { routeTree } from './routeTree.gen'
import { queryClient } from './lib/query-client'
import { SocketProvider } from './providers/SocketProvider'
import { ConnectionStatus } from './components/ConnectionStatus'

// Import CSS
import './index.css'

// Create a new router instance
const router = createRouter({ routeTree })

// Register the router instance for type safety
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}

// Render the app
const rootElement = document.getElementById('root')!
if (!rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement)
  root.render(
    <QueryClientProvider client={queryClient}>
      <SocketProvider>
        <RouterProvider router={router} />
        <ConnectionStatus />
      </SocketProvider>
    </QueryClientProvider>,
  )
}
