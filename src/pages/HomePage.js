import React, { useEffect } from "react";

import { Stack, Center, Flex, Square, Text, Box } from "@chakra-ui/react";
import { SideFilter } from "../components/SideFilter";
import { FormTodo } from "../components/FormTodo";
import ListTodo from "../components/ListTodo";
export default function HomePage() {
  useEffect(() => {}, []);

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
            <FormTodo />
          </Box>
        </Flex>
        <ListTodo />
      </Box>
    </Stack>
  );
}
