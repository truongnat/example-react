import { j as jsxRuntimeExports, r as reactExports } from "../_libs/react.mjs";
import { c as cn } from "./router-CMJEBiMK.mjs";
import { c as cva } from "../_libs/class-variance-authority.mjs";
const Card = reactExports.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx("div", { ref, className: cn("rounded-xl border bg-card text-card-foreground shadow", className), ...props }));
Card.displayName = "Card";
const CardHeader = reactExports.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx("div", { ref, className: cn("flex flex-col space-y-1.5 p-6", className), ...props }));
CardHeader.displayName = "CardHeader";
const CardTitle = reactExports.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx("div", { ref, className: cn("font-semibold leading-none tracking-tight", className), ...props }));
CardTitle.displayName = "CardTitle";
const CardDescription = reactExports.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx("div", { ref, className: cn("text-sm text-muted-foreground", className), ...props }));
CardDescription.displayName = "CardDescription";
const CardContent = reactExports.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx("div", { ref, className: cn("p-6 pt-0", className), ...props }));
CardContent.displayName = "CardContent";
const CardFooter = reactExports.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx("div", { ref, className: cn("flex items-center p-6 pt-0", className), ...props }));
CardFooter.displayName = "CardFooter";
const badgeVariants = cva("inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors", {
  variants: {
    variant: {
      default: "border-transparent bg-primary text-primary-foreground shadow hover:bg-primary/80",
      secondary: "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
      destructive: "border-transparent bg-destructive text-white shadow hover:bg-destructive/80",
      outline: "text-foreground",
      success: "border-transparent bg-green-100 text-green-700"
    }
  },
  defaultVariants: { variant: "default" }
});
function Badge({ className, variant, ...props }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: cn(badgeVariants({ variant }), className), ...props });
}
export {
  Badge as B,
  Card as C,
  CardHeader as a,
  CardTitle as b,
  CardDescription as c,
  CardContent as d,
  CardFooter as e
};
