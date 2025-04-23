"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = SuggestList;
const react_1 = __importDefault(require("react"));
const SuggestItem_1 = __importDefault(require("./SuggestItem"));
const header_module_css_1 = __importDefault(require("./header.module.css"));
function SuggestList({ results = [] }) {
    return (<div className={`${header_module_css_1.default.suggestList} z-10 bg-white shadow-lg w-full rounded-lg`}>
      {results.length ? (results.map((u, i) => <SuggestItem_1.default key={i} {...u}/>)) : (<div className='flex p-2 items-center justify-center'>No results</div>)}
    </div>);
}
