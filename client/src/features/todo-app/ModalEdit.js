"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ModalEdit;
const react_1 = __importDefault(require("react"));
const react_2 = require("@chakra-ui/react");
const FormEditTodo_1 = __importDefault(require("./FormEditTodo"));
function ModalEdit({ onClose, isOpen, dataInit }) {
    return (<react_2.Modal isCentered onClose={onClose} isOpen={isOpen} motionPreset='slideInBottom'>
      <react_2.ModalOverlay />
      <react_2.ModalContent>
        <react_2.Heading className='py-5 text-center' as='h2' bgClip='text' bgGradient='linear(to-r, teal.500, green.500)' size='md'>
          Edit Todo
        </react_2.Heading>
        <FormEditTodo_1.default dataInit={dataInit} onClose={onClose}/>
      </react_2.ModalContent>
    </react_2.Modal>);
}
