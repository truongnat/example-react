import React from 'react'
import { createRootRoute, Outlet, Link } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/router-devtools'

export const Route = createRootRoute({
  component: () => {
    return (
      <React.Fragment>
        <div>
          <Link to="/" activeOptions={{ exact: true }}>
            Home
          </Link>
          <Link to="/posts">Posts</Link>
        </div>
        <hr />
        <Outlet />
        <TanStackRouterDevtools />
      </React.Fragment>
    )
  },
})
