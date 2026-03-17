/// <reference types="vite/client" />
import { HeadContent, Scripts, createRootRoute, Link, Outlet } from '@tanstack/react-router'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { useStore } from '@tanstack/react-store'
import * as React from 'react'
import { LayoutDashboardIcon, CheckSquareIcon, FileTextIcon, UsersIcon } from 'lucide-react'
import { appStore, setTab, type TabType } from '~/store'
import { cn } from '~/lib/utils'
import appCss from '~/styles/app.css?url'

const queryClient = new QueryClient({
  defaultOptions: { queries: { staleTime: 1000 * 60 * 5, retry: 1 } },
})

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { title: 'TanStack Full Demo' },
    ],
    links: [{ rel: 'stylesheet', href: appCss }],
  }),
  shellComponent: RootDocument,
})

const tabs = [
  { id: 'todos' as TabType, label: 'Todos', href: '/todos', icon: CheckSquareIcon, color: 'text-violet-500' },
  { id: 'posts' as TabType, label: 'Posts', href: '/posts', icon: FileTextIcon, color: 'text-blue-500' },
  { id: 'users' as TabType, label: 'Users', href: '/users', icon: UsersIcon, color: 'text-green-500' },
]

function Shell({ children }: { children: React.ReactNode }) {
  const state = useStore(appStore)
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-violet-50/20 to-indigo-50/30">
      <header className="border-b bg-white/80 backdrop-blur sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 h-14 flex items-center gap-3">
          <Link to="/" className="flex items-center gap-2 font-bold text-foreground hover:text-primary transition-colors" onClick={() => {}}>
            <LayoutDashboardIcon className="w-5 h-5 text-primary" />
            TanStack Demo
          </Link>
          <span className="hidden sm:block text-xs text-muted-foreground border-l pl-3 ml-1">Query · Table · Virtual · Form · Store</span>
          <nav className="ml-auto flex gap-1">
            {tabs.map(tab => (
              <Link key={tab.id} to={tab.href} onClick={() => setTab(tab.id)}
                className={cn(
                  'flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-colors',
                  state.activeTab === tab.id
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                )}>
                <tab.icon className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">{tab.label}</span>
              </Link>
            ))}
          </nav>
        </div>
      </header>
      <main className="max-w-6xl mx-auto px-4 py-8">{children}</main>
    </div>
  )
}

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head><HeadContent /></head>
      <body>
        <QueryClientProvider client={queryClient}>
          <Shell>{children}</Shell>
          <ReactQueryDevtools initialIsOpen={false} />
        </QueryClientProvider>
        <Scripts />
      </body>
    </html>
  )
}
