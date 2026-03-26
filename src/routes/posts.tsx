import { createFileRoute } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { useVirtualizer } from '@tanstack/react-virtual'
import { useReactTable, getCoreRowModel, getSortedRowModel, getFilteredRowModel, getPaginationRowModel, flexRender, type ColumnDef, type SortingState } from '@tanstack/react-table'
import * as React from 'react'
import { ArrowUpDownIcon, ArrowUpIcon, ArrowDownIcon, FileTextIcon, LayoutListIcon, TableIcon, LoaderIcon } from 'lucide-react'
import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '~/components/ui/card'
import { Badge } from '~/components/ui/badge'
import { Separator } from '~/components/ui/separator'
import { useStore } from '@tanstack/react-store'
import { appStore, setViewMode } from '~/store'
import { cn } from '~/lib/utils'

const API = 'https://jsonplaceholder.typicode.com'
interface Post { id: number; userId: number; title: string; body: string }

export const Route = createFileRoute('/posts')({ component: PostsPage })

function PostsPage() {
  const viewMode = useStore(appStore, (s) => s.viewMode)
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [globalFilter, setGlobalFilter] = React.useState('')

  // ── TanStack Query ────────────────────────────────────────────────────────
  const { data: posts = [], isLoading } = useQuery({
    queryKey: ['posts'],
    queryFn: async (): Promise<Post[]> => {
      const res = await fetch(`${API}/posts`)
      return res.json()
    },
    staleTime: 1000 * 60 * 10,
  })

  // ── TanStack Table columns ────────────────────────────────────────────────
  const columns: ColumnDef<Post>[] = [
    { accessorKey: 'id', header: 'ID', size: 60,
      cell: info => <Badge variant="outline" className="font-mono text-xs">#{info.getValue<number>()}</Badge> },
    { accessorKey: 'userId', header: 'User', size: 80,
      cell: info => <Badge variant="secondary">User {info.getValue<number>()}</Badge> },
    { accessorKey: 'title', header: 'Title', cell: info => (
      <span className="font-medium text-sm line-clamp-1">{info.getValue<string>()}</span>
    )},
    { accessorKey: 'body', header: 'Body', enableSorting: false, meta: { className: 'hidden md:table-cell' }, cell: info => (
      <span className="text-xs text-muted-foreground line-clamp-2">{info.getValue<string>()}</span>
    )},
  ]

  // ── TanStack Table ────────────────────────────────────────────────────────
  const table = useReactTable({
    data: posts,
    columns,
    state: { sorting, globalFilter },
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: { pagination: { pageSize: 10 } },
  })

  // ── TanStack Virtual (virtual list view) ─────────────────────────────────
  const parentRef = React.useRef<HTMLDivElement>(null)
  const rowVirtualizer = useVirtualizer({
    count: posts.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 72,
    overscan: 5,
  })

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <FileTextIcon className="w-6 h-6 text-blue-500" /> Posts
          </h2>
          <p className="text-sm text-muted-foreground mt-0.5">
            <span className="text-blue-500 font-medium">@tanstack/react-table</span> · <span className="text-blue-500 font-medium">@tanstack/react-virtual</span> · <span className="text-blue-500 font-medium">@tanstack/react-query</span>
          </p>
        </div>
        <div className="flex gap-2 items-center">
          <Badge variant="secondary">{posts.length} posts</Badge>
          <div className="flex border rounded-md overflow-hidden">
            <Button variant={viewMode === 'table' ? 'default' : 'ghost'} size="sm" className="rounded-none h-8 px-2" onClick={() => setViewMode('table')}>
              <TableIcon className="w-4 h-4" />
            </Button>
            <Button variant={viewMode === 'virtual' ? 'default' : 'ghost'} size="sm" className="rounded-none h-8 px-2" onClick={() => setViewMode('virtual')}>
              <LayoutListIcon className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {isLoading && (
        <div className="flex items-center justify-center py-20 text-muted-foreground gap-2">
          <LoaderIcon className="w-5 h-5 animate-spin" /> Loading posts...
        </div>
      )}

      {/* TABLE VIEW — TanStack Table */}
      {!isLoading && viewMode === 'table' && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Table View <Badge variant="outline" className="ml-2 font-mono text-xs">@tanstack/react-table</Badge></CardTitle>
            <CardDescription>Sorting, filtering, and pagination built-in</CardDescription>
            <Input placeholder="Filter posts..." value={globalFilter} onChange={e => setGlobalFilter(e.target.value)} className="h-8 mt-2" />
          </CardHeader>
          <Separator />
          <CardContent className="p-0 overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-muted/40 border-b">
                {table.getHeaderGroups().map(hg => (
                  <tr key={hg.id}>
                    {hg.headers.map(header => (
                      <th key={header.id} className={cn("text-left px-4 py-2.5 font-medium text-muted-foreground text-xs uppercase tracking-wider", (header.column.columnDef.meta as any)?.className)}
                        style={{ width: header.getSize() }}>
                        {header.isPlaceholder ? null : (
                          <div className={cn('flex items-center gap-1', header.column.getCanSort() && 'cursor-pointer select-none hover:text-foreground')}
                            onClick={header.column.getToggleSortingHandler()}>
                            {flexRender(header.column.columnDef.header, header.getContext())}
                            {header.column.getCanSort() && (
                              header.column.getIsSorted() === 'asc' ? <ArrowUpIcon className="w-3 h-3" /> :
                              header.column.getIsSorted() === 'desc' ? <ArrowDownIcon className="w-3 h-3" /> :
                              <ArrowUpDownIcon className="w-3 h-3 opacity-40" />
                            )}
                          </div>
                        )}
                      </th>
                    ))}
                  </tr>
                ))}
              </thead>
              <tbody className="divide-y">
                {table.getRowModel().rows.map(row => (
                  <tr key={row.id} className="hover:bg-muted/30 transition-colors">
                    {row.getVisibleCells().map(cell => (
                      <td key={cell.id} className={cn("px-4 py-3", (cell.column.columnDef.meta as any)?.className)}>
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
          <Separator />
          <div className="flex items-center justify-between px-4 py-3">
            <span className="text-xs text-muted-foreground">
              Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()} · {table.getFilteredRowModel().rows.length} results
            </span>
            <div className="flex gap-1">
              <Button variant="outline" size="sm" onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()} className="h-7 px-2 text-xs">Prev</Button>
              <Button variant="outline" size="sm" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()} className="h-7 px-2 text-xs">Next</Button>
            </div>
          </div>
        </Card>
      )}

      {/* VIRTUAL LIST VIEW — TanStack Virtual */}
      {!isLoading && viewMode === 'virtual' && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Virtual List <Badge variant="outline" className="ml-2 font-mono text-xs">@tanstack/react-virtual</Badge></CardTitle>
            <CardDescription>All 100 posts rendered virtually — only visible rows in DOM</CardDescription>
          </CardHeader>
          <Separator />
          <div ref={parentRef} className="h-[500px] overflow-auto">
            <div style={{ height: `${rowVirtualizer.getTotalSize()}px`, position: 'relative' }}>
              {rowVirtualizer.getVirtualItems().map(vItem => {
                const post = posts[vItem.index]
                return (
                  <div key={vItem.key} style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: `${vItem.size}px`, transform: `translateY(${vItem.start}px)` }}
                    className="flex items-start gap-3 px-4 py-3 border-b hover:bg-muted/30 transition-colors">
                    <Badge variant="outline" className="font-mono text-xs shrink-0 mt-0.5">#{post.id}</Badge>
                    <div className="min-w-0">
                      <p className="text-sm font-medium line-clamp-1">{post.title}</p>
                      <p className="text-xs text-muted-foreground line-clamp-1 mt-0.5">{post.body}</p>
                    </div>
                    <Badge variant="secondary" className="hidden sm:flex shrink-0 text-xs">User {post.userId}</Badge>
                  </div>
                )
              })}
            </div>
          </div>
          <div className="px-4 py-2 text-xs text-muted-foreground border-t">
            Showing {rowVirtualizer.getVirtualItems().length} of {posts.length} rows in DOM
          </div>
        </Card>
      )}
    </div>
  )
}
