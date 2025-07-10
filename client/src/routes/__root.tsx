import React from 'react'
import { createRootRoute, Outlet } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/router-devtools'

export const Route = createRootRoute({
  component: () => {
    return (
      <React.Fragment>
        <Outlet />
        <TanStackRouterDevtools />
      </React.Fragment>
    )
  },
})
