"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = FallbackLoading;
const react_1 = __importDefault(require("react"));
function FallbackLoading() {
    return (<div className='min-h-screen w-full flex flex-col items-center justify-center'>
      <span>Loading....</span>
    </div>);
}
