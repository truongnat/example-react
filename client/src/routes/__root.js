import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React from 'react';
import { createRootRoute, Outlet } from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/router-devtools';
export const Route = createRootRoute({
    component: () => {
        return (_jsxs(React.Fragment, { children: [_jsx(Outlet, {}), _jsx(TanStackRouterDevtools, {})] }));
    },
});
