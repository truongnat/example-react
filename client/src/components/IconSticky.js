"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = IconSticky;
const react_1 = __importDefault(require("react"));
const ai_1 = require("react-icons/ai");
const utils_1 = require("../utils");
function IconSticky({ icon: Icon, fn = () => { }, customClass = 'bg-blue-500', sizeDefault = 35, colorDefault = 'white', }) {
    return (<div onClick={fn} className={(0, utils_1.classes)('w-16 h-16 flex items-center justify-center rounded-full fixed right-10 bottom-10 cursor-pointer', customClass)}>
      {Icon || <ai_1.AiOutlinePlus size={sizeDefault} color={colorDefault}/>}
    </div>);
}
