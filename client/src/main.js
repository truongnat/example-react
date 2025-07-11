import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { StrictMode } from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider, createRouter } from '@tanstack/react-router';
import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
// Import the generated route tree
import { routeTree } from './routeTree.gen';
import { queryClient } from './lib/query-client';
// Import CSS
import './index.css';
// Create a new router instance
const router = createRouter({ routeTree });
// Render the app
const rootElement = document.getElementById('root');
if (!rootElement.innerHTML) {
    const root = ReactDOM.createRoot(rootElement);
    root.render(_jsx(StrictMode, { children: _jsxs(QueryClientProvider, { client: queryClient, children: [_jsx(RouterProvider, { router: router }), _jsx(ReactQueryDevtools, { initialIsOpen: false })] }) }));
}
