import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { u as useQuery, I as Input, S as Separator, B as Button } from "./separator-BuZw9EZS.mjs";
import { u as useQueryClient, c as cn } from "./router-CMJEBiMK.mjs";
import { u as useMutation, a as useForm } from "./useForm-CT3TSU1L.mjs";
import { u as useReactTable, f as flexRender } from "./index-BJnw1Xqv.mjs";
import { B as Badge, C as Card, a as CardHeader, b as CardTitle, c as CardDescription, d as CardContent } from "./badge-ZkkuD-sC.mjs";
import { R as Root$1 } from "../_libs/radix-ui__react-label.mjs";
import { R as Root, P as Portal, C as Content, a as Close, T as Title, O as Overlay } from "../_libs/radix-ui__react-dialog.mjs";
import { g as getFilteredRowModel, a as getSortedRowModel, b as getCoreRowModel } from "../_libs/tanstack__table-core.mjs";
import { U as Users, a as Loader, A as ArrowUp, b as ArrowDown, c as ArrowUpDown, X, C as Check, P as Pencil } from "../_libs/lucide-react.mjs";
import "../_libs/tanstack__query-core.mjs";
import "../_libs/radix-ui__react-slot.mjs";
import "../_libs/radix-ui__react-compose-refs.mjs";
import "../_libs/class-variance-authority.mjs";
import "../_libs/clsx.mjs";
import "../_libs/radix-ui__react-separator.mjs";
import "../_libs/radix-ui__react-primitive.mjs";
import "../_libs/react-dom.mjs";
import "util";
import "crypto";
import "async_hooks";
import "stream";
import "../_libs/tanstack__react-router.mjs";
import "../_libs/tanstack__router-core.mjs";
import "../_libs/tiny-invariant.mjs";
import "../_libs/tanstack__history.mjs";
import "../_libs/cookie-es.mjs";
import "../_libs/seroval.mjs";
import "../_libs/seroval-plugins.mjs";
import "node:stream/web";
import "node:stream";
import "../_libs/tiny-warning.mjs";
import "../_libs/isbot.mjs";
import "../_libs/use-sync-external-store.mjs";
import "../_libs/tailwind-merge.mjs";
import "../_libs/tanstack__form-core.mjs";
import "../_libs/tanstack__store.mjs";
import "../_libs/tanstack__pacer-lite.mjs";
import "../_libs/@tanstack/devtools-event-client+[...].mjs";
import "../_libs/radix-ui__primitive.mjs";
import "../_libs/radix-ui__react-context.mjs";
import "../_libs/radix-ui__react-id.mjs";
import "../_libs/@radix-ui/react-use-layout-effect+[...].mjs";
import "../_libs/@radix-ui/react-use-controllable-state+[...].mjs";
import "../_libs/@radix-ui/react-dismissable-layer+[...].mjs";
import "../_libs/@radix-ui/react-use-callback-ref+[...].mjs";
import "../_libs/@radix-ui/react-use-escape-keydown+[...].mjs";
import "../_libs/radix-ui__react-focus-scope.mjs";
import "../_libs/radix-ui__react-portal.mjs";
import "../_libs/radix-ui__react-presence.mjs";
import "../_libs/radix-ui__react-focus-guards.mjs";
import "../_libs/react-remove-scroll.mjs";
import "tslib";
import "../_libs/react-remove-scroll-bar.mjs";
import "../_libs/react-style-singleton.mjs";
import "../_libs/get-nonce.mjs";
import "../_libs/use-sidecar.mjs";
import "../_libs/use-callback-ref.mjs";
import "../_libs/aria-hidden.mjs";
const Label = reactExports.forwardRef(
  ({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(Root$1, { ref, className: cn("text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70", className), ...props })
);
Label.displayName = Root$1.displayName;
const Dialog = Root;
const DialogPortal = Portal;
const DialogClose = Close;
const DialogOverlay = reactExports.forwardRef(
  ({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(Overlay, { ref, className: cn("fixed inset-0 z-50 bg-black/50 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0", className), ...props })
);
DialogOverlay.displayName = Overlay.displayName;
const DialogContent = reactExports.forwardRef(
  ({ className, children, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogPortal, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(DialogOverlay, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Content, { ref, className: cn("fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg rounded-xl", className), ...props, children: [
      children,
      /* @__PURE__ */ jsxRuntimeExports.jsx(DialogClose, { className: "absolute right-4 top-4 rounded-sm opacity-70 hover:opacity-100", children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "h-4 w-4" }) })
    ] })
  ] })
);
DialogContent.displayName = Content.displayName;
const DialogHeader = ({ className, ...props }) => /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: cn("flex flex-col space-y-1.5 text-center sm:text-left", className), ...props });
const DialogTitle = reactExports.forwardRef(
  ({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(Title, { ref, className: cn("text-lg font-semibold leading-none tracking-tight", className), ...props })
);
DialogTitle.displayName = Title.displayName;
const API = "https://jsonplaceholder.typicode.com";
function UsersPage() {
  const queryClient = useQueryClient();
  const [sorting, setSorting] = reactExports.useState([]);
  const [globalFilter, setGlobalFilter] = reactExports.useState("");
  const [editingUser, setEditingUser] = reactExports.useState(null);
  const [dialogOpen, setDialogOpen] = reactExports.useState(false);
  const {
    data: users = [],
    isLoading
  } = useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      const res = await fetch(`${API}/users`);
      return res.json();
    },
    staleTime: 1e3 * 60 * 10
  });
  const editMutation = useMutation({
    mutationFn: async ({
      id,
      data
    }) => {
      const res = await fetch(`${API}/users/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
      });
      return res.json();
    },
    onMutate: async ({
      id,
      data
    }) => {
      await queryClient.cancelQueries({
        queryKey: ["users"]
      });
      const prev = queryClient.getQueryData(["users"]);
      queryClient.setQueryData(["users"], (old) => old?.map((u) => u.id === id ? {
        ...u,
        ...data
      } : u));
      return {
        prev
      };
    },
    onError: (_err, _vars, ctx) => {
      if (ctx?.prev) queryClient.setQueryData(["users"], ctx.prev);
    },
    onSuccess: () => setDialogOpen(false)
  });
  const form = useForm({
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      website: ""
    },
    onSubmit: async ({
      value
    }) => {
      if (!editingUser) return;
      editMutation.mutate({
        id: editingUser.id,
        data: value
      });
    }
  });
  function openEdit(user) {
    setEditingUser(user);
    form.setFieldValue("name", user.name);
    form.setFieldValue("email", user.email);
    form.setFieldValue("phone", user.phone);
    form.setFieldValue("website", user.website);
    setDialogOpen(true);
  }
  const columns = [{
    accessorKey: "id",
    header: "ID",
    size: 50,
    cell: (info) => /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-mono text-xs text-muted-foreground", children: [
      "#",
      info.getValue()
    ] })
  }, {
    accessorKey: "name",
    header: "Name",
    cell: (info) => /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium text-sm", children: info.getValue() })
  }, {
    accessorKey: "email",
    header: "Email",
    cell: (info) => /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm text-muted-foreground", children: info.getValue() })
  }, {
    accessorKey: "address",
    header: "City",
    enableSorting: false,
    cell: (info) => /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "secondary", className: "text-xs", children: info.getValue().city })
  }, {
    accessorKey: "company",
    header: "Company",
    enableSorting: false,
    cell: (info) => /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground", children: info.getValue().name })
  }, {
    id: "actions",
    header: "",
    size: 60,
    cell: ({
      row
    }) => /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "ghost", size: "icon", className: "h-7 w-7 hover:text-primary", onClick: () => openEdit(row.original), children: /* @__PURE__ */ jsxRuntimeExports.jsx(Pencil, { className: "w-3.5 h-3.5" }) })
  }];
  const table = useReactTable({
    data: users,
    columns,
    state: {
      sorting,
      globalFilter
    },
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel()
  });
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("h2", { className: "text-2xl font-bold flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Users, { className: "w-6 h-6 text-green-500" }),
          " Users"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-muted-foreground mt-0.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-green-600 font-medium", children: "@tanstack/react-query" }),
          " · ",
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-green-600 font-medium", children: "@tanstack/react-table" }),
          " · ",
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-green-600 font-medium", children: "@tanstack/react-form" })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { variant: "secondary", children: [
        users.length,
        " users"
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(CardHeader, { className: "pb-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { className: "text-base", children: [
          "User Table ",
          /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "outline", className: "ml-2 font-mono text-xs", children: "@tanstack/react-table + @tanstack/react-form" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardDescription, { children: "Sort columns · Filter · Click ✏️ to edit via TanStack Form dialog" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { placeholder: "Filter users...", value: globalFilter, onChange: (e) => setGlobalFilter(e.target.value), className: "h-8 mt-2" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Separator, {}),
      /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "p-0 overflow-x-auto", children: isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-center py-16 text-muted-foreground gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Loader, { className: "w-4 h-4 animate-spin" }),
        " Loading users..."
      ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-sm", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { className: "bg-muted/40 border-b", children: table.getHeaderGroups().map((hg) => /* @__PURE__ */ jsxRuntimeExports.jsx("tr", { children: hg.headers.map((header) => /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left px-4 py-2.5 font-medium text-muted-foreground text-xs uppercase tracking-wider", style: {
          width: header.getSize()
        }, children: header.isPlaceholder ? null : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: cn("flex items-center gap-1", header.column.getCanSort() && "cursor-pointer select-none hover:text-foreground"), onClick: header.column.getToggleSortingHandler(), children: [
          flexRender(header.column.columnDef.header, header.getContext()),
          header.column.getCanSort() && (header.column.getIsSorted() === "asc" ? /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowUp, { className: "w-3 h-3" }) : header.column.getIsSorted() === "desc" ? /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowDown, { className: "w-3 h-3" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowUpDown, { className: "w-3 h-3 opacity-40" }))
        ] }) }, header.id)) }, hg.id)) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { className: "divide-y", children: table.getRowModel().rows.map((row) => /* @__PURE__ */ jsxRuntimeExports.jsx("tr", { className: "hover:bg-muted/30 transition-colors", children: row.getVisibleCells().map((cell) => /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3", children: flexRender(cell.column.columnDef.cell, cell.getContext()) }, cell.id)) }, row.id)) })
      ] }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open: dialogOpen, onOpenChange: setDialogOpen, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogTitle, { children: [
        "Edit User ",
        /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "outline", className: "ml-2 font-mono text-xs", children: "@tanstack/react-form" })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: (e) => {
        e.preventDefault();
        form.handleSubmit();
      }, className: "space-y-4 mt-2", children: [
        ["name", "email", "phone", "website"].map((fieldName) => /* @__PURE__ */ jsxRuntimeExports.jsx(form.Field, { name: fieldName, validators: {
          onChange: ({
            value
          }) => !value.trim() ? `${fieldName} is required` : void 0
        }, children: (field) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: fieldName, className: "capitalize", children: fieldName }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { id: fieldName, value: field.state.value, onChange: (e) => field.handleChange(e.target.value), onBlur: field.handleBlur, className: cn(field.state.meta.isTouched && field.state.meta.errors.length > 0 && "border-destructive") }),
          field.state.meta.isTouched && field.state.meta.errors.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-destructive", children: field.state.meta.errors[0]?.toString() })
        ] }) }, fieldName)),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2 justify-end pt-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { type: "button", variant: "outline", onClick: () => setDialogOpen(false), children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "w-4 h-4 mr-1" }),
            " Cancel"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { type: "submit", disabled: editMutation.isPending, children: [
            editMutation.isPending ? /* @__PURE__ */ jsxRuntimeExports.jsx(Loader, { className: "w-4 h-4 mr-1 animate-spin" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { className: "w-4 h-4 mr-1" }),
            "Save"
          ] })
        ] })
      ] })
    ] }) })
  ] });
}
export {
  UsersPage as component
};
