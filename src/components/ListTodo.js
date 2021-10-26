import React, { useState } from "react";
import { DeleteIcon, EditIcon } from "@chakra-ui/icons";
import {
  Accordion,
  AccordionItem,
  AccordionButton,
  Box,
  AccordionPanel,
  AccordionIcon,
  Button,
  Text,
  useDisclosure,
  Badge,
} from "@chakra-ui/react";
import { ModalEdit } from "./ModalEdit";
import { useSelector } from "react-redux";
import { todosSelector } from "../redux/selector";
export default function ListTodo() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { todos } = useSelector(todosSelector);
  const [currentTodo, setCurrentTodo] = useState({});

  function renderBage(status) {
    switch (status) {
      case "initial":
        return (
          <Badge ml="1" colorScheme="cyan">
            New
          </Badge>
        );
      case "todo":
        return (
          <Badge ml="1" colorScheme="purple">
            Working
          </Badge>
        );
      case "review":
        return (
          <Badge ml="1" colorScheme="orange">
            Review
          </Badge>
        );
      case "done":
        return (
          <Badge ml="1" colorScheme="green">
            Done
          </Badge>
        );
      case "keeping":
        return (
          <Badge ml="1" colorScheme="green">
            Keeping
          </Badge>
        );
      default:
        return (
          <Badge variant="outline" colorScheme="green">
            Default
          </Badge>
        );
    }
  }

  return (
    <div className="mt-10" style={{ maxWidth: 768 }}>
      <Accordion allowToggle>
        {todos.length > 0
          ? todos.map((todo) => (
              <AccordionItem key={todo._id}>
                <h2>
                  <AccordionButton>
                    <Box flex="1" textAlign="left">
                      {todo.title}
                      {renderBage(todo.status)}
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
                      onClick={() => {
                        setCurrentTodo(todo);
                        onOpen();
                      }}
                    >
                      edit
                    </Button>
                    <Button
                      leftIcon={<DeleteIcon />}
                      colorScheme="red"
                      variant="outline"
                    >
                      remove
                    </Button>
                  </div>
                </AccordionPanel>
              </AccordionItem>
            ))
          : null}
      </Accordion>
      <ModalEdit isOpen={isOpen} onClose={onClose} dataInit={currentTodo} />
    </div>
  );
}
