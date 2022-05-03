import { DeleteIcon, EditIcon } from "@chakra-ui/icons";
import {
  AccordionButton,
  Text,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Button,
  useDisclosure,
} from "@chakra-ui/react";
import React from "react";
import AlertDeleteTodo from "./AlertDeleteTodo";
import ModalEdit from "./ModalEdit";
import TodoBadge from "./TodoBadge";

export default function TodoItem({ todo }) {
  const {
    isOpen: openEdit,
    onOpen: onOpenEdit,
    onClose: onCloseEdit,
  } = useDisclosure();
  const {
    isOpen: openDelete,
    onOpen: onOpenDelete,
    onClose: onCloseDelete,
  } = useDisclosure();
  return (
    <AccordionItem key={todo._id} className="w-full">
      <h2>
        <AccordionButton>
          <Box flex="1" textAlign="left">
            {todo.title}
            <TodoBadge status={todo.status} />
          </Box>
          <AccordionIcon />
        </AccordionButton>
      </h2>
      <AccordionPanel pb={4}>
        <Text>{todo.content}</Text>
        <div className="text-right space-x-5">
          <Button
            leftIcon={<EditIcon />}
            colorScheme="whatsapp"
            variant="outline"
            onClick={() => onOpenEdit()}
          >
            edit
          </Button>

          <Button
            onClick={() => onOpenDelete()}
            leftIcon={<DeleteIcon />}
            colorScheme="red"
            variant="outline"
          >
            remove
          </Button>

          <AlertDeleteTodo
            todo={todo}
            isOpen={openDelete}
            onClose={onCloseDelete}
          />
          <ModalEdit isOpen={openEdit} onClose={onCloseEdit} dataInit={todo} />
        </div>
      </AccordionPanel>
    </AccordionItem>
  );
}
