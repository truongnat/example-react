"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ChatBox;
const react_1 = __importDefault(require("react"));
const ChatForm_1 = __importDefault(require("./ChatForm"));
const react_2 = require("@chakra-ui/react");
const ChatMessage_1 = __importDefault(require("./ChatMessage"));
function ChatBox({ messages = [] }) {
    return (<react_2.Box maxW={"400px"} h={"25rem"} mx={"auto"} className="w-full border rounded-md flex flex-col justify-between">
      <div className="flex-1 overflow-y-auto p-5 space-y-5">
        {[1, 2, 3, 4, 5, 6, 7, 8, 11, 9].map((i) => (<ChatMessage_1.default key={i} isMe={i % 2}/>))}
      </div>
      <ChatForm_1.default />
    </react_2.Box>);
}
