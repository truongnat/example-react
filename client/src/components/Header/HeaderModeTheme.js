"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = HeaderModeTheme;
const icons_1 = require("@chakra-ui/icons");
const react_1 = require("@chakra-ui/react");
const react_2 = __importDefault(require("react"));
function HeaderModeTheme() {
    const { colorMode, toggleColorMode } = (0, react_1.useColorMode)();
    return (<react_1.Button onClick={toggleColorMode}>
      {colorMode === 'light' ? <icons_1.MoonIcon /> : <icons_1.SunIcon />}
    </react_1.Button>);
}
