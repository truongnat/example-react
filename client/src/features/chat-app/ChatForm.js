"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ChatForm;
const react_1 = __importDefault(require("react"));
const react_2 = require("@chakra-ui/react");
const io5_1 = require("react-icons/io5");
function ChatForm() {
    function handleSendMessage() { }
    return (<react_2.InputGroup size="md">
      <react_2.Input placeholder="Enter chat"/>
      <react_2.InputRightElement>
        <react_2.IconButton variant="outline" colorScheme="teal" aria-label="Send email" icon={<io5_1.IoSendOutline />} h="1.75rem" size="sm" onClick={handleSendMessage}/>
      </react_2.InputRightElement>
    </react_2.InputGroup>);
}
