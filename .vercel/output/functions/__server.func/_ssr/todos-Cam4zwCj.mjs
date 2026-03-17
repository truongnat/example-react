import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { u as useQueryClient, a as useStore, b as appStore, c as cn, s as setSearchQuery, A as API, t as todosQuery } from "./router-CMJEBiMK.mjs";
import { u as useQuery, I as Input, B as Button, S as Separator } from "./separator-BuZw9EZS.mjs";
import { u as useMutation, a as useForm } from "./useForm-CT3TSU1L.mjs";
import { B as Badge, C as Card, a as CardHeader, b as CardTitle, c as CardDescription, d as CardContent, e as CardFooter } from "./badge-ZkkuD-sC.mjs";
import { C as Checkbox$1, a as CheckboxIndicator } from "../_libs/radix-ui__react-checkbox.mjs";
import { S as SquareCheckBig, a as Loader, d as Plus, T as Trash2, C as Check } from "../_libs/lucide-react.mjs";
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
import "../_libs/react-dom.mjs";
import "util";
import "crypto";
import "async_hooks";
import "stream";
import "../_libs/isbot.mjs";
import "../_libs/tanstack__query-core.mjs";
import "../_libs/use-sync-external-store.mjs";
import "../_libs/clsx.mjs";
import "../_libs/tailwind-merge.mjs";
import "../_libs/radix-ui__react-slot.mjs";
import "../_libs/radix-ui__react-compose-refs.mjs";
import "../_libs/class-variance-authority.mjs";
import "../_libs/radix-ui__react-separator.mjs";
import "../_libs/radix-ui__react-primitive.mjs";
import "../_libs/tanstack__form-core.mjs";
import "../_libs/tanstack__store.mjs";
import "../_libs/tanstack__pacer-lite.mjs";
import "../_libs/@tanstack/devtools-event-client+[...].mjs";
import "../_libs/radix-ui__react-context.mjs";
import "../_libs/radix-ui__primitive.mjs";
import "../_libs/@radix-ui/react-use-controllable-state+[...].mjs";
import "../_libs/@radix-ui/react-use-layout-effect+[...].mjs";
import "../_libs/radix-ui__react-use-previous.mjs";
import "../_libs/radix-ui__react-use-size.mjs";
import "../_libs/radix-ui__react-presence.mjs";
const Checkbox = reactExports.forwardRef(
  ({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(Checkbox$1, { ref, className: cn("peer h-4 w-4 shrink-0 rounded-sm border border-primary shadow focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground cursor-pointer", className), ...props, children: /* @__PURE__ */ jsxRuntimeExports.jsx(CheckboxIndicator, { className: "flex items-center justify-center text-current", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { className: "h-3.5 w-3.5" }) }) })
);
Checkbox.displayName = Checkbox$1.displayName;
function TodosPage() {
  const queryClient = useQueryClient();
  const [filter, setFilter] = reactExports.useState("all");
  const searchQuery = useStore(appStore, (s) => s.searchQuery);
  const {
    data: todos = [],
    isLoading,
    isError
  } = useQuery(todosQuery);
  const toggleMutation = useMutation({
    mutationFn: async (todo) => {
      await fetch(`${API}/todos/${todo.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          completed: !todo.completed
        })
      });
      return todo;
    },
    onMutate: async (todo) => {
      await queryClient.cancelQueries({
        queryKey: ["todos"]
      });
      const prev = queryClient.getQueryData(["todos"]);
      queryClient.setQueryData(["todos"], (old) => old?.map((t) => t.id === todo.id ? {
        ...t,
        completed: !t.completed
      } : t));
      return {
        prev
      };
    },
    onError: (_err, _todo, ctx) => {
      if (ctx?.prev) queryClient.setQueryData(["todos"], ctx.prev);
    }
  });
  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      await fetch(`${API}/todos/${id}`, {
        method: "DELETE"
      });
      return id;
    },
    onMutate: async (id) => {
      await queryClient.cancelQueries({
        queryKey: ["todos"]
      });
      const prev = queryClient.getQueryData(["todos"]);
      queryClient.setQueryData(["todos"], (old) => old?.filter((t) => t.id !== id));
      return {
        prev
      };
    },
    onError: (_err, _id, ctx) => {
      if (ctx?.prev) queryClient.setQueryData(["todos"], ctx.prev);
    }
  });
  const addMutation = useMutation({
    mutationFn: async (title) => {
      const res = await fetch(`${API}/todos`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          title,
          completed: false,
          userId: 1
        })
      });
      return res.json();
    },
    onMutate: async (title) => {
      await queryClient.cancelQueries({
        queryKey: ["todos"]
      });
      const prev = queryClient.getQueryData(["todos"]);
      const optimistic = {
        id: Date.now(),
        userId: 1,
        title,
        completed: false
      };
      queryClient.setQueryData(["todos"], (old) => [optimistic, ...old ?? []]);
      return {
        prev
      };
    },
    onError: (_err, _title, ctx) => {
      if (ctx?.prev) queryClient.setQueryData(["todos"], ctx.prev);
    }
  });
  const form = useForm({
    defaultValues: {
      title: ""
    },
    onSubmit: async ({
      value,
      formApi
    }) => {
      if (!value.title.trim()) return;
      addMutation.mutate(value.title.trim());
      formApi.reset();
    }
  });
  const filtered = todos.filter((t) => {
    const matchFilter = filter === "all" || (filter === "active" ? !t.completed : t.completed);
    const matchSearch = t.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchFilter && matchSearch;
  });
  const completedCount = todos.filter((t) => t.completed).length;
  const activeCount = todos.length - completedCount;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("h2", { className: "text-2xl font-bold flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(SquareCheckBig, { className: "w-6 h-6 text-primary" }),
          " Todos"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-muted-foreground mt-0.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-primary font-medium", children: "@tanstack/react-query" }),
          " · ",
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-primary font-medium", children: "@tanstack/react-form" }),
          " · ",
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-primary font-medium", children: "@tanstack/store" })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { variant: "secondary", children: [
          activeCount,
          " active"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { variant: "success", children: [
          completedCount,
          " done"
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(CardHeader, { className: "pb-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { className: "text-base", children: [
          "Add Todo ",
          /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "outline", className: "ml-2 font-mono text-xs", children: "@tanstack/react-form" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardDescription, { children: "useForm with validation and onSubmit" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: (e) => {
        e.preventDefault();
        form.handleSubmit();
      }, className: "flex gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(form.Field, { name: "title", validators: {
          onChange: ({
            value
          }) => !value.trim() ? "Title is required" : void 0
        }, children: (field) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 space-y-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { placeholder: "Add a new task...", value: field.state.value, onChange: (e) => field.handleChange(e.target.value), onBlur: field.handleBlur, className: cn(field.state.meta.errors.length > 0 && field.state.meta.isTouched && "border-destructive") }),
          field.state.meta.isTouched && field.state.meta.errors.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-destructive", children: field.state.meta.errors[0]?.toString() })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { type: "submit", disabled: addMutation.isPending, className: "shrink-0", children: [
          addMutation.isPending ? /* @__PURE__ */ jsxRuntimeExports.jsx(Loader, { className: "w-4 h-4 animate-spin" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "w-4 h-4" }),
          "Add"
        ] })
      ] }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(CardHeader, { className: "pb-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { className: "text-base", children: [
              "Todo List ",
              /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "outline", className: "ml-2 font-mono text-xs", children: "@tanstack/react-query" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(CardDescription, { children: "useQuery + useMutation with optimistic updates" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex gap-1", children: ["all", "active", "completed"].map((f) => /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: filter === f ? "default" : "ghost", size: "sm", onClick: () => setFilter(f), className: "h-7 px-2 text-xs capitalize", children: f }, f)) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { placeholder: "Search todos... (TanStack Store)", value: searchQuery, onChange: (e) => setSearchQuery(e.target.value), className: "h-8 text-xs" }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Separator, {}),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "p-0", children: [
        isLoading && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-center py-12 text-muted-foreground gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Loader, { className: "w-4 h-4 animate-spin" }),
          " Loading..."
        ] }),
        isError && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-center py-8 text-destructive text-sm", children: "Failed to load todos" }),
        !isLoading && filtered.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-center py-12 text-muted-foreground text-sm", children: "No todos found" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "divide-y", children: filtered.map((todo) => /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "group flex items-center gap-3 px-4 py-3 hover:bg-muted/30 transition-colors", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Checkbox, { checked: todo.completed, onCheckedChange: () => toggleMutation.mutate(todo), disabled: toggleMutation.isPending }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: cn("flex-1 text-sm", todo.completed && "line-through text-muted-foreground"), children: todo.title }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "ghost", size: "icon", className: "h-7 w-7 opacity-0 group-hover:opacity-100 hover:text-destructive hover:bg-destructive/10", onClick: () => deleteMutation.mutate(todo.id), children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "w-3.5 h-3.5" }) })
        ] }, todo.id)) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Separator, {}),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(CardFooter, { className: "py-3 px-4 gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs text-muted-foreground", children: [
          completedCount,
          "/",
          todos.length,
          " completed"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 h-1.5 rounded-full bg-muted overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-full bg-primary rounded-full transition-all duration-500", style: {
          width: `${todos.length ? completedCount / todos.length * 100 : 0}%`
        } }) })
      ] })
    ] })
  ] });
}
export {
  TodosPage as component
};
