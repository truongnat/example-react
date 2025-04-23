"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = FormCreateTodo;
const react_1 = __importDefault(require("react"));
const icons_1 = require("@chakra-ui/icons");
const react_2 = require("@chakra-ui/react");
const react_hook_form_1 = require("react-hook-form");
const react_redux_1 = require("react-redux");
const actions_1 = require("../../redux/actions");
const selector_1 = require("../../redux/selector");
const components_1 = require("../../components");
const TodoBadge_1 = __importDefault(require("./TodoBadge"));
const constants_1 = require("../../constants");
const initForm = {
    title: "",
    content: "",
};
function FormCreateTodo() {
    var _a, _b;
    const { control, formState: { errors }, handleSubmit, reset, } = (0, react_hook_form_1.useForm)({
        defaultValues: Object.assign({}, initForm),
    });
    const toast = (0, react_2.useToast)();
    const dispatch = (0, react_redux_1.useDispatch)();
    const { status: statusType } = (0, react_redux_1.useSelector)(selector_1.todoSelector);
    const onSubmit = (data) => {
        dispatch((0, actions_1.genericAction)(actions_1.CREATE_TODO, actions_1.ENUM_STATUS.FETCHING, {
            data,
            statusType,
            toast,
            reset,
        }));
    };
    return (<react_2.Box className="w-full sm:w-3/5 p-5 border rounded-md">
      <form onSubmit={handleSubmit(onSubmit)}>
        <components_1.ControlInput name={"title"} control={control} rules={{ required: "Title field is required!" }} errorMessage={(_a = errors === null || errors === void 0 ? void 0 : errors.title) === null || _a === void 0 ? void 0 : _a.message}/>

        <components_1.ControlInput name={"content"} control={control} rules={{ required: "Content field is required!" }} errorMessage={(_b = errors === null || errors === void 0 ? void 0 : errors.content) === null || _b === void 0 ? void 0 : _b.message} component={react_2.Textarea}/>

        <div className="text-right my-5 space-x-5">
          <react_2.Button onClick={() => reset(initForm)} type="button">
            Clear
          </react_2.Button>
          <react_2.Button leftIcon={<icons_1.AddIcon />} loadingText="Submitting" colorScheme="teal" variant="outline" type="submit">
            Submit
          </react_2.Button>
        </div>
        <div className="">
          <react_2.Code>Status App : </react_2.Code>
        </div>
        <div className="mt-5">
          {constants_1.STATUS_TODO.map((status) => (<TodoBadge_1.default key={status} status={status}/>))}
        </div>
      </form>
    </react_2.Box>);
}
