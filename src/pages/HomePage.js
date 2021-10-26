import React, { useEffect } from "react";

import { Stack, Flex, Text, Box } from "@chakra-ui/react";
import { SideFilter } from "../components/SideFilter";
import { FormTodo } from "../components/FormTodo";
import ListTodo from "../components/ListTodo";
import { useDispatch, useSelector } from "react-redux";
import {
  CREATE_TODO,
  ENUM_STATUS,
  genericAction,
  GET_ALL_TODO,
} from "../redux/actions";
import { todosSelector } from "../redux/selector";
export default function HomePage() {
  const dispatch = useDispatch();
  const { loadingCreate } = useSelector(todosSelector);
  useEffect(() => {
    dispatch(genericAction(GET_ALL_TODO, ENUM_STATUS.FETCHING));
  }, []);

  const createTodo = (data) => {
    dispatch(genericAction(CREATE_TODO, ENUM_STATUS.FETCHING, data));
  };
  return (
    <Stack minH={"100vh"} alignItems="center" justifyContent="start">
      <Box mt={30}>
        <Text
          as={"h2"}
          fontSize="4xl"
          bgClip="text"
          bgGradient="linear(to-r, teal.500, green.500)"
          fontWeight="bold"
          textAlign="center"
        >
          Todo App
        </Text>
      </Box>
      <Box minW={768}>
        <Flex color="white" className="space-x-10">
          <Box className="border rounded-md p-5" w="200px">
            <SideFilter />
          </Box>
          <Box flex="1">
            <FormTodo
              callback={(data) => createTodo(data)}
              loading={loadingCreate}
              resetValue={loadingCreate ? null : { title: "", content: "" }}
            />
          </Box>
        </Flex>
        <ListTodo />
      </Box>
    </Stack>
  );
}
