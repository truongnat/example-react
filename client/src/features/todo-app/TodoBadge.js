"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = TodoBadge;
const react_1 = __importDefault(require("react"));
const react_2 = require("@chakra-ui/react");
const constants_1 = require("../../constants");
const badge = {
    [constants_1.ENUM_STATUS_TODO.INIT]: {
        color: "cyan",
        type: constants_1.ENUM_STATUS_TODO.INIT,
        title: "New",
    },
    [constants_1.ENUM_STATUS_TODO.TODO]: {
        color: "purple",
        type: constants_1.ENUM_STATUS_TODO.TODO,
        title: "Working",
    },
    [constants_1.ENUM_STATUS_TODO.REVIEW]: {
        color: "orange",
        type: constants_1.ENUM_STATUS_TODO.REVIEW,
        title: "Review",
    },
    [constants_1.ENUM_STATUS_TODO.DONE]: {
        color: "green",
        type: constants_1.ENUM_STATUS_TODO.DONE,
        title: "Done",
    },
    [constants_1.ENUM_STATUS_TODO.KEEPING]: {
        color: "telegram",
        type: constants_1.ENUM_STATUS_TODO.KEEPING,
        title: "Keeping",
    },
};
function TodoBadge({ status }) {
    return (<react_2.Badge ml="1" colorScheme={badge[status].color}>
      {badge[status].title}
    </react_2.Badge>);
}
