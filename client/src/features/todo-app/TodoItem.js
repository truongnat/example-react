"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = TodoItem;
const icons_1 = require("@chakra-ui/icons");
const react_1 = require("@chakra-ui/react");
const react_2 = __importDefault(require("react"));
const AlertDeleteTodo_1 = __importDefault(require("./AlertDeleteTodo"));
const ModalEdit_1 = __importDefault(require("./ModalEdit"));
const TodoBadge_1 = __importDefault(require("./TodoBadge"));
function TodoItem({ todo }) {
    const { isOpen: openEdit, onOpen: onOpenEdit, onClose: onCloseEdit, } = (0, react_1.useDisclosure)();
    const { isOpen: openDelete, onOpen: onOpenDelete, onClose: onCloseDelete, } = (0, react_1.useDisclosure)();
    return (<react_1.AccordionItem key={todo._id} className="w-full">
      <h2>
        <react_1.AccordionButton>
          <react_1.Box flex="1" textAlign="left">
            {todo.title}
            <TodoBadge_1.default status={todo.status}/>
          </react_1.Box>
          <react_1.AccordionIcon />
        </react_1.AccordionButton>
      </h2>
      <react_1.AccordionPanel pb={4}>
        <react_1.Text>{todo.content}</react_1.Text>
        <div className="text-right space-x-5">
          <react_1.Button leftIcon={<icons_1.EditIcon />} colorScheme="whatsapp" variant="outline" onClick={() => onOpenEdit()}>
            edit
          </react_1.Button>

          <react_1.Button onClick={() => onOpenDelete()} leftIcon={<icons_1.DeleteIcon />} colorScheme="red" variant="outline">
            remove
          </react_1.Button>

          <AlertDeleteTodo_1.default todo={todo} isOpen={openDelete} onClose={onCloseDelete}/>
          <ModalEdit_1.default isOpen={openEdit} onClose={onCloseEdit} dataInit={todo}/>
        </div>
      </react_1.AccordionPanel>
    </react_1.AccordionItem>);
}
