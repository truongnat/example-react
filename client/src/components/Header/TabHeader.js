"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = TabHeader;
const react_1 = __importDefault(require("react"));
const react_2 = require("@chakra-ui/react");
const constants_1 = require("../../constants");
const ButtonRoute_1 = __importDefault(require("../ButtonRoute"));
function TabHeader() {
    return (<react_2.Box className="flex space-x-5">
      <ButtonRoute_1.default classNames={"font-bold"} route={constants_1.PAGE_KEYS.TodoPage}>
        Todo
      </ButtonRoute_1.default>
      <ButtonRoute_1.default classNames={"font-bold"} route={constants_1.PAGE_KEYS.ChatPage}>
        Chat
      </ButtonRoute_1.default>
    </react_2.Box>);
}
