"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ButtonRoute;
const react_1 = __importDefault(require("react"));
const react_2 = require("@chakra-ui/react");
const react_router_dom_1 = require("react-router-dom");
const utils_1 = require("../utils");
function ButtonRoute({ children, route, classNames }) {
    const history = (0, react_router_dom_1.useHistory)();
    return (<react_2.Box onClick={() => history.push(route)}>
      <react_2.Text className={(0, utils_1.classes)("cursor-pointer hover:underline", classNames)}>
        {children}
      </react_2.Text>
    </react_2.Box>);
}
