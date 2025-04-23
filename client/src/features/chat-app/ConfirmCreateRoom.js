"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ConfirmCreateRoom;
const react_1 = require("@chakra-ui/react");
const react_2 = __importDefault(require("react"));
const md_1 = require("react-icons/md");
function ConfirmCreateRoom({ onSubmit, loading }) {
    return (<react_1.Flex className="flex-col items-center space-y-5 py-2">
      <react_1.Box className="w-20 h-20 rounded-full border-2 border-green-600 flex flex-row items-center justify-center">
        <md_1.MdOutlineDone size={50} color={"green"}/>
      </react_1.Box>
      <react_1.Text className="text-lg font-medium">Completed create room form!</react_1.Text>
      <react_1.Button size="sm" onClick={onSubmit} isLoading={loading}>
        Submit
      </react_1.Button>
    </react_1.Flex>);
}
