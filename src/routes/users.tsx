import { createFileRoute } from '@tanstack/react-router'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useReactTable, getCoreRowModel, getSortedRowModel, getFilteredRowModel, flexRender, type ColumnDef, type SortingState } from '@tanstack/react-table'
import { useForm } from '@tanstack/react-form'
import * as React from 'react'
import { UsersIcon, PencilIcon, CheckIcon, XIcon, LoaderIcon, ArrowUpDownIcon, ArrowUpIcon, ArrowDownIcon } from 'lucide-react'
import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '~/components/ui/card'
import { Badge } from '~/components/ui/badge'
import { Separator } from '~/components/ui/separator'
import { Label } from '~/components/ui/label'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '~/components/ui/dialog'
import { cn } from '~/lib/utils'

const API = 'https://jsonplaceholder.typicode.com'

interface User {
  id: number; name: string; username: string; email: string
  phone: string; website: string
  company: { name: string; catchPhrase: string }
  address: { city: string }
}

export const Route = createFileRoute('/users')({ component: UsersPage })

function UsersPage() {
  const queryClient = useQueryClient()
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [globalFilter, setGlobalFilter] = React.useState('')
  const [editingUser, setEditingUser] = React.useState<User | null>(null)
  const [dialogOpen, setDialogOpen] = React.useState(false)

  // ── TanStack Query ────────────────────────────────────────────────────────
  const { data: users = [], isLoading } = useQuery({
    queryKey: ['users'],
    queryFn: async (): Promise<User[]> => {
      const res = await fetch(`${API}/users`)
      return res.json()
    },
    staleTime: 1000 * 60 * 10,
  })

  // ── TanStack Query: useMutation (edit user) ───────────────────────────────
  const editMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: Partial<User> }) => {
      const res = await fetch(`${API}/users/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      return res.json()
    },
    onMutate: async ({ id, data }) => {
      await queryClient.cancelQueries({ queryKey: ['users'] })
      const prev = queryClient.getQueryData<User[]>(['users'])
      queryClient.setQueryData<User[]>(['users'], old =>
        old?.map(u => u.id === id ? { ...u, ...data } : u)
      )
      return { prev }
    },
    onError: (_err, _vars, ctx) => {
      if (ctx?.prev) queryClient.setQueryData(['users'], ctx.prev)
    },
    onSuccess: () => setDialogOpen(false),
  })

  // ── TanStack Form ─────────────────────────────────────────────────────────
  const form = useForm({
    defaultValues: { name: '', email: '', phone: '', website: '' },
    onSubmit: async ({ value }) => {
      if (!editingUser) return
      editMutation.mutate({ id: editingUser.id, data: value })
    },
  })

  function openEdit(user: User) {
    setEditingUser(user)
    form.setFieldValue('name', user.name)
    form.setFieldValue('email', user.email)
    form.setFieldValue('phone', user.phone)
    form.setFieldValue('website', user.website)
    setDialogOpen(true)
  }

  // ── TanStack Table ────────────────────────────────────────────────────────
  const columns: ColumnDef<User>[] = [
    { accessorKey: 'id', header: 'ID', size: 50,
      cell: info => <span className="font-mono text-xs text-muted-foreground">#{info.getValue<number>()}</span> },
    { accessorKey: 'name', header: 'Name',
      cell: info => <span className="font-medium text-sm">{info.getValue<string>()}</span> },
    { accessorKey: 'email', header: 'Email',
      cell: info => <span className="text-sm text-muted-foreground">{info.getValue<string>()}</span> },
    { accessorKey: 'address', header: 'City', enableSorting: false,
      cell: info => <Badge variant="secondary" className="text-xs">{info.getValue<User['address']>().city}</Badge> },
    { accessorKey: 'company', header: 'Company', enableSorting: false,
      cell: info => <span className="text-xs text-muted-foreground">{info.getValue<User['company']>().name}</span> },
    {
      id: 'actions', header: '', size: 60,
      cell: ({ row }) => (
        <Button variant="ghost" size="icon" className="h-7 w-7 hover:text-primary" onClick={() => openEdit(row.original)}>
          <PencilIcon className="w-3.5 h-3.5" />
        </Button>
      ),
    },
  ]

  const table = useReactTable({
    data: users,
    columns,
    state: { sorting, globalFilter },
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  })

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <UsersIcon className="w-6 h-6 text-green-500" /> Users
          </h2>
          <p className="text-sm text-muted-foreground mt-0.5">
            <span className="text-green-600 font-medium">@tanstack/react-query</span> · <span className="text-green-600 font-medium">@tanstack/react-table</span> · <span className="text-green-600 font-medium">@tanstack/react-form</span>
          </p>
        </div>
        <Badge variant="secondary">{users.length} users</Badge>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">User Table <Badge variant="outline" className="ml-2 font-mono text-xs">@tanstack/react-table + @tanstack/react-form</Badge></CardTitle>
          <CardDescription>Sort columns · Filter · Click ✏️ to edit via TanStack Form dialog</CardDescription>
          <Input placeholder="Filter users..." value={globalFilter} onChange={e => setGlobalFilter(e.target.value)} className="h-8 mt-2" />
        </CardHeader>
        <Separator />
        <CardContent className="p-0 overflow-x-auto">
          {isLoading ? (
            <div className="flex items-center justify-center py-16 text-muted-foreground gap-2">
              <LoaderIcon className="w-4 h-4 animate-spin" /> Loading users...
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead className="bg-muted/40 border-b">
                {table.getHeaderGroups().map(hg => (
                  <tr key={hg.id}>
                    {hg.headers.map(header => (
                      <th key={header.id} className="text-left px-4 py-2.5 font-medium text-muted-foreground text-xs uppercase tracking-wider" style={{ width: header.getSize() }}>
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
                      <td key={cell.id} className="px-4 py-3">
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </CardContent>
      </Card>

      {/* Edit dialog — TanStack Form */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit User <Badge variant="outline" className="ml-2 font-mono text-xs">@tanstack/react-form</Badge></DialogTitle>
          </DialogHeader>
          <form onSubmit={(e) => { e.preventDefault(); form.handleSubmit() }} className="space-y-4 mt-2">
            {(['name','email','phone','website'] as const).map(fieldName => (
              <form.Field key={fieldName} name={fieldName}
                validators={{ onChange: ({ value }) => !value.trim() ? `${fieldName} is required` : undefined }}>
                {(field) => (
                  <div className="space-y-1">
                    <Label htmlFor={fieldName} className="capitalize">{fieldName}</Label>
                    <Input
                      id={fieldName}
                      value={field.state.value}
                      onChange={e => field.handleChange(e.target.value)}
                      onBlur={field.handleBlur}
                      className={cn(field.state.meta.isTouched && field.state.meta.errors.length > 0 && 'border-destructive')}
                    />
                    {field.state.meta.isTouched && field.state.meta.errors.length > 0 && (
                      <p className="text-xs text-destructive">{field.state.meta.errors[0]?.toString()}</p>
                    )}
                  </div>
                )}
              </form.Field>
            ))}
            <div className="flex gap-2 justify-end pt-2">
              <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                <XIcon className="w-4 h-4 mr-1" /> Cancel
              </Button>
              <Button type="submit" disabled={editMutation.isPending}>
                {editMutation.isPending ? <LoaderIcon className="w-4 h-4 mr-1 animate-spin" /> : <CheckIcon className="w-4 h-4 mr-1" />}
                Save
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
