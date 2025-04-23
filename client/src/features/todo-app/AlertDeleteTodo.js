"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = AlertDeleteTodo;
const react_1 = __importDefault(require("react"));
const react_2 = require("@chakra-ui/react");
const react_redux_1 = require("react-redux");
const actions_1 = require("../../redux/actions");
const selector_1 = require("../../redux/selector");
function AlertDeleteTodo({ todo, onClose, isOpen }) {
    const cancelRef = react_1.default.useRef();
    const dispatch = (0, react_redux_1.useDispatch)();
    const toast = (0, react_2.useToast)();
    const { status: statusType } = (0, react_redux_1.useSelector)(selector_1.todoSelector);
    const onSubmit = () => {
        dispatch((0, actions_1.genericAction)(actions_1.DELETE_TODO, actions_1.ENUM_STATUS.FETCHING, {
            todo,
            toast,
            onClose,
            statusType,
        }));
    };
    return (<react_2.AlertDialog motionPreset="slideInBottom" leastDestructiveRef={cancelRef} onClose={onClose} isOpen={isOpen} isCentered>
      <react_2.AlertDialogOverlay />

      <react_2.AlertDialogContent>
        <react_2.AlertDialogHeader>Delete todo this?</react_2.AlertDialogHeader>
        <react_2.AlertDialogCloseButton />
        <react_2.AlertDialogBody>
          Are you sure you want to delete todo of your todo list? This behavior
          will not be recoverable ? Continue.
        </react_2.AlertDialogBody>
        <react_2.AlertDialogFooter>
          <react_2.Button ref={cancelRef} onClick={onClose}>
            No
          </react_2.Button>
          <react_2.Button onClick={onSubmit} colorScheme="red" ml={3}>
            Yes
          </react_2.Button>
        </react_2.AlertDialogFooter>
      </react_2.AlertDialogContent>
    </react_2.AlertDialog>);
}
