import React, { useEffect } from "react";
import { Flex, Box } from "@chakra-ui/react";
import { useDispatch } from "react-redux";
import { ENUM_STATUS, genericAction, GET_ALL_TODO } from "../redux/actions";
import { TodoApp } from "../features";
import { MainLayout } from "../layout";
import { ENUM_STATUS_TODO } from "../constants";

export default function TodoPage() {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(
      genericAction(GET_ALL_TODO, ENUM_STATUS.FETCHING, {
        status: ENUM_STATUS_TODO.INIT,
      })
    );
  }, []);

  return (
    <MainLayout title={"Todo App"}>
      <Box maxW={'600px'} mx={'auto'}>
        <Flex className="w-full flex flex-wrap justify-center px-10 space-y-5 sm:space-y-0 sm:px-0 sm:justify-between">
          <TodoApp.SideFilter />
          <TodoApp.FormCreateTodo />
        </Flex>
        <TodoApp.ListTodo />
      </Box>
    </MainLayout>
  );
}
