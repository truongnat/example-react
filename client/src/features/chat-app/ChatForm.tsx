import React from "react";
import {
  IconButton,
  Input,
  InputGroup,
  InputRightElement,
} from "@chakra-ui/react";
import { IoSendOutline } from "react-icons/io5";

export default function ChatForm() {
  function handleSendMessage() {}

  return (
    <InputGroup size="md">
      <Input placeholder="Enter chat" />
      <InputRightElement>
        <IconButton
          variant="outline"
          colorScheme="teal"
          aria-label="Send email"
          icon={<IoSendOutline />}
          h="1.75rem"
          size="sm"
          onClick={handleSendMessage}
        />
      </InputRightElement>
    </InputGroup>
  );
}
