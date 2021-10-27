import React, { useEffect } from "react";

import { Stack, Flex, Text, Box } from "@chakra-ui/react";
import { SideFilter } from "../components/SideFilter";
import { FormCreateTodo } from "../components/FormCreateTodo";
import ListTodo from "../components/ListTodo";
import { useDispatch } from "react-redux";
import { ENUM_STATUS, genericAction, GET_ALL_TODO } from "../redux/actions";
export default function HomePage() {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(genericAction(GET_ALL_TODO, ENUM_STATUS.FETCHING));
  }, [dispatch]);

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
          className="my-5"
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
            <FormCreateTodo />
          </Box>
        </Flex>
        <ListTodo />
      </Box>
    </Stack>
  );
}
