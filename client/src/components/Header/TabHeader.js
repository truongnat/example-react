import React from "react";
import { Box, Link } from "@chakra-ui/react";
import { NavLink } from "react-router-dom";
import { PAGE_KEYS } from "../../constants";

export default function TabHeader() {
  return (
    <Box className="flex space-x-5">
      <Link
        className="text-lg font-semibold"
        as={NavLink}
        to={PAGE_KEYS.TodoPage}
      >
        Todo
      </Link>
      <Link
        className="text-lg font-semibold"
        as={NavLink}
        to={PAGE_KEYS.ChatPage}
      >
        Chat
      </Link>
    </Box>
  );
}
