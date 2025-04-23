"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatLayout = ChatLayout;
const react_1 = require("@chakra-ui/react");
const react_2 = __importDefault(require("react"));
const components_1 = require("../components");
function ChatLayout({ children }) {
    return (<react_1.Stack minH={"100vh"} alignItems="center" justifyContent="space-between">
      <components_1.Header />
      {children}
      <react_1.Box className="mt-28 w-full">
        <components_1.Footer />
      </react_1.Box>
    </react_1.Stack>);
}
