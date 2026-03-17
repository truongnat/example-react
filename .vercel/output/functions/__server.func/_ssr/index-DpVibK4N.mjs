import { j as jsxRuntimeExports } from "../_libs/react.mjs";
import { L as Link } from "../_libs/tanstack__react-router.mjs";
import { B as Badge, C as Card, a as CardHeader, b as CardTitle, c as CardDescription, d as CardContent } from "./badge-ZkkuD-sC.mjs";
import { c as cn, e as setTab } from "./router-CMJEBiMK.mjs";
import { S as SquareCheckBig, F as FileText, U as Users, Z as Zap, g as Layers, D as Database, R as RectangleEllipsis, B as Box } from "../_libs/lucide-react.mjs";
import "../_libs/tanstack__router-core.mjs";
import "../_libs/tiny-invariant.mjs";
import "../_libs/tanstack__history.mjs";
import "../_libs/cookie-es.mjs";
import "../_libs/seroval.mjs";
import "../_libs/seroval-plugins.mjs";
import "node:stream/web";
import "node:stream";
import "../_libs/tiny-warning.mjs";
import "../_libs/react-dom.mjs";
import "util";
import "crypto";
import "async_hooks";
import "stream";
import "../_libs/isbot.mjs";
import "../_libs/class-variance-authority.mjs";
import "../_libs/clsx.mjs";
import "../_libs/tanstack__query-core.mjs";
import "../_libs/use-sync-external-store.mjs";
import "../_libs/tailwind-merge.mjs";
const features = [{
  icon: SquareCheckBig,
  title: "Todos",
  href: "/todos",
  tab: "todos",
  color: "text-violet-500",
  bg: "bg-violet-50",
  libs: ["@tanstack/react-query", "@tanstack/react-form", "@tanstack/store"],
  desc: "useQuery, useMutation with optimistic updates. useForm with validation. Global search state."
}, {
  icon: FileText,
  title: "Posts",
  href: "/posts",
  tab: "posts",
  color: "text-blue-500",
  bg: "bg-blue-50",
  libs: ["@tanstack/react-query", "@tanstack/react-table", "@tanstack/react-virtual"],
  desc: "Table with sort/filter/pagination. Virtual list rendering 100 rows efficiently."
}, {
  icon: Users,
  title: "Users",
  href: "/users",
  tab: "users",
  color: "text-green-500",
  bg: "bg-green-50",
  libs: ["@tanstack/react-query", "@tanstack/react-table", "@tanstack/react-form"],
  desc: "Sortable table. Edit dialog with TanStack Form validation and mutation."
}];
const allLibs = [{
  name: "@tanstack/react-query",
  icon: Zap,
  desc: "Data fetching, caching, mutations"
}, {
  name: "@tanstack/react-table",
  icon: Layers,
  desc: "Headless table with sort/filter/pagination"
}, {
  name: "@tanstack/react-virtual",
  icon: Database,
  desc: "Virtual list for large datasets"
}, {
  name: "@tanstack/react-form",
  icon: RectangleEllipsis,
  desc: "Form state & validation"
}, {
  name: "@tanstack/store",
  icon: Box,
  desc: "Global UI state management"
}, {
  name: "@tanstack/react-router",
  icon: Zap,
  desc: "Type-safe file-based routing"
}];
function HomePage() {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-10", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center py-8", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "secondary", className: "mb-4", children: "Beginner-friendly demo" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-4xl font-bold mb-3 tracking-tight", children: "TanStack Full Demo" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-lg max-w-2xl mx-auto", children: "One app showcasing all major TanStack libraries — data fetching, tables, virtual lists, forms, and global state." })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-4", children: features.map((f) => /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: f.href, onClick: () => setTab(f.tab), className: "group block hover:-translate-y-0.5 transition-transform", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "h-full group-hover:border-primary/30 group-hover:shadow-md transition-all", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(CardHeader, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: cn("w-10 h-10 rounded-xl flex items-center justify-center mb-2", f.bg), children: /* @__PURE__ */ jsxRuntimeExports.jsx(f.icon, { className: cn("w-5 h-5", f.color) }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { className: "text-lg", children: f.title }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardDescription, { className: "text-xs leading-relaxed", children: f.desc })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap gap-1", children: f.libs.map((lib) => /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "outline", className: "font-mono text-[10px]", children: lib.replace("@tanstack/", "") }, lib)) }) })
    ] }) }, f.href)) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-lg font-semibold mb-4", children: "Libraries Used" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 md:grid-cols-3 gap-3", children: allLibs.map((lib) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-3 p-3 rounded-lg border bg-white", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(lib.icon, { className: "w-4 h-4 text-primary mt-0.5 shrink-0" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-mono text-xs font-medium", children: lib.name }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-0.5", children: lib.desc })
        ] })
      ] }, lib.name)) })
    ] })
  ] });
}
export {
  HomePage as component
};
