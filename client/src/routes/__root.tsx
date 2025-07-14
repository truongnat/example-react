import React from 'react'
import { createRootRoute, Outlet } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/router-devtools'
import { Toaster } from '@/components/ui/sonner'
import { TokenMonitor } from '@/components/TokenMonitor'

export const Route = createRootRoute({
  component: () => {
    return (
      <React.Fragment>
        <Outlet />
        <Toaster />
        <TanStackRouterDevtools />
      </React.Fragment>
    )
  },
})
