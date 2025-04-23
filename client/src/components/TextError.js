"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = TextError;
const icons_1 = require("@chakra-ui/icons");
const react_1 = require("@chakra-ui/react");
const react_2 = __importDefault(require("react"));
function TextError({ e, txtError }) {
    if (e) {
        return (<div className='flex flex-row items-center justify-start mt-2 space-x-1'>
        <icons_1.CloseIcon w='2.5' h='2.5' color='red'/>
        <react_1.Text color='red'>{txtError}</react_1.Text>
      </div>);
    }
    return null;
}
