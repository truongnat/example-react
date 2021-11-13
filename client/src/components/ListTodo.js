import React, { useEffect, useState } from "react";
import { EditIcon } from "@chakra-ui/icons";
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
  useToast,
  Spinner,
  Alert,
  AlertIcon,
} from "@chakra-ui/react";
import { ModalEdit } from "./ModalEdit";
import { useDispatch, useSelector } from "react-redux";
import { todoDeleteSelector, todosSelector } from "../redux/selector";
import { TodoBadge } from "./TodoBadge";
import AlertDeleteTodo from "./AlertDeleteTodo";
import { DELETE_TODO, ENUM_STATUS, genericAction } from "../redux/actions";

export default function ListTodo() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { todos, loading: loadingTodos } = useSelector(todosSelector);
  const dispatch = useDispatch();
  const { error, loading, status } = useSelector(todoDeleteSelector);
  const toast = useToast();
  const [currentTodo, setCurrentTodo] = useState({});

  useEffect(() => {
    if (!loading && status === "success") {
      toast({
        title: `Delete todo successfully!`,
        variant: "top-accent",
        isClosable: true,
        status: "success",
        position: "top",
      });
      dispatch(genericAction(DELETE_TODO, ENUM_STATUS.RESET));
    }
    if (!loading && error) {
      toast({
        title: `Something went wrong!!`,
        description: JSON.stringify(error),
        variant: "top-accent",
        isClosable: true,
        status: "error",
        position: "top",
      });
    }
  }, [error, loading, status, toast, dispatch]);

  return (
    <div className="mt-10 w-full">
      <Accordion allowToggle className="w-full">
        {loadingTodos && (
          <div className="w-full flex flex-row items-center justify-center">
            <Spinner
              thickness="4px"
              speed="0.65s"
              emptyColor="gray.200"
              color="blue.500"
              size="xl"
            />
          </div>
        )}
        {todos.length > 0
          ? todos.map((todo) => (
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
                      onClick={() => {
                        setCurrentTodo(todo);
                        onOpen();
                      }}
                    >
                      edit
                    </Button>
                    <AlertDeleteTodo todo={todo} />
                  </div>
                </AccordionPanel>
              </AccordionItem>
            ))
          : null}
        {!todos.length && !loading && (
          <Alert status="info">
            <AlertIcon />
            There are no records left for this status!
          </Alert>
        )}
      </Accordion>
      <ModalEdit isOpen={isOpen} onClose={onClose} dataInit={currentTodo} />
    </div>
  );
}
