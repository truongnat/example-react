import { r as reactExports } from "../_libs/react.mjs";
import { d as createTable } from "../_libs/tanstack__table-core.mjs";
function flexRender(Comp, props) {
  return !Comp ? null : isReactComponent(Comp) ? /* @__PURE__ */ reactExports.createElement(Comp, props) : Comp;
}
function isReactComponent(component) {
  return isClassComponent(component) || typeof component === "function" || isExoticComponent(component);
}
function isClassComponent(component) {
  return typeof component === "function" && (() => {
    const proto = Object.getPrototypeOf(component);
    return proto.prototype && proto.prototype.isReactComponent;
  })();
}
function isExoticComponent(component) {
  return typeof component === "object" && typeof component.$$typeof === "symbol" && ["react.memo", "react.forward_ref"].includes(component.$$typeof.description);
}
function useReactTable(options) {
  const resolvedOptions = {
    state: {},
    // Dummy state
    onStateChange: () => {
    },
    // noop
    renderFallbackValue: null,
    ...options
  };
  const [tableRef] = reactExports.useState(() => ({
    current: createTable(resolvedOptions)
  }));
  const [state, setState] = reactExports.useState(() => tableRef.current.initialState);
  tableRef.current.setOptions((prev) => ({
    ...prev,
    ...options,
    state: {
      ...state,
      ...options.state
    },
    // Similarly, we'll maintain both our internal state and any user-provided
    // state.
    onStateChange: (updater) => {
      setState(updater);
      options.onStateChange == null || options.onStateChange(updater);
    }
  }));
  return tableRef.current;
}
export {
  flexRender as f,
  useReactTable as u
};
