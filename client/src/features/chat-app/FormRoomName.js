"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = FormRoomName;
const react_1 = __importDefault(require("react"));
const components_1 = require("../../components");
const react_hook_form_1 = require("react-hook-form");
const react_2 = require("@chakra-ui/react");
function FormRoomName({ onNext }) {
    var _a;
    const { control, handleSubmit, formState: { errors }, } = (0, react_hook_form_1.useForm)({
        defaultValues: {
            name: "",
        },
    });
    const onSubmit = (data) => {
        onNext(data);
    };
    return (<react_2.Box>
      <components_1.ControlInput name={"name"} control={control} rules={{
            required: "Name room is required!",
            minLength: {
                value: 4,
                message: "Name room must have at least 4 characters!",
            },
            maxLength: {
                value: 50,
                message: "Name room max 50 characters!",
            },
        }} label={"Name room"} errorMessage={(_a = errors === null || errors === void 0 ? void 0 : errors.name) === null || _a === void 0 ? void 0 : _a.message}/>
      <react_2.Flex className="mt-5 justify-end">
        <react_2.Button size="sm" onClick={handleSubmit(onSubmit)}>
          Next
        </react_2.Button>
      </react_2.Flex>
    </react_2.Box>);
}
