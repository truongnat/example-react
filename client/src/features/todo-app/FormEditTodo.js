"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = FormEditTodo;
const react_1 = __importDefault(require("react"));
const react_2 = require("@chakra-ui/react");
const react_hook_form_1 = require("react-hook-form");
const constants_1 = require("../../constants");
const components_1 = require("../../components");
const react_redux_1 = require("react-redux");
const selector_1 = require("../../redux/selector");
const actions_1 = require("../../redux/actions");
const gr_1 = require("react-icons/gr");
function FormEditTodo({ dataInit, onClose }) {
    var _a, _b, _c;
    const { control, formState: { errors }, handleSubmit, } = (0, react_hook_form_1.useForm)({
        defaultValues: Object.assign({}, dataInit),
    });
    const dispatch = (0, react_redux_1.useDispatch)();
    const { status: statusType } = (0, react_redux_1.useSelector)(selector_1.todoSelector);
    const onSubmit = (todo) => {
        const payload = {
            data: Object.assign(Object.assign({}, todo), { id: dataInit._id }),
            statusType,
            onClose,
        };
        dispatch((0, actions_1.genericAction)(actions_1.UPDATE_TODO, actions_1.ENUM_STATUS.FETCHING, payload));
    };
    return (<form onSubmit={handleSubmit(onSubmit)} className="w-full p-5 border rounded-md">
      <components_1.ControlInput name={"title"} control={control} rules={{ required: "Title field is required" }} errorMessage={(_a = errors === null || errors === void 0 ? void 0 : errors.title) === null || _a === void 0 ? void 0 : _a.message}/>

      <components_1.ControlInput name={"status"} control={control} rules={{ required: "Status field is required" }} errorMessage={(_b = errors === null || errors === void 0 ? void 0 : errors.status) === null || _b === void 0 ? void 0 : _b.message} component={react_2.Select}>
        {constants_1.STATUS_TODO.map((item) => (<option key={item} value={item}>
            {item}
          </option>))}
      </components_1.ControlInput>

      <components_1.ControlInput name={"content"} control={control} rules={{ required: "Content field is required" }} errorMessage={(_c = errors === null || errors === void 0 ? void 0 : errors.content) === null || _c === void 0 ? void 0 : _c.message} component={react_2.Textarea}/>

      <div className="text-right mt-5 space-x-5">
        <react_2.Button onClick={onClose} variant="outline" type="button">
          Cancel
        </react_2.Button>
        <react_2.Button leftIcon={<gr_1.GrDocumentUpdate />} loadingText="Submitting" colorScheme="teal" variant="outline" type="submit">
          Update
        </react_2.Button>
      </div>
    </form>);
}
