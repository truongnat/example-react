"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Logo;
const react_1 = require("@chakra-ui/react");
const react_2 = __importDefault(require("react"));
const react_router_dom_1 = require("react-router-dom");
const constants_1 = require("../../constants");
function Logo() {
    const history = (0, react_router_dom_1.useHistory)();
    return (<react_1.Box className={"font-bold text-xl cursor-pointer"} onClick={() => history.push(constants_1.PAGE_KEYS.HomePage)}>
      Peanut
    </react_1.Box>);
}
