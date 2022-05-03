import React from "react";
import { Accordion, Alert, AlertIcon } from "@chakra-ui/react";
import { useSelector } from "react-redux";
import { todoSelector } from "../../redux/selector";
import TodoItem from "./TodoItem";

export default function ListTodo() {
  const { todoList, loading } = useSelector(todoSelector);

  return (
    <div className="mt-10 w-full">
      <Accordion allowToggle className="w-full">
        {todoList.length > 0 &&
          todoList.map((todo) => <TodoItem todo={todo} key={todo._id} />)}

        {!todoList.length && !loading && (
          <Alert status="info">
            <AlertIcon />
            There are no records left for this status!
          </Alert>
        )}
      </Accordion>
    </div>
  );
}
