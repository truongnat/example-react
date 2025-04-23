"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ListTodo;
const react_1 = __importDefault(require("react"));
const react_2 = require("@chakra-ui/react");
const react_redux_1 = require("react-redux");
const selector_1 = require("../../redux/selector");
const TodoItem_1 = __importDefault(require("./TodoItem"));
function ListTodo() {
    const { todoList, loading } = (0, react_redux_1.useSelector)(selector_1.todoSelector);
    return (<div className="mt-10 w-full">
      <react_2.Accordion allowToggle className="w-full">
        {todoList.length > 0 &&
            todoList.map((todo) => <TodoItem_1.default todo={todo} key={todo._id}/>)}

        {!todoList.length && !loading && (<react_2.Alert status="info">
            <react_2.AlertIcon />
            There are no records left for this status!
          </react_2.Alert>)}
      </react_2.Accordion>
    </div>);
}
