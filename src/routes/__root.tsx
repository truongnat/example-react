/// <reference types="vite/client" />
import { HeadContent, Scripts, createRootRoute, Link } from '@tanstack/react-router'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { useStore } from '@tanstack/react-store'
import * as React from 'react'
import { LayoutDashboardIcon, CheckSquareIcon, FileTextIcon, UsersIcon } from 'lucide-react'
import { appStore, setTab, type TabType } from '~/store'
import { cn } from '~/lib/utils'
import appCss from '~/styles/app.css?url'

function makeQueryClient() {
  return new QueryClient({
    defaultOptions: { queries: { staleTime: 1000 * 60 * 5, retry: 1 } },
  })
}

let browserQueryClient: QueryClient | undefined

function getQueryClient() {
  if (typeof window === 'undefined') {
    // Server: always create a new QueryClient
    return makeQueryClient()
  }
  if (!browserQueryClient) browserQueryClient = makeQueryClient()
  return browserQueryClient
}

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
  { id: 'todos' as TabType, label: 'Todos', href: '/todos', icon: CheckSquareIcon },
  { id: 'posts' as TabType, label: 'Posts', href: '/posts', icon: FileTextIcon },
  { id: 'users' as TabType, label: 'Users', href: '/users', icon: UsersIcon },
]

function Header() {
  const state = useStore(appStore)
  return (
    <header className="border-b bg-white/80 backdrop-blur sticky top-0 z-40">
      <div className="max-w-6xl mx-auto px-4 h-14 flex items-center gap-3">
        <Link to="/" className="flex items-center gap-2 font-bold text-foreground hover:text-primary transition-colors">
          <LayoutDashboardIcon className="w-5 h-5 text-primary" />
          TanStack Demo
        </Link>
        <span className="hidden sm:block text-xs text-muted-foreground border-l pl-3 ml-1">
          Query · Table · Virtual · Form · Store
        </span>
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
  )
}

function RootDocument({ children }: { children: React.ReactNode }) {
  const queryClient = getQueryClient()
  return (
    <html lang="en">
      <head><HeadContent /></head>
      <body>
        <QueryClientProvider client={queryClient}>
          <div className="min-h-screen bg-gradient-to-br from-slate-50 via-violet-50/20 to-indigo-50/30">
            <Header />
            <main className="max-w-6xl mx-auto px-4 py-8">{children}</main>
          </div>
          <ReactQueryDevtools initialIsOpen={false} />
        </QueryClientProvider>
        <Scripts />
      </body>
    </html>
  )
}
