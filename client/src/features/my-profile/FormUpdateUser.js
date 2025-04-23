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
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = FormUpdateUser;
const react_1 = __importStar(require("react"));
const react_2 = require("@chakra-ui/react");
const components_1 = require("../../components");
const react_hook_form_1 = require("react-hook-form");
const utils_1 = require("../../utils");
const react_router_dom_1 = require("react-router-dom");
const react_redux_1 = require("react-redux");
const selector_1 = require("../../redux/selector");
const actions_1 = require("../../redux/actions");
function FormUpdateUser({ avatarUrl }) {
    var _a, _b, _c;
    const history = (0, react_router_dom_1.useHistory)();
    const { user } = (0, react_redux_1.useSelector)(selector_1.userSelector);
    const loading = (0, react_redux_1.useSelector)(selector_1.userLoadingSelector);
    const dispatch = (0, react_redux_1.useDispatch)();
    const { control, handleSubmit, formState: { errors }, reset, watch, setValue, } = (0, react_hook_form_1.useForm)({
        defaultValues: {
            email: "",
            username: "",
            currentPassword: "",
            newPassword: "",
            reNewPassword: "",
            avatarUrl: utils_1.MemoryClient.get("c_avt") || "",
        },
    });
    const onSubmit = (data) => dispatch((0, actions_1.genericAction)(actions_1.UPDATE_USER, actions_1.ENUM_STATUS.FETCHING, { data, reset }));
    (0, react_1.useEffect)(() => {
        if (user) {
            setValue("email", user.email);
            setValue("username", user.username);
        }
    }, [user, setValue]);
    (0, react_1.useEffect)(() => {
        setValue("avatarUrl", avatarUrl);
    }, [avatarUrl]);
    return (<react_2.Stack>
      <components_1.ControlInput name={"email"} control={control} label={"Email address"} isDisabled={true}/>

      <components_1.ControlInput name={"username"} control={control} label={"Username"}/>

      <components_1.ControlInput name={"currentPassword"} autoComplete={"off"} control={control} isPassword rules={{
            minLength: {
                value: 8,
                message: "Current password must have at least 8 characters!",
            },
        }} label={"Current password"} errorMessage={(_a = errors === null || errors === void 0 ? void 0 : errors.currentPassword) === null || _a === void 0 ? void 0 : _a.message}/>

      <components_1.ControlInput name={"newPassword"} autoComplete={"off"} control={control} isPassword rules={{
            minLength: {
                value: 8,
                message: "New password must have at least 8 characters!",
            },
        }} label={"New password"} errorMessage={(_b = errors === null || errors === void 0 ? void 0 : errors.newPassword) === null || _b === void 0 ? void 0 : _b.message}/>

      <components_1.ControlInput name={"reNewPassword"} autoComplete={"off"} control={control} isPassword rules={{
            minLength: {
                value: 8,
                message: "Repeat new password must have at least 8 characters!",
            },
            validate: (value) => value === watch("newPassword") ||
                "The repeat new password do not match!",
        }} label={"Repeat new password"} errorMessage={(_c = errors === null || errors === void 0 ? void 0 : errors.reNewPassword) === null || _c === void 0 ? void 0 : _c.message}/>

      <react_2.Stack spacing={6} direction={["column", "row"]} className={'mt-10'}>
        <react_2.Button bg={"red.400"} color={"white"} w="full" _hover={{
            bg: "red.500",
        }} onClick={() => history.push("/")}>
          Cancel
        </react_2.Button>
        <react_2.Button isLoading={loading} bg={"blue.400"} color={"white"} w="full" _hover={{
            bg: "blue.500",
        }} onClick={handleSubmit(onSubmit)}>
          Submit
        </react_2.Button>
      </react_2.Stack>
    </react_2.Stack>);
}
