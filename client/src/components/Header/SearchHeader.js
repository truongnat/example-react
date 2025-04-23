"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = SearchHeader;
const react_1 = require("@chakra-ui/react");
const react_2 = __importStar(require("react"));
const SuggestList_1 = __importDefault(require("./SuggestList"));
const react_use_1 = require("react-use");
const lodash_1 = require("lodash");
const ai_1 = require("react-icons/ai");
function SearchHeader() {
    const [isFocus, setIsFocus] = (0, react_2.useState)(false);
    const [txtSearch, setTxtSearch] = (0, react_2.useState)("");
    const [loading, setLoading] = (0, react_2.useState)(false);
    const [results, setResults] = (0, react_2.useState)([]);
    const ref = (0, react_2.useRef)(null);
    (0, react_use_1.useClickAway)(ref, () => {
        setIsFocus(false);
        if (!txtSearch) {
            setResults([]);
        }
    });
    function onChangeSearch(value) {
        setTxtSearch(value);
        if (value) {
            debouncedSearch(value);
        }
    }
    function searchUserWithInput(value) {
        // setLoading(true);
        // new SearchService()
        //   .searchUser(value)
        //   .then((response) => {
        //     setResults(response?.data?.data || []);
        //   })
        //   .finally(() => {
        //     setLoading(false);
        //   });
    }
    const debouncedSearch = (0, react_2.useCallback)(() => (0, lodash_1.debounce)((nextValue) => searchUserWithInput(nextValue), 1000), []);
    return (<react_1.Box className="w-2/5 relative" ref={ref}>
      <react_1.InputGroup className="">
        <react_1.Input placeholder="Search friend" value={txtSearch} onChange={(e) => onChangeSearch(e.target.value)} onFocus={() => setIsFocus(true)}/>
        <react_1.InputRightElement className="cursor-pointer" children={loading ? (<react_1.Spinner />) : (<ai_1.AiOutlineClose onClick={() => onChangeSearch("")}/>)}/>
      </react_1.InputGroup>

      {isFocus && <SuggestList_1.default results={results}/>}
    </react_1.Box>);
}
