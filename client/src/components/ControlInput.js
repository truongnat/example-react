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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ControlInputComp = ControlInputComp;
const react_1 = require("@chakra-ui/react");
const react_2 = __importStar(require("react"));
const react_hook_form_1 = require("react-hook-form");
const ai_1 = require("react-icons/ai");
function ControlInputComp(_a) {
    var { name, control, rules, errorMessage = "", label, placeholder = name, type, isPassword, component: Component = react_1.Input, children } = _a, rest = __rest(_a, ["name", "control", "rules", "errorMessage", "label", "placeholder", "type", "isPassword", "component", "children"]);
    const [show, setShow] = react_2.default.useState(false);
    const handleShowInput = () => setShow(!show);
    const { colorMode } = (0, react_1.useColorMode)();
    function checkTypeInput() {
        return isPassword && !show ? "password" : type || "text";
    }
    return (<react_hook_form_1.Controller name={name} control={control} rules={rules} render={({ field }) => (<react_1.FormControl isInvalid={errorMessage}>
          <react_1.FormLabel>{label}</react_1.FormLabel>
          <react_1.InputGroup>
            <Component {...field} {...rest} type={checkTypeInput()} color={colorMode === "light" ? "black" : "white"} placeholder={placeholder}>
              {children}
            </Component>
            {isPassword && (<react_1.InputRightElement>
                <react_1.IconButton onClick={handleShowInput} icon={show ? <ai_1.AiOutlineEyeInvisible /> : <ai_1.AiOutlineEye />}/>
              </react_1.InputRightElement>)}
          </react_1.InputGroup>
          {errorMessage && <react_1.FormErrorMessage>{errorMessage}</react_1.FormErrorMessage>}
        </react_1.FormControl>)}/>);
}
exports.default = (0, react_2.memo)(ControlInputComp);
