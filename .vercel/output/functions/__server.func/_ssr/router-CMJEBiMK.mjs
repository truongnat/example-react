import { c as createRouter, a as createRootRoute, b as createFileRoute, l as lazyRouteComponent, H as HeadContent, O as Outlet, S as Scripts, L as Link } from "../_libs/tanstack__react-router.mjs";
import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { Q as QueryClient } from "../_libs/tanstack__query-core.mjs";
import { w as withSelectorExports } from "../_libs/use-sync-external-store.mjs";
import { c as clsx } from "../_libs/clsx.mjs";
import { t as twMerge } from "../_libs/tailwind-merge.mjs";
import { L as LayoutDashboard, S as SquareCheckBig, F as FileText, U as Users } from "../_libs/lucide-react.mjs";
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
var QueryClientContext = reactExports.createContext(
  void 0
);
var useQueryClient = (queryClient) => {
  const client = reactExports.useContext(QueryClientContext);
  if (!client) {
    throw new Error("No QueryClient set, use QueryClientProvider to set one");
  }
  return client;
};
var QueryClientProvider = ({
  client,
  children
}) => {
  reactExports.useEffect(() => {
    client.mount();
    return () => {
      client.unmount();
    };
  }, [client]);
  return /* @__PURE__ */ jsxRuntimeExports.jsx(QueryClientContext.Provider, { value: client, children });
};
var ReactQueryDevtools2 = function() {
  return null;
};
var ReactiveFlags = /* @__PURE__ */ ((ReactiveFlags2) => {
  ReactiveFlags2[ReactiveFlags2["None"] = 0] = "None";
  ReactiveFlags2[ReactiveFlags2["Mutable"] = 1] = "Mutable";
  ReactiveFlags2[ReactiveFlags2["Watching"] = 2] = "Watching";
  ReactiveFlags2[ReactiveFlags2["RecursedCheck"] = 4] = "RecursedCheck";
  ReactiveFlags2[ReactiveFlags2["Recursed"] = 8] = "Recursed";
  ReactiveFlags2[ReactiveFlags2["Dirty"] = 16] = "Dirty";
  ReactiveFlags2[ReactiveFlags2["Pending"] = 32] = "Pending";
  return ReactiveFlags2;
})(ReactiveFlags || {});
function createReactiveSystem({
  update,
  notify,
  unwatched
}) {
  return {
    link: link2,
    unlink: unlink2,
    propagate: propagate2,
    checkDirty: checkDirty2,
    shallowPropagate: shallowPropagate2
  };
  function link2(dep, sub, version) {
    const prevDep = sub.depsTail;
    if (prevDep !== void 0 && prevDep.dep === dep) {
      return;
    }
    const nextDep = prevDep !== void 0 ? prevDep.nextDep : sub.deps;
    if (nextDep !== void 0 && nextDep.dep === dep) {
      nextDep.version = version;
      sub.depsTail = nextDep;
      return;
    }
    const prevSub = dep.subsTail;
    if (prevSub !== void 0 && prevSub.version === version && prevSub.sub === sub) {
      return;
    }
    const newLink = sub.depsTail = dep.subsTail = {
      version,
      dep,
      sub,
      prevDep,
      nextDep,
      prevSub,
      nextSub: void 0
    };
    if (nextDep !== void 0) {
      nextDep.prevDep = newLink;
    }
    if (prevDep !== void 0) {
      prevDep.nextDep = newLink;
    } else {
      sub.deps = newLink;
    }
    if (prevSub !== void 0) {
      prevSub.nextSub = newLink;
    } else {
      dep.subs = newLink;
    }
  }
  function unlink2(link3, sub = link3.sub) {
    const dep = link3.dep;
    const prevDep = link3.prevDep;
    const nextDep = link3.nextDep;
    const nextSub = link3.nextSub;
    const prevSub = link3.prevSub;
    if (nextDep !== void 0) {
      nextDep.prevDep = prevDep;
    } else {
      sub.depsTail = prevDep;
    }
    if (prevDep !== void 0) {
      prevDep.nextDep = nextDep;
    } else {
      sub.deps = nextDep;
    }
    if (nextSub !== void 0) {
      nextSub.prevSub = prevSub;
    } else {
      dep.subsTail = prevSub;
    }
    if (prevSub !== void 0) {
      prevSub.nextSub = nextSub;
    } else if ((dep.subs = nextSub) === void 0) {
      unwatched(dep);
    }
    return nextDep;
  }
  function propagate2(link3) {
    let next = link3.nextSub;
    let stack;
    top: do {
      const sub = link3.sub;
      let flags = sub.flags;
      if (!(flags & (4 | 8 | 16 | 32))) {
        sub.flags = flags | 32;
      } else if (!(flags & (4 | 8))) {
        flags = 0;
      } else if (!(flags & 4)) {
        sub.flags = flags & -9 | 32;
      } else if (!(flags & (16 | 32)) && isValidLink(link3, sub)) {
        sub.flags = flags | (8 | 32);
        flags &= 1;
      } else {
        flags = 0;
      }
      if (flags & 2) {
        notify(sub);
      }
      if (flags & 1) {
        const subSubs = sub.subs;
        if (subSubs !== void 0) {
          const nextSub = (link3 = subSubs).nextSub;
          if (nextSub !== void 0) {
            stack = { value: next, prev: stack };
            next = nextSub;
          }
          continue;
        }
      }
      if ((link3 = next) !== void 0) {
        next = link3.nextSub;
        continue;
      }
      while (stack !== void 0) {
        link3 = stack.value;
        stack = stack.prev;
        if (link3 !== void 0) {
          next = link3.nextSub;
          continue top;
        }
      }
      break;
    } while (true);
  }
  function checkDirty2(link3, sub) {
    let stack;
    let checkDepth = 0;
    let dirty = false;
    top: do {
      const dep = link3.dep;
      const flags = dep.flags;
      if (sub.flags & 16) {
        dirty = true;
      } else if ((flags & (1 | 16)) === (1 | 16)) {
        if (update(dep)) {
          const subs = dep.subs;
          if (subs.nextSub !== void 0) {
            shallowPropagate2(subs);
          }
          dirty = true;
        }
      } else if ((flags & (1 | 32)) === (1 | 32)) {
        if (link3.nextSub !== void 0 || link3.prevSub !== void 0) {
          stack = { value: link3, prev: stack };
        }
        link3 = dep.deps;
        sub = dep;
        ++checkDepth;
        continue;
      }
      if (!dirty) {
        const nextDep = link3.nextDep;
        if (nextDep !== void 0) {
          link3 = nextDep;
          continue;
        }
      }
      while (checkDepth--) {
        const firstSub = sub.subs;
        const hasMultipleSubs = firstSub.nextSub !== void 0;
        if (hasMultipleSubs) {
          link3 = stack.value;
          stack = stack.prev;
        } else {
          link3 = firstSub;
        }
        if (dirty) {
          if (update(sub)) {
            if (hasMultipleSubs) {
              shallowPropagate2(firstSub);
            }
            sub = link3.sub;
            continue;
          }
          dirty = false;
        } else {
          sub.flags &= -33;
        }
        sub = link3.sub;
        const nextDep = link3.nextDep;
        if (nextDep !== void 0) {
          link3 = nextDep;
          continue top;
        }
      }
      return dirty;
    } while (true);
  }
  function shallowPropagate2(link3) {
    do {
      const sub = link3.sub;
      const flags = sub.flags;
      if ((flags & (32 | 16)) === 32) {
        sub.flags = flags | 16;
        if ((flags & (2 | 4)) === 2) {
          notify(sub);
        }
      }
    } while ((link3 = link3.nextSub) !== void 0);
  }
  function isValidLink(checkLink, sub) {
    let link3 = sub.depsTail;
    while (link3 !== void 0) {
      if (link3 === checkLink) {
        return true;
      }
      link3 = link3.prevDep;
    }
    return false;
  }
}
const { link: link$1, unlink: unlink$1, propagate: propagate$1, checkDirty: checkDirty$1, shallowPropagate: shallowPropagate$1 } = createReactiveSystem({
  update(node) {
    if (node.depsTail !== void 0) {
      return updateComputed(node);
    } else {
      return updateSignal(node);
    }
  },
  notify(effect2) {
    do {
      effect2.flags &= -3;
      effect2 = effect2.subs?.sub;
      if (effect2 === void 0 || !(effect2.flags & 2)) {
        break;
      }
    } while (true);
  },
  unwatched(node) {
    if (!(node.flags & 1)) {
      effectScopeOper.call(node);
    } else if (node.depsTail !== void 0) {
      node.depsTail = void 0;
      node.flags = 1 | 16;
      purgeDeps$1(node);
    }
  }
});
function updateComputed(c) {
  c.depsTail = void 0;
  c.flags = 1 | 4;
  try {
    const oldValue = c.value;
    return oldValue !== (c.value = c.getter(oldValue));
  } finally {
    c.flags &= -5;
    purgeDeps$1(c);
  }
}
function updateSignal(s) {
  s.flags = 1;
  return s.currentValue !== (s.currentValue = s.pendingValue);
}
function effectScopeOper() {
  this.depsTail = void 0;
  this.flags = 0;
  purgeDeps$1(this);
  const sub = this.subs;
  if (sub !== void 0) {
    unlink$1(sub);
  }
}
function purgeDeps$1(sub) {
  const depsTail = sub.depsTail;
  let dep = depsTail !== void 0 ? depsTail.nextDep : sub.deps;
  while (dep !== void 0) {
    dep = unlink$1(dep, sub);
  }
}
function toObserver(nextHandler, errorHandler, completionHandler) {
  const isObserver = typeof nextHandler === "object";
  const self = isObserver ? nextHandler : void 0;
  return {
    next: (isObserver ? nextHandler.next : nextHandler)?.bind(self),
    error: (isObserver ? nextHandler.error : errorHandler)?.bind(self),
    complete: (isObserver ? nextHandler.complete : completionHandler)?.bind(
      self
    )
  };
}
const queuedEffects = [];
let cycle = 0;
const { link, unlink, propagate, checkDirty, shallowPropagate } = createReactiveSystem({
  update(atom) {
    return atom._update();
  },
  // eslint-disable-next-line no-shadow
  notify(effect2) {
    queuedEffects[queuedEffectsLength++] = effect2;
    effect2.flags &= ~ReactiveFlags.Watching;
  },
  unwatched(atom) {
    if (atom.depsTail !== void 0) {
      atom.depsTail = void 0;
      atom.flags = ReactiveFlags.Mutable | ReactiveFlags.Dirty;
      purgeDeps(atom);
    }
  }
});
let notifyIndex = 0;
let queuedEffectsLength = 0;
let activeSub;
function purgeDeps(sub) {
  const depsTail = sub.depsTail;
  let dep = depsTail !== void 0 ? depsTail.nextDep : sub.deps;
  while (dep !== void 0) {
    dep = unlink(dep, sub);
  }
}
function flush() {
  while (notifyIndex < queuedEffectsLength) {
    const effect2 = queuedEffects[notifyIndex];
    queuedEffects[notifyIndex++] = void 0;
    effect2.notify();
  }
  notifyIndex = 0;
  queuedEffectsLength = 0;
}
function createAtom(valueOrFn, options) {
  const isComputed = typeof valueOrFn === "function";
  const getter = valueOrFn;
  const atom = {
    _snapshot: isComputed ? void 0 : valueOrFn,
    subs: void 0,
    subsTail: void 0,
    deps: void 0,
    depsTail: void 0,
    flags: isComputed ? ReactiveFlags.None : ReactiveFlags.Mutable,
    get() {
      if (activeSub !== void 0) {
        link(atom, activeSub, cycle);
      }
      return atom._snapshot;
    },
    subscribe(observerOrFn) {
      const obs = toObserver(observerOrFn);
      const observed = { current: false };
      const e = effect(() => {
        atom.get();
        if (!observed.current) {
          observed.current = true;
        } else {
          obs.next?.(atom._snapshot);
        }
      });
      return {
        unsubscribe: () => {
          e.stop();
        }
      };
    },
    _update(getValue) {
      const prevSub = activeSub;
      const compare = Object.is;
      if (isComputed) {
        activeSub = atom;
        ++cycle;
        atom.depsTail = void 0;
      } else if (getValue === void 0) {
        return false;
      }
      if (isComputed) {
        atom.flags = ReactiveFlags.Mutable | ReactiveFlags.RecursedCheck;
      }
      try {
        const oldValue = atom._snapshot;
        const newValue = typeof getValue === "function" ? getValue(oldValue) : getValue === void 0 && isComputed ? getter(oldValue) : getValue;
        if (oldValue === void 0 || !compare(oldValue, newValue)) {
          atom._snapshot = newValue;
          return true;
        }
        return false;
      } finally {
        activeSub = prevSub;
        if (isComputed) {
          atom.flags &= ~ReactiveFlags.RecursedCheck;
        }
        purgeDeps(atom);
      }
    }
  };
  if (isComputed) {
    atom.flags = ReactiveFlags.Mutable | ReactiveFlags.Dirty;
    atom.get = function() {
      const flags = atom.flags;
      if (flags & ReactiveFlags.Dirty || flags & ReactiveFlags.Pending && checkDirty(atom.deps, atom)) {
        if (atom._update()) {
          const subs = atom.subs;
          if (subs !== void 0) {
            shallowPropagate(subs);
          }
        }
      } else if (flags & ReactiveFlags.Pending) {
        atom.flags = flags & ~ReactiveFlags.Pending;
      }
      if (activeSub !== void 0) {
        link(atom, activeSub, cycle);
      }
      return atom._snapshot;
    };
  } else {
    atom.set = function(valueOrFn2) {
      if (atom._update(valueOrFn2)) {
        const subs = atom.subs;
        if (subs !== void 0) {
          propagate(subs);
          shallowPropagate(subs);
          flush();
        }
      }
    };
  }
  return atom;
}
function effect(fn) {
  const run = () => {
    const prevSub = activeSub;
    activeSub = effectObj;
    ++cycle;
    effectObj.depsTail = void 0;
    effectObj.flags = ReactiveFlags.Watching | ReactiveFlags.RecursedCheck;
    try {
      return fn();
    } finally {
      activeSub = prevSub;
      effectObj.flags &= ~ReactiveFlags.RecursedCheck;
      purgeDeps(effectObj);
    }
  };
  const effectObj = {
    deps: void 0,
    depsTail: void 0,
    subs: void 0,
    subsTail: void 0,
    flags: ReactiveFlags.Watching | ReactiveFlags.RecursedCheck,
    notify() {
      const flags = this.flags;
      if (flags & ReactiveFlags.Dirty || flags & ReactiveFlags.Pending && checkDirty(this.deps, this)) {
        run();
      } else {
        this.flags = ReactiveFlags.Watching;
      }
    },
    stop() {
      this.flags = ReactiveFlags.None;
      this.depsTail = void 0;
      purgeDeps(this);
    }
  };
  run();
  return effectObj;
}
class Store {
  constructor(valueOrFn) {
    this.atom = createAtom(
      valueOrFn
    );
  }
  setState(updater) {
    this.atom.set(updater);
  }
  get state() {
    return this.atom.get();
  }
  get() {
    return this.state;
  }
  subscribe(observerOrFn) {
    return this.atom.subscribe(toObserver(observerOrFn));
  }
}
function defaultCompare(a, b) {
  return a === b;
}
function useStore(atom, selector, compare = defaultCompare) {
  const subscribe = reactExports.useCallback(
    (handleStoreChange) => {
      if (!atom) {
        return () => {
        };
      }
      const { unsubscribe } = atom.subscribe(handleStoreChange);
      return unsubscribe;
    },
    [atom]
  );
  const boundGetSnapshot = reactExports.useCallback(() => atom?.get(), [atom]);
  const selectedSnapshot = withSelectorExports.useSyncExternalStoreWithSelector(
    subscribe,
    boundGetSnapshot,
    boundGetSnapshot,
    selector,
    compare
  );
  return selectedSnapshot;
}
const appStore = new Store({
  activeTab: "todos",
  viewMode: "table",
  searchQuery: ""
});
function setTab(tab) {
  appStore.setState((s) => ({ ...s, activeTab: tab }));
}
function setViewMode(mode) {
  appStore.setState((s) => ({ ...s, viewMode: mode }));
}
function setSearchQuery(q) {
  appStore.setState((s) => ({ ...s, searchQuery: q }));
}
function cn(...inputs) {
  return twMerge(clsx(inputs));
}
const appCss = "/assets/app-C3pLFFS8.css";
function makeQueryClient() {
  return new QueryClient({
    defaultOptions: { queries: { staleTime: 1e3 * 60 * 5, retry: 1 } }
  });
}
let browserQueryClient;
function getQueryClient() {
  if (typeof window === "undefined") return makeQueryClient();
  if (!browserQueryClient) browserQueryClient = makeQueryClient();
  return browserQueryClient;
}
const Route$4 = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "TanStack Full Demo" }
    ],
    links: [{ rel: "stylesheet", href: appCss }]
  }),
  // Use component instead of shellComponent to avoid SSR issues with hooks
  component: RootComponent
});
const tabs = [
  { id: "todos", label: "Todos", href: "/todos", icon: SquareCheckBig },
  { id: "posts", label: "Posts", href: "/posts", icon: FileText },
  { id: "users", label: "Users", href: "/users", icon: Users }
];
function Header() {
  const activeTab = useStore(appStore, (s) => s.activeTab);
  return /* @__PURE__ */ jsxRuntimeExports.jsx("header", { className: "border-b bg-white/80 backdrop-blur sticky top-0 z-40", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-6xl mx-auto px-4 h-14 flex items-center gap-3", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/", className: "flex items-center gap-2 font-bold text-foreground hover:text-primary transition-colors", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(LayoutDashboard, { className: "w-5 h-5 text-primary" }),
      "TanStack Demo"
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "hidden sm:block text-xs text-muted-foreground border-l pl-3 ml-1", children: "Query · Table · Virtual · Form · Store" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("nav", { className: "ml-auto flex gap-1", children: tabs.map((tab) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
      Link,
      {
        to: tab.href,
        onClick: () => setTab(tab.id),
        className: cn(
          "flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-colors",
          activeTab === tab.id ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
        ),
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(tab.icon, { className: "w-3.5 h-3.5" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "hidden sm:inline", children: tab.label })
        ]
      },
      tab.id
    )) })
  ] }) });
}
function RootComponent() {
  const queryClient = getQueryClient();
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("html", { lang: "en", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("head", { children: /* @__PURE__ */ jsxRuntimeExports.jsx(HeadContent, {}) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("body", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(QueryClientProvider, { client: queryClient, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-screen bg-gradient-to-br from-slate-50 via-violet-50/20 to-indigo-50/30", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Header, {}),
          /* @__PURE__ */ jsxRuntimeExports.jsx("main", { className: "max-w-6xl mx-auto px-4 py-8", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Outlet, {}) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(ReactQueryDevtools2, { initialIsOpen: false })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Scripts, {})
    ] })
  ] });
}
const $$splitComponentImporter$3 = () => import("./users-DhlSTVm3.mjs");
const Route$3 = createFileRoute("/users")({
  component: lazyRouteComponent($$splitComponentImporter$3, "component")
});
const API = "https://jsonplaceholder.typicode.com";
const todosQuery = {
  queryKey: ["todos"],
  queryFn: async () => {
    const res = await fetch(`${API}/todos?_limit=20`);
    return res.json();
  }
};
const $$splitComponentImporter$2 = () => import("./todos-Cam4zwCj.mjs");
const Route$2 = createFileRoute("/todos")({
  loader: () => todosQuery,
  // prefetch hint
  component: lazyRouteComponent($$splitComponentImporter$2, "component")
});
const $$splitComponentImporter$1 = () => import("./posts-DWtvAVnK.mjs");
const Route$1 = createFileRoute("/posts")({
  component: lazyRouteComponent($$splitComponentImporter$1, "component")
});
const $$splitComponentImporter = () => import("./index-DpVibK4N.mjs");
const Route = createFileRoute("/")({
  component: lazyRouteComponent($$splitComponentImporter, "component")
});
const UsersRoute = Route$3.update({
  id: "/users",
  path: "/users",
  getParentRoute: () => Route$4
});
const TodosRoute = Route$2.update({
  id: "/todos",
  path: "/todos",
  getParentRoute: () => Route$4
});
const PostsRoute = Route$1.update({
  id: "/posts",
  path: "/posts",
  getParentRoute: () => Route$4
});
const IndexRoute = Route.update({
  id: "/",
  path: "/",
  getParentRoute: () => Route$4
});
const rootRouteChildren = {
  IndexRoute,
  PostsRoute,
  TodosRoute,
  UsersRoute
};
const routeTree = Route$4._addFileChildren(rootRouteChildren)._addFileTypes();
function getRouter() {
  const router2 = createRouter({ routeTree, defaultPreload: "intent", scrollRestoration: true });
  return router2;
}
const router = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  getRouter
}, Symbol.toStringTag, { value: "Module" }));
export {
  API as A,
  useStore as a,
  appStore as b,
  cn as c,
  setViewMode as d,
  setTab as e,
  router as r,
  setSearchQuery as s,
  todosQuery as t,
  useQueryClient as u
};
