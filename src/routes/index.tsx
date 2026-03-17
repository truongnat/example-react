import { createFileRoute, Link } from '@tanstack/react-router'
import { CheckSquareIcon, FileTextIcon, UsersIcon, ZapIcon, DatabaseIcon, LayersIcon, FormInputIcon, BoxIcon } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '~/components/ui/card'
import { Badge } from '~/components/ui/badge'
import { setTab, type TabType } from '~/store'

export const Route = createFileRoute('/')({ component: HomePage })

const features = [
  {
    icon: CheckSquareIcon, title: 'Todos', href: '/todos', tab: 'todos' as TabType, color: 'text-violet-500', bg: 'bg-violet-50',
    libs: ['@tanstack/react-query', '@tanstack/react-form', '@tanstack/store'],
    desc: 'useQuery, useMutation with optimistic updates. useForm with validation. Global search state.',
  },
  {
    icon: FileTextIcon, title: 'Posts', href: '/posts', tab: 'posts' as TabType, color: 'text-blue-500', bg: 'bg-blue-50',
    libs: ['@tanstack/react-query', '@tanstack/react-table', '@tanstack/react-virtual'],
    desc: 'Table with sort/filter/pagination. Virtual list rendering 100 rows efficiently.',
  },
  {
    icon: UsersIcon, title: 'Users', href: '/users', tab: 'users' as TabType, color: 'text-green-500', bg: 'bg-green-50',
    libs: ['@tanstack/react-query', '@tanstack/react-table', '@tanstack/react-form'],
    desc: 'Sortable table. Edit dialog with TanStack Form validation and mutation.',
  },
]

const allLibs = [
  { name: '@tanstack/react-query', icon: ZapIcon, desc: 'Data fetching, caching, mutations' },
  { name: '@tanstack/react-table', icon: LayersIcon, desc: 'Headless table with sort/filter/pagination' },
  { name: '@tanstack/react-virtual', icon: DatabaseIcon, desc: 'Virtual list for large datasets' },
  { name: '@tanstack/react-form', icon: FormInputIcon, desc: 'Form state & validation' },
  { name: '@tanstack/store', icon: BoxIcon, desc: 'Global UI state management' },
  { name: '@tanstack/react-router', icon: ZapIcon, desc: 'Type-safe file-based routing' },
]

function HomePage() {
  return (
    <div className="space-y-10">
      {/* Hero */}
      <div className="text-center py-8">
        <Badge variant="secondary" className="mb-4">Beginner-friendly demo</Badge>
        <h1 className="text-4xl font-bold mb-3 tracking-tight">TanStack Full Demo</h1>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          One app showcasing all major TanStack libraries — data fetching, tables, virtual lists, forms, and global state.
        </p>
      </div>

      {/* Pages */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {features.map(f => (
          <Link key={f.href} to={f.href} onClick={() => setTab(f.tab)}
            className="group block hover:-translate-y-0.5 transition-transform">
            <Card className="h-full group-hover:border-primary/30 group-hover:shadow-md transition-all">
              <CardHeader>
                <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center mb-2', f.bg)}>
                  <f.icon className={cn('w-5 h-5', f.color)} />
                </div>
                <CardTitle className="text-lg">{f.title}</CardTitle>
                <CardDescription className="text-xs leading-relaxed">{f.desc}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-1">
                  {f.libs.map(lib => (
                    <Badge key={lib} variant="outline" className="font-mono text-[10px]">{lib.replace('@tanstack/', '')}</Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {/* All libs */}
      <div>
        <h2 className="text-lg font-semibold mb-4">Libraries Used</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {allLibs.map(lib => (
            <div key={lib.name} className="flex items-start gap-3 p-3 rounded-lg border bg-white">
              <lib.icon className="w-4 h-4 text-primary mt-0.5 shrink-0" />
              <div>
                <p className="font-mono text-xs font-medium">{lib.name}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{lib.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

import { cn } from '~/lib/utils'
