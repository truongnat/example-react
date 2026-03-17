import { r as reactExports, j as jsxRuntimeExports } from "./react.mjs";
import { a as ReactDOM } from "./react-dom.mjs";
import { b as Primitive } from "./radix-ui__react-primitive.mjs";
import { u as useLayoutEffect2 } from "./@radix-ui/react-use-layout-effect+[...].mjs";
var PORTAL_NAME = "Portal";
var Portal = reactExports.forwardRef((props, forwardedRef) => {
  const { container: containerProp, ...portalProps } = props;
  const [mounted, setMounted] = reactExports.useState(false);
  useLayoutEffect2(() => setMounted(true), []);
  const container = containerProp || mounted && globalThis?.document?.body;
  return container ? ReactDOM.createPortal(/* @__PURE__ */ jsxRuntimeExports.jsx(Primitive.div, { ...portalProps, ref: forwardedRef }), container) : null;
});
Portal.displayName = PORTAL_NAME;
export {
  Portal as P
};
