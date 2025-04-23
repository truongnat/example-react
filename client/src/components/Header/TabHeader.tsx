import React from "react";
import { Box } from "@chakra-ui/react";
import { PAGE_KEYS } from "../../constants";
import ButtonRoute from "../ButtonRoute";

export default function TabHeader() {
  return (
    <Box className="flex space-x-5">
      <ButtonRoute classNames={"font-bold"} route={PAGE_KEYS.TodoPage}>
        Todo
      </ButtonRoute>
      <ButtonRoute classNames={"font-bold"} route={PAGE_KEYS.ChatPage}>
        Chat
      </ButtonRoute>
    </Box>
  );
}
