import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { u as useQuery, B as Button, I as Input, S as Separator } from "./separator-BuZw9EZS.mjs";
import { r as reactDomExports } from "../_libs/react-dom.mjs";
import { V as Virtualizer, e as elementScroll, o as observeElementOffset, a as observeElementRect } from "../_libs/tanstack__virtual-core.mjs";
import { u as useReactTable, f as flexRender } from "./index-BJnw1Xqv.mjs";
import { B as Badge, C as Card, a as CardHeader, b as CardTitle, c as CardDescription, d as CardContent } from "./badge-ZkkuD-sC.mjs";
import { a as useStore, b as appStore, d as setViewMode, c as cn } from "./router-CMJEBiMK.mjs";
import { c as getPaginationRowModel, g as getFilteredRowModel, a as getSortedRowModel, b as getCoreRowModel } from "../_libs/tanstack__table-core.mjs";
import { F as FileText, e as Table, f as LayoutList, a as Loader, A as ArrowUp, b as ArrowDown, c as ArrowUpDown } from "../_libs/lucide-react.mjs";
import "../_libs/tanstack__query-core.mjs";
import "../_libs/radix-ui__react-slot.mjs";
import "../_libs/radix-ui__react-compose-refs.mjs";
import "../_libs/class-variance-authority.mjs";
import "../_libs/clsx.mjs";
import "../_libs/radix-ui__react-separator.mjs";
import "../_libs/radix-ui__react-primitive.mjs";
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
const useIsomorphicLayoutEffect = typeof document !== "undefined" ? reactExports.useLayoutEffect : reactExports.useEffect;
function useVirtualizerBase({
  useFlushSync = true,
  ...options
}) {
  const rerender = reactExports.useReducer(() => ({}), {})[1];
  const resolvedOptions = {
    ...options,
    onChange: (instance2, sync) => {
      var _a;
      if (useFlushSync && sync) {
        reactDomExports.flushSync(rerender);
      } else {
        rerender();
      }
      (_a = options.onChange) == null ? void 0 : _a.call(options, instance2, sync);
    }
  };
  const [instance] = reactExports.useState(
    () => new Virtualizer(resolvedOptions)
  );
  instance.setOptions(resolvedOptions);
  useIsomorphicLayoutEffect(() => {
    return instance._didMount();
  }, []);
  useIsomorphicLayoutEffect(() => {
    return instance._willUpdate();
  });
  return instance;
}
function useVirtualizer(options) {
  return useVirtualizerBase({
    observeElementRect,
    observeElementOffset,
    scrollToFn: elementScroll,
    ...options
  });
}
const API = "https://jsonplaceholder.typicode.com";
function PostsPage() {
  const viewMode = useStore(appStore, (s) => s.viewMode);
  const [sorting, setSorting] = reactExports.useState([]);
  const [globalFilter, setGlobalFilter] = reactExports.useState("");
  const {
    data: posts = [],
    isLoading
  } = useQuery({
    queryKey: ["posts"],
    queryFn: async () => {
      const res = await fetch(`${API}/posts`);
      return res.json();
    },
    staleTime: 1e3 * 60 * 10
  });
  const columns = [{
    accessorKey: "id",
    header: "ID",
    size: 60,
    cell: (info) => /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { variant: "outline", className: "font-mono text-xs", children: [
      "#",
      info.getValue()
    ] })
  }, {
    accessorKey: "userId",
    header: "User",
    size: 80,
    cell: (info) => /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { variant: "secondary", children: [
      "User ",
      info.getValue()
    ] })
  }, {
    accessorKey: "title",
    header: "Title",
    cell: (info) => /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium text-sm line-clamp-1", children: info.getValue() })
  }, {
    accessorKey: "body",
    header: "Body",
    enableSorting: false,
    cell: (info) => /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground line-clamp-2", children: info.getValue() })
  }];
  const table = useReactTable({
    data: posts,
    columns,
    state: {
      sorting,
      globalFilter
    },
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: {
      pagination: {
        pageSize: 10
      }
    }
  });
  const parentRef = reactExports.useRef(null);
  const rowVirtualizer = useVirtualizer({
    count: posts.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 72,
    overscan: 5
  });
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("h2", { className: "text-2xl font-bold flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(FileText, { className: "w-6 h-6 text-blue-500" }),
          " Posts"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-muted-foreground mt-0.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-blue-500 font-medium", children: "@tanstack/react-table" }),
          " · ",
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-blue-500 font-medium", children: "@tanstack/react-virtual" }),
          " · ",
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-blue-500 font-medium", children: "@tanstack/react-query" })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2 items-center", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { variant: "secondary", children: [
          posts.length,
          " posts"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex border rounded-md overflow-hidden", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: viewMode === "table" ? "default" : "ghost", size: "sm", className: "rounded-none h-8 px-2", onClick: () => setViewMode("table"), children: /* @__PURE__ */ jsxRuntimeExports.jsx(Table, { className: "w-4 h-4" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: viewMode === "virtual" ? "default" : "ghost", size: "sm", className: "rounded-none h-8 px-2", onClick: () => setViewMode("virtual"), children: /* @__PURE__ */ jsxRuntimeExports.jsx(LayoutList, { className: "w-4 h-4" }) })
        ] })
      ] })
    ] }),
    isLoading && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-center py-20 text-muted-foreground gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Loader, { className: "w-5 h-5 animate-spin" }),
      " Loading posts..."
    ] }),
    !isLoading && viewMode === "table" && /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(CardHeader, { className: "pb-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { className: "text-base", children: [
          "Table View ",
          /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "outline", className: "ml-2 font-mono text-xs", children: "@tanstack/react-table" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardDescription, { children: "Sorting, filtering, and pagination built-in" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { placeholder: "Filter posts...", value: globalFilter, onChange: (e) => setGlobalFilter(e.target.value), className: "h-8 mt-2" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Separator, {}),
      /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "p-0 overflow-x-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-sm", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { className: "bg-muted/40 border-b", children: table.getHeaderGroups().map((hg) => /* @__PURE__ */ jsxRuntimeExports.jsx("tr", { children: hg.headers.map((header) => /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left px-4 py-2.5 font-medium text-muted-foreground text-xs uppercase tracking-wider", style: {
          width: header.getSize()
        }, children: header.isPlaceholder ? null : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: cn("flex items-center gap-1", header.column.getCanSort() && "cursor-pointer select-none hover:text-foreground"), onClick: header.column.getToggleSortingHandler(), children: [
          flexRender(header.column.columnDef.header, header.getContext()),
          header.column.getCanSort() && (header.column.getIsSorted() === "asc" ? /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowUp, { className: "w-3 h-3" }) : header.column.getIsSorted() === "desc" ? /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowDown, { className: "w-3 h-3" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowUpDown, { className: "w-3 h-3 opacity-40" }))
        ] }) }, header.id)) }, hg.id)) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { className: "divide-y", children: table.getRowModel().rows.map((row) => /* @__PURE__ */ jsxRuntimeExports.jsx("tr", { className: "hover:bg-muted/30 transition-colors", children: row.getVisibleCells().map((cell) => /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3", children: flexRender(cell.column.columnDef.cell, cell.getContext()) }, cell.id)) }, row.id)) })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Separator, {}),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between px-4 py-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs text-muted-foreground", children: [
          "Page ",
          table.getState().pagination.pageIndex + 1,
          " of ",
          table.getPageCount(),
          " · ",
          table.getFilteredRowModel().rows.length,
          " results"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "outline", size: "sm", onClick: () => table.previousPage(), disabled: !table.getCanPreviousPage(), className: "h-7 px-2 text-xs", children: "Prev" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "outline", size: "sm", onClick: () => table.nextPage(), disabled: !table.getCanNextPage(), className: "h-7 px-2 text-xs", children: "Next" })
        ] })
      ] })
    ] }),
    !isLoading && viewMode === "virtual" && /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(CardHeader, { className: "pb-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { className: "text-base", children: [
          "Virtual List ",
          /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "outline", className: "ml-2 font-mono text-xs", children: "@tanstack/react-virtual" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardDescription, { children: "All 100 posts rendered virtually — only visible rows in DOM" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Separator, {}),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { ref: parentRef, className: "h-[500px] overflow-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: {
        height: `${rowVirtualizer.getTotalSize()}px`,
        position: "relative"
      }, children: rowVirtualizer.getVirtualItems().map((vItem) => {
        const post = posts[vItem.index];
        return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: {
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: `${vItem.size}px`,
          transform: `translateY(${vItem.start}px)`
        }, className: "flex items-start gap-3 px-4 py-3 border-b hover:bg-muted/30 transition-colors", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { variant: "outline", className: "font-mono text-xs shrink-0 mt-0.5", children: [
            "#",
            post.id
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium line-clamp-1", children: post.title }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground line-clamp-1 mt-0.5", children: post.body })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { variant: "secondary", className: "shrink-0 text-xs", children: [
            "User ",
            post.userId
          ] })
        ] }, vItem.key);
      }) }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-4 py-2 text-xs text-muted-foreground border-t", children: [
        "Showing ",
        rowVirtualizer.getVirtualItems().length,
        " of ",
        posts.length,
        " rows in DOM"
      ] })
    ] })
  ] });
}
export {
  PostsPage as component
};
